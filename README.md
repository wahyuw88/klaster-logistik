# Web App Klaster Logistik Indonesia

Aplikasi dashboard sederhana yang siap di-deploy ke Vercel. Data klaster dibaca dari Google Spreadsheet yang dipublikasikan sebagai CSV.

## Fitur
- Dashboard jumlah data klaster dan ringkasan status pembentukan.
- Peta interaktif Indonesia berbasis Leaflet.
- Filter pencarian wilayah/klaster dan filter status.
- Tabel daftar klaster.
- Kolom aplikasi mengikuti template ringkas: `cluster_id`, `nama_klaster`, `kode_provinsi`, `nama_provinsi`, `kode_kab_kota`, `nama_kab_kota`, `jenis_wilayah`, `status_pembentukan`, `tanggal_pembentukan`, `tahun_pembentukan`, `catatan`.
- Tidak memakai kolom status verifikasi, instansi pengampu, sektor komoditas unggulan, cakupan layanan, alamat, latitude/longitude, deskripsi, dasar pembentukan, URL dokumen, kontak, email, atau tanggal pembaruan.

## Hubungkan Google Spreadsheet
1. Unggah `Template_Klaster_Logistik_Revisi.xlsx` ke Google Drive, lalu buka dengan Google Sheets.
2. Pastikan sheet `DATA_KLASTER` memiliki header sesuai template dan hapus baris contoh `CONTOH-HAPUS`.
3. Di Google Sheets, pilih **File > Share > Publish to web**.
4. Pilih sheet `DATA_KLASTER`, format **Comma-separated values (.csv)**, lalu Publish.
5. Salin URL CSV hasil publikasi.
6. Buka `public/app.js`, ganti nilai `SHEET_CSV_URL` dengan URL CSV tersebut.
7. Deploy folder ini ke Vercel.

Catatan: link publik hanya memberi akses baca. Jangan menaruh kredensial Google atau kunci rahasia di frontend.

## Jalankan lokal
- Install Node.js LTS.
- Jalankan `npm install`.
- Jalankan `npx vercel dev` dan buka URL lokal yang diberikan.

## Peta
Peta mengambil batas provinsi dari sumber GeoJSON publik. Pencocokan kode/nama wilayah bisa berbeda antarversi data administrasi. Untuk penggunaan resmi, selaraskan kode wilayah dengan sumber GeoJSON dan data administrasi terbaru. Template kode wilayah asal PDF yang tersedia sebelumnya berisi 34 provinsi dan perlu diverifikasi sebelum dianggap lengkap.
