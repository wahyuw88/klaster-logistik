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
Peta mengambil batas provinsi dari beberapa sumber GeoJSON publik sebagai fallback. Pencocokan kode/nama wilayah bisa berbeda antarversi data administrasi. Untuk penggunaan resmi, selaraskan kode wilayah dengan sumber GeoJSON dan data administrasi terbaru. Template kode wilayah asal PDF yang tersedia sebelumnya berisi 34 provinsi dan perlu diverifikasi sebelum dianggap lengkap.


## Perbaikan peta interaktif
Versi ini memperbaiki alamat sumber GeoJSON yang sebelumnya salah/tidak sesuai nama repositori. Peta mencoba GeoJSON provinsi ringan terlebih dahulu, lalu dua sumber cadangan. Jika peta masih kosong setelah deploy, periksa apakah browser/jaringan memblokir `unpkg.com`, `raw.githubusercontent.com`, atau tile CARTO.


Pembaruan header: logo dihapus dan judul header diganti menjadi “Dashboard Klaster Logistik”, dengan ukuran font responsif untuk desktop dan perangkat seluler.


Pembaruan header: indikator status data dihapus, tombol “Muat ulang data” ditempatkan di kanan judul pada header atas. Bagian pengantar/intro dihapus sesuai permintaan.


## Kartu statistik terbaru
Dashboard menampilkan empat kartu: Total Klaster Logistik, Klaster Logistik Provinsi, Klaster Logistik Kab/Kota, dan Dalam Proses. Kartu Dalam Proses menghitung seluruh baris dengan status_pembentukan bernilai `Dalam Proses`. Pada layar yang lebih kecil, kartu menyesuaikan menjadi dua kolom.
