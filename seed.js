require('dotenv').config();
const mongoose = require('mongoose');
const Fotografer = require('./models/fotograferModel');
const SesiFoto = require('./models/sesiFotoModel');

async function main() {
  await mongoose.connect(process.env.DB_URI);
  await Fotografer.deleteMany({});
  await SesiFoto.deleteMany({});

  const fotografer = await Fotografer.create([
    { kode: 'F001', nama: 'Bayu Fotografer' },
    { kode: 'F002', nama: 'Dina Fotografer' },
  ]);

  await SesiFoto.create([
    {
      kodeSesi: 'FTO-001', namaKlien: 'Contoh namaKlien', durasiJam: 11,
      paket: 'personal',
      lokasi: { tempat: 'Contoh tempat', kota: 'Contoh kota' },
      fotograferId: fotografer[0]._id,
    },
    {
      kodeSesi: 'FTO-002', namaKlien: 'Klien Keluarga', durasiJam: 2,
      paket: 'keluarga',
      lokasi: { tempat: 'Studio Foto', kota: 'Palembang' },
      fotograferId: fotografer[1]._id,
    },
  ]);
  console.log('Seed selesai: 2 fotografer dan 2 sesi foto');
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
