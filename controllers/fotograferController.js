const mongoose = require('mongoose');
const Fotografer = require('../models/fotograferModel');
const { errorHttp } = require('../middlewares/errorHandler');

exports.create = async (req, res) => {
  const fotografer = await Fotografer.create(req.body);
  res.status(201).json(fotografer);
};

exports.getAll = async (req, res) => {
  const data = await Fotografer.find().select('_id kode nama').sort({ kode: 1 });
  res.status(200).json(data);
};

exports.getById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw errorHttp(400, 'Format ID tidak valid');
  }
  const data = await Fotografer.findById(req.params.id);
  if (!data) throw errorHttp(404, 'Data fotografer tidak ditemukan');
  res.json(data);
};
