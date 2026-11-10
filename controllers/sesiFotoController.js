const mongoose = require('mongoose');
const SesiFoto = require('../models/sesiFotoModel');
const { errorHttp } = require('../middlewares/errorHandler');

const FIELD_PROJECTION = ['_id', 'kodeSesi', 'namaKlien', 'durasiJam', 'paket'];

exports.create = async (req, res) => {
  const sesiFoto = await SesiFoto.create(req.body);
  res.status(201).json(sesiFoto);
};

exports.getAll = async (req, res) => {
  const filter = {};
  if (req.query.paket !== undefined) {
    filter.paket = String(req.query.paket).trim();
  }

  // Projection tetap membatasi field sesuai ketentuan C3.
  const data = await SesiFoto.find(filter)
    .select(FIELD_PROJECTION.join(' '))
    .sort({ createdAt: -1, _id: 1 });
  res.status(200).json(data);
};

exports.getById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw errorHttp(400, 'Format ID tidak valid');
  }
  const data = await SesiFoto.findById(req.params.id)
    .populate('fotograferId', 'kode nama');
  if (!data) throw errorHttp(404, 'Data sesi foto tidak ditemukan');
  res.status(200).json(data);
};

exports.update = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw errorHttp(400, 'Format ID tidak valid');
  }
  const data = await SesiFoto.findByIdAndUpdate(
    req.params.id, req.body,
    { new: true, runValidators: true }
  );
  if (!data) throw errorHttp(404, 'Data sesi foto tidak ditemukan');
  res.json(data);
};

exports.remove = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw errorHttp(400, 'Format ID tidak valid');
  }
  const data = await SesiFoto.findByIdAndDelete(req.params.id);
  if (!data) throw errorHttp(404, 'Data sesi foto tidak ditemukan');
  res.status(204).send();
};
