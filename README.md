PATCH DASHBOARD KLASTER LOGISTIK — ARTIKEL, DASAR HUKUM, DAN IDENTITAS WEBSITE

File yang diperbarui:
- public/index.html
- public/styles.css
- public/app.js

Perubahan:
1. Menghapus garis mint/penanda garis pada menu aktif. Warna navigasi tetap tenang tanpa efek neon.
2. Mengganti judul header menjadi “Dashboard Klaster Logistik”.
3. Mengganti subjudul header menjadi “Dashboard dan Informasi Klaster Logistik Penanggulangan Bencana di Indonesia”.
4. Menambahkan menu dan halaman Dasar Hukum.
   - Regulasi khusus Klaster Logistik: Peraturan BNPB Nomor 6 Tahun 2022, Juklak Nomor 16 Tahun 2025, dan entri Juklak Nomor 2 Tahun 2023.
   - Peraturan pendukung manajemen logistik dan peralatan: sejumlah Perka/Perban BNPB yang tercantum dalam penelusuran JDIH BNPB.
   - Setiap dokumen ditautkan ke JDIH BNPB. Status dan naskah autentik tetap perlu diperiksa pada JDIH sebelum dipakai sebagai dasar keputusan.
5. Mengganti konten Artikel menjadi kurasi berita/publikasi resmi BNPB terkait pembentukan, penguatan, koordinasi, dan monitoring-evaluasi Klaster Logistik.
6. Mengubah Tentang Kami agar hanya menjelaskan website: tujuan, fitur, sumber data, dan batasan penggunaan.
7. Memperbarui metadata SEO dinamis untuk Beranda, Artikel, Dasar Hukum, Tentang Kami, dan Kontak.

Catatan sumber dan cakupan:
- Daftar hukum disusun dari penelusuran JDIH BNPB dengan subjek Klaster Logistik, Manajemen Logistik, dan SISMANLOGPAL. Peraturan pendukung tidak seluruhnya secara khusus mengatur Klaster Logistik.
- Halaman Artikel merupakan kurasi publikasi yang ditemukan di kanal BNPB/JDIH, bukan arsip lengkap seluruh artikel atau berita.
- Aplikasi masih menggunakan navigasi satu halaman (SPA). Metadata title/description berubah saat menu dibuka, tetapi URL setiap menu belum menjadi halaman mandiri untuk pengindeksan SEO.

Cara menerapkan:
1. Ekstrak ZIP.
2. Ganti tiga file sesuai struktur folder pada repository GitHub.
3. Commit dan push satu kali agar perubahan masuk dalam satu deployment Vercel.
4. Setelah deployment, uji semua menu, tautan JDIH, tampilan mobile, dan dashboard.
