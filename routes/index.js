require("dotenv").config();
var express = require("express");
var router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const prisma = require("../lib/prisma");
const bcrypt = require("bcryptjs");

// Home route
router.get("/", function (req, res) {
  res.render("index", {
    title: "FoodForward",
    loggedIn: req.session.loggedIn || false,
  });
});

// About page
router.get("/about", function (req, res) {
  res.render("about", { loggedIn: req.session.loggedIn || false });
});

// Location selection page
router.get("/location", function (req, res) {
  res.render("location", { loggedIn: req.session.loggedIn || false });
});

router.get("/successful", function (req, res) {
  res.render("locationSuccessFul", { loggedIn: req.session.loggedIn || false });
});

// Charity page
router.get("/Charity", function (req, res) {
  res.render("Charity", {
    title: "Charity",
    loggedIn: req.session.loggedIn || false,
  });
});

// Stripe donation route
router.post("/stripe", async function (req, res) {
  try {
    const donationAmount = req.body.amount ? parseFloat(req.body.amount) : 10;
    const ngoId = req.body.ngoId;
    const donationType = req.body.type || "money"; // "money" or "ngo"

    if (isNaN(donationAmount) || donationAmount <= 0) {
      throw new Error("Invalid donation amount.");
    }

    // Check if user is logged in
    if (!req.session.userId) {
      return res.status(401).json({ error: "Please login to make a donation" });
    }

    // Get the base URL from the request
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const productDescription = donationType === "money"
      ? "Monetary Donation to FoodForward Platform"
      : "Donation to Support NGO";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "FoodForward Donation",
              description: productDescription,
            },
            unit_amount: donationAmount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      metadata: {
        userId: req.session.userId,
        ngoId: ngoId || "",
        amount: donationAmount.toString(),
        type: donationType,
      },
    });

    // Store donation in database (already completed since payment is done)
    if (donationType === "money") {
      // Money donation to platform (no NGO)
      const donation = await prisma.userDonation.create({
        data: {
          amount: donationAmount,
          stripeSessionId: session.id,
          status: "completed", // Set to completed immediately
          type: "money",
          userId: req.session.userId,
          // No ngoId for money donations
        },
      });
      console.log(`💰 Money donation created: ${donation.id} - Amount: $${donation.amount} - Status: completed`);
    } else if (ngoId) {
      // NGO donation
      const ngo = await prisma.nGO.findUnique({
        where: { id: ngoId },
      });

      if (ngo) {
        const donation = await prisma.userDonation.create({
          data: {
            amount: donationAmount,
            stripeSessionId: session.id,
            status: "completed", // Set to completed immediately
            type: "ngo",
            userId: req.session.userId,
            ngoId: ngoId,
          },
        });
        console.log(`🏢 NGO donation created: ${donation.id} - Amount: $${donation.amount} - NGO: ${ngo.name} - Status: completed`);
      } else {
        console.warn(`⚠️ Attempted to donate to non-existent NGO: ${ngoId}`);
        console.log(`ℹ️ Available NGOs need to be seeded. Run: npm run seed`);
      }
    } else {
      console.warn(`⚠️ No NGO ID provided for NGO donation request`);
    }

    res.redirect(session.url);
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Stripe complete page
router.get("/complete", async function (req, res) {
  try {
    const sessionId = req.query.session_id;
    let donationDetails = null;

    if (sessionId) {
      // Update donation status to completed
      const donation = await prisma.userDonation.findFirst({
        where: { stripeSessionId: sessionId },
        include: {
          ngo: true,
          user: true,
        },
      });

      if (donation) {
        // Donation is already set to completed, no need to update
        // But keep this for backwards compatibility with old pending donations
        if (donation.status !== "completed") {
          await prisma.userDonation.update({
            where: { id: donation.id },
            data: { status: "completed" },
          });
        }

        // Create donation details based on type
        if (donation.user) {
          donationDetails = {
            amount: donation.amount,
            type: donation.type || "money",
            ngoName: donation.ngo ? donation.ngo.name : "FoodForward Platform",
            ngoLocation: donation.ngo ? donation.ngo.location : null,
            date: donation.createdAt,
            donorName: donation.user.name || donation.user.email,
          };
        } else {
          console.warn("Donation found but missing user relation:", {
            donationId: donation.id,
            hasUser: !!donation.user,
          });
        }
      }
    }

    res.render("complete", {
      loggedIn: req.session.loggedIn || false,
      donation: donationDetails,
    });
  } catch (error) {
    console.error("Error updating donation status:", error);
    console.error("Error details:", error.message);
    res.render("complete", {
      loggedIn: req.session.loggedIn || false,
      donation: null,
    });
  }
});

router.get("/cancel", function (req, res) {
  res.render("cancel", { loggedIn: req.session.loggedIn || false });
});

router.get("/feeding", function (req, res) {
  res.render("awards", {
    title: "Feeding",
    loggedIn: req.session.loggedIn || false,
  });
});

router.get("/partner", function (req, res) {
  res.render("login", { loggedIn: req.session.loggedIn || false });
});

// Register route
router.post("/register", async function (req, res) {
  try {
    const { email, password, name, organisationName, phoneNumber, website, location } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || organisationName || null,
      },
    });

    // Set session
    req.session.loggedIn = true;
    req.session.userId = user.id;
    req.session.userEmail = user.email;

    res.json({ success: true, redirectUrl: "/thankLogin" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login route
router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Set session
    req.session.loggedIn = true;
    req.session.userId = user.id;
    req.session.userEmail = user.email;

    res.json({ success: true, redirectUrl: "/thankLogin" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/logout", function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Logout failed.");
    }
    res.redirect("/");
  });
});

router.get("/thankLogin", function (req, res) {
  res.render("thanklogin", { loggedIn: req.session.loggedIn || false });
});

// My Donations page
router.get("/my-donations", async function (req, res) {
  try {
    // Check if user is logged in
    if (!req.session.userId) {
      return res.redirect("/partner");
    }

    console.log(`📊 Fetching donations for user: ${req.session.userId}`);

    // Fetch user's money donations (UserDonation)
    const moneyDonations = await prisma.userDonation.findMany({
      where: { userId: req.session.userId },
      include: {
        ngo: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch user's food donations (RestaurantDonation)
    const foodDonations = await prisma.restaurantDonation.findMany({
      where: { userId: req.session.userId },
      include: {
        ngo: true,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`💰 Found ${moneyDonations.length} money donations`);
    console.log(`🍽️ Found ${foodDonations.length} food donations`);

    // Combine and transform all donations into a unified format
    const allDonations = [
      ...moneyDonations.map(d => ({
        id: d.id,
        type: d.type || "money", // "money" or "ngo"
        donationType: "monetary", // For display
        amount: d.amount,
        ngoName: d.ngo ? d.ngo.name : "FoodForward Platform",
        ngoLocation: d.ngo ? d.ngo.location : null,
        ngoDescription: d.ngo ? d.ngo.description : "General platform donation",
        status: d.status,
        createdAt: d.createdAt,
      })),
      ...foodDonations.map(d => ({
        id: d.id,
        type: "food",
        donationType: "food", // For display
        restaurantName: d.restaurantName,
        foodType: d.foodType,
        quantity: d.quantity,
        ngoName: d.ngo.name,
        ngoLocation: d.ngo.location,
        ngoDescription: d.ngo.description,
        status: d.status,
        createdAt: d.createdAt,
      })),
    ];

    // Sort by date (newest first)
    allDonations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    console.log(`✅ Returning ${allDonations.length} total donations`);

    res.render("donations", {
      loggedIn: req.session.loggedIn || false,
      donations: allDonations,
      userEmail: req.session.userEmail || "User",
    });
  } catch (error) {
    console.error("❌ Error fetching donations:", error);
    console.error("Error details:", error.message);
    res.render("donations", {
      loggedIn: req.session.loggedIn || false,
      donations: [],
      userEmail: req.session.userEmail || "User",
    });
  }
});

router.get("/contact", function (req, res) {
  res.render("contact", {
    title: "Contact",
    loggedIn: req.session.loggedIn || false,
  });
});

router.get("/donate", function (req, res) {
  res.render("donate", { loggedIn: req.session.loggedIn || false });
});

router.get("/donate/NGO", async function (req, res) {
  try {
    const restaurant = req.query.restaurant || "Unknown Restaurant";

    // Fetch all NGOs from database
    const ngos = await prisma.nGO.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.render("ngo", {
      restaurant,
      ngos,
      loggedIn: req.session.loggedIn || false,
    });
  } catch (error) {
    console.error("Error fetching NGOs:", error);
    res.render("ngo", {
      restaurant,
      ngos: [],
      loggedIn: req.session.loggedIn || false,
    });
  }
});

// API endpoint to get all NGOs
router.get("/api/ngos", async function (req, res) {
  try {
    const ngos = await prisma.nGO.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ ngos });
  } catch (error) {
    console.error("Error fetching NGOs:", error);
    res.status(500).json({ error: "Failed to fetch NGOs" });
  }
});

// API endpoint to create NGO (for seeding/admin purposes)
router.post("/api/ngos", async function (req, res) {
  try {
    const { name, description, location } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const ngo = await prisma.nGO.create({
      data: {
        name,
        description: description || null,
        location: location || null,
      },
    });

    res.json({ success: true, ngo });
  } catch (error) {
    console.error("Error creating NGO:", error);
    res.status(500).json({ error: "Failed to create NGO" });
  }
});

// Person page
router.get("/person", function (req, res) {
  const name = req.query.name || "Unknown Name";
  const restaurant = req.query.restaurant || "Unknown Restaurant";
  res.render("singleNGO", {
    name,
    restaurant,
    loggedIn: req.session.loggedIn || false,
  });
});

// Restaurant donation submission
router.post("/restaurant-donation", async function (req, res) {
  try {
    const { restaurantName, ngoId, foodType, quantity, pickupLocation, contactNumber, status } = req.body;

    if (!restaurantName || !ngoId) {
      return res.status(400).json({ error: "Restaurant name and NGO are required" });
    }

    // Store restaurant donation
    const donation = await prisma.restaurantDonation.create({
      data: {
        restaurantName,
        ngoId,
        foodType: foodType || null,
        quantity: quantity || null,
        pickupLocation: pickupLocation || null,
        contactNumber: contactNumber || null,
        status: status || "completed", // Default to completed instead of pending
        userId: req.session.userId || null, // Link to logged-in user if available
      },
    });

    console.log(`🍽️ Food donation created: ${donation.id} - Restaurant: ${restaurantName} - Status: ${donation.status}`);

    res.json({ success: true, donation });
  } catch (error) {
    console.error("Error storing restaurant donation:", error);
    res.status(500).json({ error: "Failed to store donation" });
  }
});

// Thank you page
router.get("/thankyou", function (req, res) {
  const name = req.query.name || "Unknown Name";
  const restaurant = req.query.restaurant || "Unknown Restaurant";
  res.render("thankyou", {
    name,
    restaurant,
    loggedIn: req.session.loggedIn || false,
  });
});

module.exports = router;
