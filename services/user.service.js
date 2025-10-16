const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const saltRounds = parseInt(process.env.SALT_ROUNDS || '10');

exports.createUser = async (data) => {
  const existing = await User.findOne({ email: data.email.toLowerCase() });
  if (existing) throw { status: 400, message: 'Email already exists' };

  const hash = await bcrypt.hash(data.password, saltRounds);
  const user = new User({
    name: data.name,
    email: data.email.toLowerCase(),
    password: hash,
    mobile: data.mobile || null,
    address: data.address || null,
    role: data.role || 'user',
    isActive: data.isActive !== undefined ? data.isActive : true
  });
  await user.save();
  return user;
};

exports.login = async ({ email, password, req }) => {
  const user = await User.findOne({ email: email.toLowerCase(), isDeleted: false });
  if (!user) throw { status: 401, message: 'Invalid credentials' };

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw { status: 401, message: 'Invalid credentials' };
  if (!user.isActive)  throw { status: 403,message: 'Account is deactivated or blocked' };
  user.lastLogin = new Date();
  await user.save();

  const payload = { id: user._id, role: user.role, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  let userObj = {
     id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        address: user.address,
        isActive: user.isActive,
  }
  return {token:token,user:userObj};
};

exports.getById = async (id) => {
  return User.findById(id).select('-password');
};

exports.list = async ({ page=1, limit=10, filters = {} }) => {
  const skip = (page-1)*limit;
  const query = { isDeleted: false, ...filters, role:{$ne:'superadmin'} };
  console.log('_+_+_+_', query);
  
  const total = await User.countDocuments(query);
  const items = await User.find(query).select('-password').skip(skip).limit(limit).sort({ createdAt: -1 });
  return { items, total, page, limit };
};

exports.update = async (id, data) => {
  const user = await User.findById(id);
  if (!user) throw { status: 404, message: 'User not found' };
  if (data.password) {
    user.password = await bcrypt.hash(data.password, saltRounds);
  }
  ['name','mobile','address','isActive','role'].forEach(k => {
    if (data[k] !== undefined) user[k] = data[k];
  });
  await user.save();
  return user;
};

exports.softDelete = async (id) => {
  const user = await User.findById(id);
  if (!user) throw { status: 404, message: 'User not found' };
  user.isDeleted = true;
  user.isActive = false;
  await user.save();
  return user;
};

exports.toggleBlock = async (id, block=true) => {
  const user = await User.findById(id);
  if (!user) throw { status: 404, message: 'User not found' };
  user.isActive = !block ? true : false;
  await user.save();
  return user;
};
