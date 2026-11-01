PATCH SEO DAN NAVIGASI KLASTER LOGISTIK

File yang diperbarui/ditambahkan:
- public/index.html
- public/styles.css
- public/app.js
- public/robots.txt (baru)
- public/sitemap.xml (baru)

Perubahan:
1. Menghapus menu Sumber Daya dari navigasi utama.
2. Menghilangkan outline/efek fokus biru neon pada menu saat diklik; status aktif tetap ditandai garis mint yang halus.
3. Memperbarui judul, deskripsi, heading, dan teks alternatif/label aksesibilitas agar lebih deskriptif dan relevan dengan pencarian Klaster Logistik.
4. Menambahkan canonical URL, meta robots, Open Graph, Twitter Card, dan structured data Schema.org WebSite.
5. Menambahkan robots.txt dan sitemap.xml.
6. Mengubah title dan meta description ketika pengguna berpindah ke Beranda, Artikel, Tentang Kami, dan Kontak.

Catatan SEO:
- Website saat ini menggunakan satu halaman aplikasi (SPA) dengan tampilan yang berganti melalui JavaScript. Meta data dinamis membantu pengalaman browser dan berbagi tautan, tetapi mesin pencari tidak selalu memperlakukan tampilan tersebut sebagai URL halaman terpisah. Untuk SEO maksimal per halaman (Artikel, Tentang Kami, Kontak), tahap lanjutan adalah membuat URL HTML terpisah atau prerender/SSR.
- Sitemap saat ini mencantumkan URL utama saja karena halaman lain belum memiliki URL mandiri.
- Google tidak menggunakan meta keywords sebagai faktor peringkat utama; kata kunci tetap ditulis alami pada title, description, heading, dan isi halaman.
- Pastikan domain canonical dan sitemap sesuai domain produksi. Saat ini memakai https://klaster-logistik.vercel.app/.

Cara menerapkan:
1. Ekstrak ZIP.
2. Salin seluruh file sesuai path ke repository (folder public).
3. Commit dan push sekali agar Vercel membuat satu deployment.
4. Setelah deployment, daftarkan sitemap https://klaster-logistik.vercel.app/sitemap.xml di Google Search Console dan lakukan inspeksi URL.
