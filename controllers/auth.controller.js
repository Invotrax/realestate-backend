const userService = require('../services/user.service');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: 'name,email,password required' });

  const user = await userService.createUser({ name, email, password, role: 'user' });
  res.status(201).json({ success: true, data: { id: user._id, email: user.email, name: user.name } });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const userInfo = await userService.login({ email, password, req });
  res.json({ success: true, data:userInfo });
};
