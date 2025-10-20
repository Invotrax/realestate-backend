const propertyService = require('../services/property.service');

exports.createProperty = async (req, res) => {
  // const payload = { ...req.body, owner: req.user._id };
  const { title, description, currency, price, propertyType, country, state, city, line1, line2, postalCode, bedrooms,bathrooms, areaSqFt, amenities,propertyStatus,garage,garageArea,yearOfBuilt } = req.body;
  
  const cardImageFile = req.files['cardImage']?.[0];
  const imageFiles = req.files['images'] || [];

  const cardImagePath = cardImageFile ? process.env.BACKEND_URL+`/uploads/properties/${cardImageFile.filename}` : null;
  const images = imageFiles.map(file => process.env.BACKEND_URL+`/uploads/properties/${file.filename}`);
  let payload = {
    title,
    description,
    propertyType,
    propertyStatus,

    currency,
    price,

    bedrooms,
    bathrooms,
    areaSqFt,
    garage,
    garageArea,
    yearOfBuilt,
    amenities:JSON.parse(amenities),
    
    country, state, city, line1, line2, postalCode,
    images,
    cardImage:cardImagePath,
    createdBy: req.user.id
  }
  
  const prop = await propertyService.create(payload);
  res.status(201).json({ success: true, data: prop });
};

exports.listAdmin = async (req, res) => {
  let query = req.query;
  const { page=1, limit=10,fromDate,toDate } = query;
  const filters = {};
  if(query.title){
    filters.title = new RegExp(query.title, 'i');
  }
  if(query.city){
    filters['city'] = new RegExp(query.city, 'i');
  }
  if (fromDate || toDate) filters.createdAt = {};
  if (fromDate) filters.createdAt.$gte = new Date(fromDate);
  if (toDate) filters.createdAt.$lte = new Date(toDate);
   
  const result = await propertyService.listAdmin({ page: Number(page), limit: Number(limit), filters });
  res.json({ success: true, ...result });
};

exports.updateProperty = async (req, res) => {
    const { title, description, currency, price, propertyType, country, state, city, line1, line2, postalCode, bedrooms,bathrooms, areaSqFt, amenities,propertyStatus,garage,garageArea,yearOfBuilt } = req.body;
    const cardImageFile = req.files['cardImage']?.[0];
    const imageFiles = req.files['images'] || [];

    const cardImagePath = cardImageFile ? process.env.BACKEND_URL+`/uploads/properties/${cardImageFile.filename}` : null;
    const images = imageFiles.map(file => process.env.BACKEND_URL+`/uploads/properties/${file.filename}`);
    let payload = {
      title,
      description,
      propertyType,
      propertyStatus,

      currency,
      price,

      bedrooms,
      bathrooms,
      areaSqFt,
      yearOfBuilt,
      garage,
      garageArea,
      amenities:JSON.parse(amenities),

      
      cardImage:cardImagePath,
      country, state, city, line1, line2, postalCode,
      updatedBy: req.user.id
    }
    console.log('_+_+_+_', payload);
    
    
  const prop = await propertyService.update(req.params.id, payload);
  res.json({ success: true, data: prop });
};

exports.updateStatus = async (req, res) => {
  const { isActive, key } = req.body;
  const prop = await propertyService.toggleStatus(req.params.id, key, !!isActive);
  res.json({ success: true, data: prop });
};

exports.deleteProperty = async (req, res) => {
  const prop = await propertyService.softDelete(req.params.id);
  res.json({ success: true });
};

exports.listPublic = async (req, res) => {
  const { currentPage=1, limit=10, keyword, city, propertyType, propertyStatus, bedrooms, bathrooms } = req.query;
  const filters = {};
  if (keyword) filters.$or = [{ title: new RegExp(keyword,'i') }, { description: new RegExp(keyword,'i') }];
  if (city) filters['city'] = city;

  if (propertyType) filters.propertyType = propertyType;
  if (propertyStatus) filters.propertyStatus = propertyStatus;

  if (bedrooms) filters.bedrooms = bedrooms;
  if (bathrooms) filters.bathrooms = bathrooms;

  
  

  
  const result = await propertyService.listPublic({ page: Number(currentPage), limit: Number(limit), filters });
  res.json({ success: true, ...result });
};
exports.getByCountry = async (req, res) => {
  const { page=1, limit=10, country } = req.query;
  const filters = {};
  if (country) filters['country'] = country;  
  const result = await propertyService.getByCountry({ filters });
  res.json({ success: true, ...result });
};
exports.getTopList= async (req, res) => {
  const result = await propertyService.getTopProperty({ });
  res.json({ success: true, ...result });
};

exports.toggleLike = async (req, res) => {
  const prop = await propertyService.toggleLike(req.params.id, req.user._id);
  res.json({ success: true, likesCount: prop.likes.length, liked: prop.likes.some(l => l.toString() === req.user._id.toString()) });
};
exports.getPropertyById = async (req, res) => {
  try {
    const propertyId = req.params.id;

    const property = await propertyService.getPropertyById(propertyId);

    return res.status(200).json({
      success: true,
      message: 'Property fetched successfully',
      data: property
    });
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Server error'
    });
  }
};