# UTS PAW2 – Topik 08 Studio Foto

**Mahasiswa:** Revaldo Fiqqih Septiansyah  
**NIM:** 2428240110  
**Kelas:** SI5C

REST API menggunakan Express.js, MongoDB, dan Mongoose untuk mengelola sesi foto dan data fotografer.

## 1. Teknologi
- Node.js dan Express.js
- MongoDB (Atlas atau server lokal)
- Mongoose
- dotenv dan cors

## 2. Menjalankan aplikasi
1. Pastikan Node.js dan MongoDB tersedia.
2. Install dependensi: `npm install`
3. Salin `.env.example` menjadi `.env`.
4. Isi `DB_URI` dengan connection string MongoDB dan atur `API_KEY`.
5. Jalankan aplikasi: `npm start`

Untuk mode pengembangan: `npm run dev`.

Contoh `.env`:
```env
PORT=3000
API_KEY=rahasia-anda
CORS_ORIGIN=http://localhost:5173
DB_URI=mongodb://127.0.0.1:27017/uts_paw2
```

Database yang digunakan: `uts_paw2`.

## 3. Model data

### Fotografer (entity pendukung)
Collection `fotografer`:
- `kode`: String, wajib, unik, trim, huruf kapital.
- `nama`: String, wajib, trim.

Contoh:
```json
{ "kode": "F001", "nama": "Bayu Fotografer" }
```

### SesiFoto (entity utama)
Collection `sesi_fotos`:
- `kodeSesi`: String, wajib, unik, trim.
- `namaKlien`: String, wajib, trim.
- `durasiJam`: Number, wajib, minimal 1.
- `paket`: String, wajib, trim.
- `lokasi`: embedded subdocument berisi `tempat` dan `kota` (keduanya String).
- `fotograferId`: ObjectId yang mereferensikan `Fotografer`, wajib.
- `createdAt`: Date, otomatis dibuat saat dokumen disimpan.

**Alasan embedding:** `lokasi` selalu dibaca sebagai bagian dari sesi foto dan terdiri dari dua informasi sederhana. Karena tidak perlu dikelola sebagai entitas terpisah, `tempat` dan `kota` disimpan langsung di dalam dokumen SesiFoto.

**Alasan referencing:** data fotografer dapat digunakan oleh banyak sesi foto dan perlu dikelola secara terpisah. Karena itu SesiFoto menyimpan `fotograferId` sebagai referensi ke collection Fotografer; detail fotografer diambil dengan `populate()` ketika satu sesi dibaca.

## 4. Endpoint

Semua URL menggunakan basis `http://localhost:3000`.

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/` | Memeriksa server |
| POST | `/fotografer` | Menambah fotografer |
| GET | `/fotografer` | Melihat semua fotografer |
| GET | `/fotografer/:id` | Melihat satu fotografer |
| POST | `/sesi-foto` | Menambah sesi foto |
| GET | `/sesi-foto` | Melihat sesi foto (projection C3) |
| GET | `/sesi-foto?paket=keluarga` | Filter berdasarkan paket |
| GET | `/sesi-foto/:id` | Melihat detail dan populate fotografer |
| PUT | `/sesi-foto/:id` | Mengubah sesi foto |
| DELETE | `/sesi-foto/:id` | Menghapus sesi foto |

POST, PUT, dan DELETE memerlukan header `x-api-key` yang nilainya sama dengan `API_KEY` pada `.env`.

## 5. Contoh request

Buat fotografer terlebih dahulu:
```http
POST /fotografer
Content-Type: application/json
x-api-key: rahasia-anda
```
```json
{ "kode": "F001", "nama": "Bayu Fotografer" }
```

Salin `_id` dari respons fotografer, lalu gunakan pada POST sesi foto:
```http
POST /sesi-foto
Content-Type: application/json
x-api-key: rahasia-anda
```
```json
{
  "kodeSesi": "FTO-001",
  "namaKlien": "Contoh namaKlien",
  "durasiJam": 11,
  "paket": "personal",
  "lokasi": {
    "tempat": "Contoh tempat",
    "kota": "Contoh kota"
  },
  "fotograferId": "ISI_DENGAN_OBJECT_ID_FOTOGRAFER"
}
```

Filter: `GET /sesi-foto?paket=keluarga`

Projection C3 untuk GET `/sesi-foto` hanya mengirim `_id`, `kodeSesi`, `namaKlien`, `durasiJam`, dan `paket`.

## 6. Status respons dan penanganan galat
- `201`: data berhasil dibuat.
- `200`: permintaan berhasil.
- `204`: data berhasil dihapus.
- `400`: validasi gagal, durasi di bawah 1, format ID salah, atau JSON tidak valid.
- `401`: API key tidak valid.
- `404`: data atau rute tidak ditemukan.
- `409`: nilai unik seperti `kode` atau `kodeSesi` sudah digunakan.
- `500`: kesalahan server.

## 7. Seed data (opsional)
Jalankan `npm run seed` untuk menghapus data pada collection Fotografer dan SesiFoto, lalu mengisi dua contoh fotografer dan dua sesi foto. **Perhatian:** perintah ini menghapus data lama pada kedua collection tersebut.
