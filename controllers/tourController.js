//const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.getTopCheapTours = async (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    //Execute Query
    const query = Tour.find();
    new APIFeatures(query, req.query).filter().sort().limitFields().paginate();
    const tours = await query;

    res.status(200).json({ status: 'success', totalRecords: tours.length, tours: tours });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err });
  }
};

exports.getSpecificTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json(tour);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err });
  }
};

exports.addTours = async (req, res) => {
  try {
    // const newTour1 = new Tour({});
    // newTour1.save();
    const newTour = await Tour.create(req.body);
    // const temp = tours[tours.length - 1].id + 1;
    // const newId = { id: temp };
    // const newTour = Object.assign(newId, req.body);
    // tours.push(newTour);
    // const newFileData = JSON.stringify(tours);
    // fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, newFileData, (err) => {
    // });
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ status: 'patch sucess', data: updateTour });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err });
  }
};

// exports.checkId = (req, res, next, val) => {
//   if (val * 1 > tours.length) {
//     return res.status(404).json({ status: 'error', message: 'ID not found' });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({ status: 'fail', message: 'Missing name or price' });
//   }
//   next();
// };

exports.getTourStats = async function (req, res) {
  try {
    const statistics = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: '$difficulty',
          avgRating: { $avg: '$ratingsAverage' },
          maxPrice: { $min: '$price' },
          minPrice: { $max: '$price' },
          totalRatings: { $sum: '$ratingsQuantity' },
          avgPrice: { $avg: '$price' },
        },
      },
      {
        $sort: { avgPrice: -1 },
      },
      //{ $match: { _id: { $ne: 'easy' } } },
    ]);
    res.status(200).json(statistics);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err });
  }
};

exports.getBusiestMonths = async function (req, res) {
  try {
    const yearToCheck = req.params.year * 1;
    const busyMonths = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${yearToCheck}-01-01`),
            $lte: new Date(`${yearToCheck}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          noOfTours: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: {
          month: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $limit: 12,
      },

      {
        $sort: { noOfTours: -1 },
      },
    ]);

    res.status(200).json(busyMonths);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err });
  }
};
