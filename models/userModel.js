const mongosse = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongosse.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minLength: 8,
  },

  confirmPassword: {
    type: String,
    required: [true, 'A user must have a confirm password'],
    minLength: 8,
    validate: {
      //This only works on SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password and Confirm Password does not match',
    },
  },
  photo: String,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

const User = mongosse.model('User', userSchema);

module.exports = User;
