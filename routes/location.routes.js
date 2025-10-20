const express = require('express');
const router = express.Router();
const locationCtrl = require('../controllers/location.controller');

// COUNTRY
router.get('/countries', locationCtrl.getCountries);


// STATE
router.get('/states/:countryId', locationCtrl.getStatesByCountry);


// CITY
router.get('/cities/:stateId', locationCtrl.getCitiesByState);
router.get('/cities-user/', locationCtrl.getAllActiveCitiesWithProperty);


module.exports = router;
