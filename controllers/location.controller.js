const Country = require('../models/Country');
const State = require('../models/State');
const City = require('../models/City');
const Property = require('../models/Property');

// ---- COUNTRY ----
exports.getCountries = async (req, res) => {
  try {
    const countries = await Country.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, data: countries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- STATE ----
exports.getStatesByCountry = async (req, res) => {
  try {
    const states = await State.find({ country_id: req.params.countryId, isActive: true }).populate('country_id', 'id _id name').sort({ name: 1 });
    res.json({ success: true, data: states });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// ---- CITY ----
exports.getCitiesByState = async (req, res) => {
  try {
    const cities = await City.find({ state_id: req.params.stateId, isActive: true }).populate('state_id', 'id _id name').sort({ name: 1 });
    res.json({ success: true, data: cities });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllActiveCitiesWithProperty = async (req, res) => {
  try {
    const result = await Property.aggregate([
        {
          $match: {
            isDeleted: false,
            isActive: true
          }
        },
        {
          $group: {
            _id: "$city" // group by city ObjectId
          }
        },
        {
          $lookup: {
            from: "cities", // collection name (plural)
            localField: "_id",
            foreignField: "_id",
            as: "city"
          }
        },
        { $unwind: "$city" },
        {
          $project: {
            _id: 0,
            cityId: "$city._id",
            cityName: "$city.name"
          }
        },
        { $sort: { cityName: 1 } }
      ]);

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


