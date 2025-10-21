# FoodForward

FoodForward is a revolutionary web application dedicated to reducing food wastage by facilitating the connection between restaurants with surplus food and NGOs or individuals in need. In today's world, where food security remains a pressing issue, FoodForward serves as a bridge, ensuring that excess food from restaurants doesn't go to waste but instead reaches those who need it the most.

## Key Features

- **User-Friendly Interface**: Intuitive UI for restaurants to upload surplus food details and for NGOs/individuals to request available food items
- **MongoDB Authentication**: Secure user registration and login with bcrypt password hashing
- **Stripe Integration**: Seamless payment processing for monetary donations
- **Real-time Donation Tracking**: Track both monetary and food donations
- **NGO Management**: Comprehensive system to manage and connect with NGOs
- **Dynamic Session Management**: Persistent login state across the application

## Target Audience

- Restaurants with surplus food looking to donate excess food responsibly
- Non-governmental organizations dedicated to distributing food to the needy
- Individual donors who want to support food security initiatives

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript (ES6+)
- Locomotive.js (smooth scrolling)
- GSAP (animations)
- EJS (templating)

### Backend

- Node.js
- Express.js
- Prisma ORM
- MongoDB (via MongoDB Atlas)
- Bcrypt (password hashing)
- Express Session (session management)

### Payment Processing

- Stripe API

## Prerequisites

Before you begin, ensure you have:

- Node.js (v14 or higher) - [Download here](https://nodejs.org/)
- MongoDB Atlas account (or local MongoDB instance)
- Stripe account for payment processing

## Installation & Setup

### 1. Clone the project

```bash
git clone https://github.com/Sathya-reddy1658/WEBHACK1-Project.git
cd WEBHACK1-Project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory (you can copy from `.env.example`):

```bash
cp .env.example .env
```

Then update the `.env` file with your credentials:

```env
STRIPE_SECRET_KEY=your_stripe_secret_key
BASE_URL=http://localhost:3000
DATABASE_URL=your_mongodb_connection_string
```

**Note:** Replace `your_stripe_secret_key` and `your_mongodb_connection_string` with your actual credentials.

### 4. Generate Prisma Client

```bash
npx prisma generate
```

**Note:** The application has a `prestart` script that automatically runs `prisma generate` before starting the server, so you don't need to run it manually each time.

### 5. Seed the Database

Populate the database with sample NGOs:

```bash
npm run seed
```

If you encounter a DNS resolution error, verify:

- Your MongoDB Atlas cluster is running
- The cluster URL is correct
- Your IP address is whitelisted in MongoDB Atlas Network Access

## Running the Application

### Development Mode

```bash
npm start
```

or

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

- `npm start` - Runs `prisma generate` automatically then starts the server
- `npm run dev` - Same as start (runs prisma generate then starts)
- `npm run seed` - Seeds the database with sample NGOs
- `npm run format` - Formats code using Prettier

## Database Schema

The application uses Prisma ORM with the following MongoDB models:

### User

- Stores user authentication information
- Fields: `id`, `email` (unique), `password` (hashed), `name`, `createdAt`, `updatedAt`

### NGO

- Stores NGO/charity organization information
- Fields: `id`, `name` (unique), `description`, `location`, `createdAt`, `updatedAt`

### UserDonation

- Tracks monetary donations from users to NGOs
- Fields: `id`, `amount`, `stripeSessionId`, `status`, `userId`, `ngoId`, `createdAt`

### RestaurantDonation

- Tracks food donations from restaurants to NGOs
- Fields: `id`, `restaurantName`, `foodType`, `quantity`, `pickupLocation`, `contactNumber`, `status`, `ngoId`, `createdAt`

## Authentication Features

### Registration

- **Endpoint**: `POST /register`
- Users can register with email and password
- Passwords are hashed using bcrypt (10 rounds)
- Session is created upon successful registration

### Login

- **Endpoint**: `POST /login`
- Users login with email and password
- Password verification using bcrypt
- Session is created upon successful login

### Logout

- **Endpoint**: `GET /logout`
- Destroys user session and redirects to home

### UI Integration

- **Dynamic Navbar**: All pages display a dynamic navbar that shows:
  - "Login" button when user is not logged in (redirects to `/partner`)
  - "Logout" button when user is logged in (redirects to `/logout`)
- **Session Persistence**: User login state persists across page navigation
- **Protected Routes**: Donation features require user authentication
- **Login/Register Page**: `/partner` route shows a tabbed interface with:
  - Login tab (email + password)
  - Register tab (email + password + optional organization details)

## Donation Features

### User Donations (Stripe Integration)

- **Endpoint**: `POST /stripe`
- Creates Stripe checkout session for monetary donations
- Stores donation record in database with status "pending"
- Updates status to "completed" after successful payment
- **Requires user to be logged in**

### Restaurant Donations

- **Endpoint**: `POST /restaurant-donation`
- Stores food donation information from restaurants
- Links donation to specific NGO
- Fields: restaurant name, food type, quantity, pickup location, contact number

## API Endpoints

### Authentication

- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /logout` - Logout user

### Pages

- `GET /` - Home page
- `GET /about` - About us page
- `GET /partner` - Login/Registration page
- `GET /contact` - Contact page
- `GET /donate` - Donation page
- `GET /donate/NGO` - NGO selection page for donations
- `GET /person` - Individual NGO donation page
- `GET /complete` - Payment success page
- `GET /cancel` - Payment cancelled page
- `GET /feeding` - Awards and recognitions
- `GET /Charity` - Charity information

### NGO Management

- `GET /api/ngos` - Fetch all NGOs
- `POST /api/ngos` - Create new NGO (for admin/seeding)

### Donations

- `POST /stripe` - Create Stripe payment session
- `POST /restaurant-donation` - Submit restaurant food donation

## Testing the Application

### 1. Test Registration

- Navigate to `http://localhost:3000/partner`
- Click "Register" tab
- Fill in email, password, and optional fields
- Submit the form
- Should redirect to `/thankLogin` on success

### 2. Test Login

- Navigate to `/partner`
- Enter registered email and password
- Click "LOGIN"
- Navbar should now show "Logout"

### 3. Test User Donation

- Login first (required)
- Navigate to donation page
- Select amount and NGO
- Complete Stripe checkout
- Check database for donation record

### 4. Test Restaurant Donation

- Navigate to restaurant donation page
- Select NGO and enter donation details
- Submit donation
- Verify in database

```

```
