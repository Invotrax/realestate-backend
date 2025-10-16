require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Property = require('../models/Property');
const bcrypt = require('bcryptjs');

const seed = async () => {
  await connectDB();
  console.log('Seeding...');

  const saltRounds = parseInt(process.env.SALT_ROUNDS || '10');
  const hash = async (p) => await bcrypt.hash(p, saltRounds);

  // remove existing seeded users/properties (careful in prod)
  await User.deleteMany({});
  await Property.deleteMany({});

  const superadmin = new User({
    name: 'Super Admin',
    email: 'superadmin@example.com',
    password: await hash('SuperAdmin123!'),
    role: 'superadmin',
    isActive: true
  });
  await superadmin.save();

  const admin = new User({
    name: 'Admin User',
    email: 'admin@example.com',
    password: await hash('Admin123!'),
    role: 'admin',
    isActive: true
  });
  await admin.save();

  const enduser = new User({
    name: 'End User',
    email: 'user@example.com',
    password: await hash('User123!'),
    role: 'user',
    isActive: true
  });
  await enduser.save();

  const property = new Property({
    title: 'Beautiful 2BHK Apartment',
    description: 'A comfortable 2BHK near main park.',
    price: 4500000,
    currency: 'INR',
    address: { line1: '123 Main St', city: 'Mumbai', state: 'Maharashtra', country: 'India', postalCode: '400001' },
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 950,
    amenities: ['parking', 'lift'],
    owner: admin._id,
    images: [],
    isActive: true
  });
  await property.save();

  console.log('Seeded:');
  console.log({ superadmin: superadmin.email, admin: admin.email, user: enduser.email, property: property.title });
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
