const User = require('../models/userModel');
const CatchAsync = require('../utils/catchAsync');

exports.signup = CatchAsync(async (req, res) => {
  const user = await User.create(req.body);
  res.status(200).json({ status: 'success', message: 'User signed up successfully', data: user });
});

exports.getAllUsers = (req, res) => {
  res.status(500).json({ status: 'error', message: 'this route is not yet defined' });
};

exports.getUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'this route is not yet defined' });
};

exports.addUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'this route is not yet defined' });
};

exports.updateUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'this route is not yet defined' });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({ status: 'error', message: 'this route is not yet defined' });
};
