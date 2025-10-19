const stateService = require('../services/state.service');

exports.createState = async (req, res) => {
  // const payload = { ...req.body, owner: req.user._id };
  const { name, country_id } = req.body;
  const image = process.env.BACKEND_URL+`/uploads/properties/${req.file.filename}`;
  let payload = {
    name,
    country_id,
    image
  }
  
  const prop = await stateService.create(payload);
  res.status(201).json({ success: true, data: prop });
};

exports.listAdmin = async (req, res) => {
  let query = req.query;
  const { page=1, limit=10 } = query;
  const filters = {};
  
  if(query.country_id){
    filters['country_id'] = query.country_id;
  }
  const result = await stateService.listAdmin({ page: Number(page), limit: Number(limit), filters });
  res.json({ success: true, ...result });
};

exports.updateState = async (req, res) => {
    const { name, country_id } = req.body;
    
    
    const image = process.env.BACKEND_URL+`/uploads/properties/${req.file.filename}`;
    let payload = {
        name,
        country_id,
        image
    }
    
  const prop = await stateService.update(req.params.id, payload);
  res.json({ success: true, data: prop });
};

exports.updateStatus = async (req, res) => {
  const { isActive } = req.body;
  const prop = await stateService.toggleStatus(req.params.id,  !!isActive);
  res.json({ success: true, data: prop });
};

exports.getStateById = async (req, res) => {
  try {
    const stateId = req.params.id;

    const data = await stateService.getStateById(stateId);

    return res.status(200).json({
      success: true,
      message: 'Property fetched successfully',
      data: data
    });
  } catch (err) {
    console.error(err);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Server error'
    });
  }
};