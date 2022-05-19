const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);
//const DB = process.env.DB_LOCAL;

mongoose.connect(DB, { useCreateIndex: true, useFindAndModify: true, useNewUrlParser: true }).then(() => {
  console.log('Connected to Database');
});

//Import Data
const importData = async () => {
  const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));
  try {
    const dbRecords = await Tour.find();
    if (dbRecords.length === 0) {
      await Tour.create(tours);
      console.log('Data Added Successfully');
      process.exit();
    }
  } catch (err) {
    console.log(err);
  }
};

//Delete Database
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Deleted Successfully');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

console.log(process.argv);
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
