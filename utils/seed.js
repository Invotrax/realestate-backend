require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Property = require('../models/Property');
const Country = require('../models/Country');
const State = require('../models/State');
const City = require('../models/City');
const bcrypt = require('bcryptjs');
const { countriesArray } = require('./countries');
const { statesArray } = require('./states');
const { citiesArray } = require('./cities');

const seed = async () => {
  await connectDB();
  console.log('Seeding...');

  const saltRounds = parseInt(process.env.SALT_ROUNDS || '10');
  const hash = async (p) => await bcrypt.hash(p, saltRounds);

  // remove existing seeded users/properties (careful in prod)
  await User.deleteMany({});
  await Property.deleteMany({});

  await Country.deleteMany({});
  await State.deleteMany({});
  await City.deleteMany({});

  
   const countryMap = {};
    for (const c of countriesArray) {
      const country = new Country(c);
      const savedCountry = await country.save();
      countryMap[c.id] = savedCountry._id;
      console.log(`✅ Country saved: ${c.id}`);
    }

    const stateMap = {};
    for (const s of statesArray) {
      const state = new State({ id: s.id,name: s.name, country: s.country, isActive:true, country_id: countryMap[s.country] });
      const savedState = await state.save();
      stateMap[`${s.id}`] = savedState._id;
      console.log(`✅ State saved: ${s.id}`);
    }
     for (const c of citiesArray) {
       const city = new City({ id: c.id,name: c.name, state: c.state, isActive:true, state_id: stateMap[c.state] });
      
      await city.save();
      console.log(`✅ City saved: ${c.name}`);
    }

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

 

  console.log('Seeded:');
  console.log({ superadmin: superadmin.email, admin: admin.email, user: enduser.email });
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
