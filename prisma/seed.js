const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");
  // these are sample NGOs
  const ngos = [
    {
      name: "Feed the Hungry Foundation",
      description:
        "Dedicated to providing nutritious meals to homeless and underprivileged communities",
      location: "New York, NY",
    },
    {
      name: "Community Food Bank",
      description:
        "Working to eliminate hunger in our community through food distribution and education",
      location: "Los Angeles, CA",
    },
    {
      name: "Meals for All",
      description:
        "Ensuring no one goes to bed hungry by connecting restaurants with those in need",
      location: "Chicago, IL",
    },
    {
      name: "Hope Kitchen",
      description: "Providing warm meals and hope to families facing food insecurity",
      location: "Houston, TX",
    },
    {
      name: "Nourish Network",
      description: "Building a sustainable food system to support vulnerable populations",
      location: "San Francisco, CA",
    },
    {
      name: "Robin Hood Army",
      description: "Decentralizing hunger relief by getting surplus food from restaurants to the less fortunate",
      location: "Begumpet",
    },
    {
      name: "Akshaya Patra",
      description: "Serving mid-day meals to children in government schools across India",
      location: "Gachibowli",
    },
    {
      name: "Feeding India",
      description: "Fighting hunger and malnutrition by rescuing surplus food and serving it to the underprivileged",
      location: "Medchal",
    },
  ];

  for (const ngo of ngos) {
    const created = await prisma.nGO.upsert({
      where: { name: ngo.name },
      update: {},
      create: ngo,
    });
    console.log(`Created/Updated NGO: ${created.name}`);
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
