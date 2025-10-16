const userService = require('../services/user.service');
exports.superadminCreateUser = async (req, res) => {
  try {
    const { name, email, password, mobile, address, role } = req.body;

    // check for existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      address,
      role,
      isActive: true
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        mobile: newUser.mobile,
        address: newUser.address,
        isActive: newUser.isActive
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};
exports.listUsers = async (req, res) => {
  const query = req.query;
  const { page=1, limit=10 } = query;
  let filters = {};
  // if (q) filters.$or = [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }];
  if(query.name){
    filters.name = new RegExp(query.name, 'i');
  }
  if(query.emai){
    filters.email = new RegExp(query.email, 'i');
  }
  if(query.fromDate){
    filters.createdAt = {$gte:new Date(query.fromDate)}
  }
  if(query.toDate){
    filters.createdAt = {$lte:new Date(query.toDate)}
  }
  if(query.fromDate && query.toDate){
    filters.createdAt = {$gte:new Date(query.fromDate), $lte:new Date(query.toDate)}
  }
  const result = await userService.list({ page: Number(page), limit: Number(limit), filters });
  res.json({ success: true, ...result });
};

exports.getUser = async (req, res) => {
  const user = await userService.getById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: user });
};

exports.updateUser = async (req, res) => {
  const user = await userService.update(req.params.id, req.body);
  res.json({ success: true, data: user });
};

exports.blockUser = async (req, res) => {
  const block = req.body.block !== undefined ? req.body.block : true;
  const user = await userService.toggleBlock(req.params.id, block);
  res.json({ success: true, data: user });
};

exports.deleteUser = async (req, res) => {
  const user = await userService.softDelete(req.params.id);
  res.json({ success: true, data: user });
};

exports.updateMe = async (req, res) => {
  const user = await userService.update(req.user._id, req.body);
  res.json({ success: true, data: user });
};
