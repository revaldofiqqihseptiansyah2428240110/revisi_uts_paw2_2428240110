const mongoose = require('mongoose');

const lokasiSchema = new mongoose.Schema({
  tempat: { type: String, required: [true, 'tempat lokasi wajib diisi'], trim: true },
  kota: { type: String, required: [true, 'kota lokasi wajib diisi'], trim: true },
}, { _id: false });

const sesiFotoSchema = new mongoose.Schema({
  kodeSesi: {
    type: String, required: [true, 'kodeSesi wajib diisi'],
    unique: true, trim: true,
  },
  namaKlien: {
    type: String, required: [true, 'namaKlien wajib diisi'], trim: true,
  },
  durasiJam: {
    type: Number, required: [true, 'durasiJam wajib diisi'], min: [1, 'durasiJam minimal 1'],
  },
  paket: {
    type: String, required: [true, 'paket wajib diisi'], trim: true,
  },
  lokasi: { type: lokasiSchema, required: [true, 'lokasi wajib diisi'] },
  fotograferId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Fotografer',
    required: [true, 'fotograferId wajib diisi'],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SesiFoto', sesiFotoSchema);
