/*
 * Hubungkan spreadsheet: ganti SHEET_CSV_URL dengan URL CSV dari
 * Google Sheets > File > Share > Publish to web > DATA_KLASTER > CSV.
 */
const SHEET_CSV_URL = "PASTE_PUBLISHED_GOOGLE_SHEET_CSV_URL_HERE";
const GEOJSON_URLS = [
  // File ringan dan sesuai untuk peta tingkat provinsi.
  "https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia-province-simple.json",
  // GeoJSON dengan kode provinsi.
  "https://raw.githubusercontent.com/ans-4175/peta-indonesia-geojson/master/indonesia-prov.geojson",
  // Sumber lengkap sebagai fallback terakhir.
  "https://raw.githubusercontent.com/superpikar/indonesia-geojson/master/indonesia-province.json"
];

const $ = (id) => document.getElementById(id);
let clusters = [];
let provinceLayer = null;
let map = null;
let provinceFeatures = [];
let provinceCodeKeys = ["kode_provinsi", "kode provinsi", "prov_code", "kode"];

function norm(value) {
  return String(value ?? "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function clean(value) { return String(value ?? "").trim(); }
function parseCSV(text) {
  const rows = []; let row = []; let cell = ""; let quoted = false;
  for (let i=0; i<text.length; i++) {
    const c = text[i], next = text[i+1];
    if (c === '"' && quoted && next === '"') { cell += '"'; i++; }
    else if (c === '"') quoted = !quoted;
    else if (c === ',' && !quoted) { row.push(cell); cell = ""; }
    else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && next === '\n') i++;
      row.push(cell); if (row.some(v => clean(v) !== "")) rows.push(row);
      row = []; cell = "";
    } else cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  if (!rows.length) return [];
  const headers = rows.shift().map(h => clean(h).replace(/^\uFEFF/, "").toLowerCase());
  return rows.map(values => Object.fromEntries(headers.map((h,i) => [h, clean(values[i])])))
    .filter(r => Object.values(r).some(v => v !== ""));
}
function get(row, key) { return clean(row[key]); }
function statusClass(status) {
  const s = norm(status);
  if (s === "terbentuk") return "status-terbentuk";
  if (s === "dalam proses") return "status-dalam-proses";
  return "status-unknown";
}
function statusColor(status) {
  const s = norm(status);
  if (s === "terbentuk") return "#198754";
  if (s === "dalam proses") return "#d6a21d";
  return "#b8c5d1";
}
function provinceName(feature) {
  const p = feature.properties || {};
  const candidates = [
    p.Propinsi, p.PROVINSI, p.provinsi, p.Provinsi,
    p.name, p.NAME, p.NAME_1, p.NAME_2, p.NAME_3,
    p.prov_name, p.province, p.PROVINCE, p.PROVINCE_NAME,
    p.Propinsi, p.NAMOBJ, p.WADMPR, p.nm_provinsi
  ];
  const value = candidates.find(v => typeof v === "string" && v.trim());
  return value || "Provinsi";
}
function clustersForProvince(name) {
  const key = norm(name);
  return clusters.filter(c => norm(get(c,"nama_provinsi")) === key);
}
function provinceSummary(name) {
  const data = clustersForProvince(name);
  if (!data.length) return {status:"Belum Ada Data", count:0, color:"#b8c5d1"};
  const statuses = data.map(c => norm(get(c,"status_pembentukan")));
  let status = "Dalam Proses";
  if (statuses.includes("terbentuk")) status = "Terbentuk";
  else if (statuses.includes("dalam proses")) status = "Dalam Proses";
  return {status, count:data.length, color:statusColor(status)};
}
function styleFeature(feature) {
  const s = provinceSummary(provinceName(feature));
  return {color:"#ffffff", weight:1.2, opacity:1, fillColor:s.color, fillOpacity:.78};
}
async function loadProvinceGeoJSON() {
  let lastError = null;
  for (const url of GEOJSON_URLS) {
    try {
      const response = await fetch(url, {cache:"force-cache"});
      if (!response.ok) throw new Error(`Sumber peta merespons ${response.status}`);
      const geo = await response.json();
      if (!geo || !Array.isArray(geo.features) || !geo.features.length) throw new Error("Format GeoJSON tidak valid");
      return geo;
    } catch (err) { lastError = err; }
  }
  throw lastError || new Error("Semua sumber peta gagal");
}
function initMap() {
  if (!window.L) {
    showNotice("Library peta tidak berhasil dimuat. Periksa koneksi internet atau blokir CDN.");
    return;
  }
  map = L.map("map", {scrollWheelZoom:false, zoomControl:true}).setView([-2.5,118], 4.2);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
    attribution:'&copy; OpenStreetMap &copy; CARTO', subdomains:"abcd", maxZoom:18
  }).addTo(map);
  loadProvinceGeoJSON().then(geo => {
    provinceFeatures = geo.features || [];
    provinceLayer = L.geoJSON(geo, {
      style:styleFeature,
      onEachFeature:(feature, layer) => {
        const name = provinceName(feature);
        layer.on("mouseover", function(){ this.setStyle({weight:2.5, color:"#102a43", fillOpacity:.92}); });
        layer.on("mouseout", function(){ if (provinceLayer) provinceLayer.resetStyle(this); });
        layer.on("click", function() {
          const s = provinceSummary(name);
          const html = `<div class="popup-title">${escapeHTML(name)}</div><div class="popup-line">${s.count} data klaster<br>Status ringkas: ${escapeHTML(s.status)}</div>`;
          this.bindPopup(html).openPopup();
          $("searchInput").value = name;
          renderTable();
        });
      }
    }).addTo(map);
    try { map.fitBounds(provinceLayer.getBounds(), {padding:[8,8]}); } catch(e) {}
    setTimeout(() => { if (map) map.invalidateSize(); }, 100);
    refreshMap();
  }).catch((error) => {
    console.error("Gagal memuat GeoJSON provinsi:", error);
    showNotice("Peta batas provinsi gagal dimuat. Periksa koneksi internet/CDN atau buka Console browser untuk melihat sumber GeoJSON yang gagal. Daftar data tetap bisa digunakan.");
  });
}
function refreshMap() { if (provinceLayer) provinceLayer.setStyle(styleFeature); }
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function showNotice(message) { $("notice").hidden = false; $("notice").textContent = message; }
function hideNotice() { $("notice").hidden = true; }
function renderStats() {
  // Statistik menghitung jumlah baris klaster berstatus "Terbentuk",
  // bukan jumlah wilayah unik.
  const formed = clusters.filter(c => norm(get(c,"status_pembentukan")) === "terbentuk");
  const wilayahType = (c) => norm(get(c, "jenis_wilayah"))
    .replace(/[\\s._-]+/g, "")
    .replace(/kabupatenadministratif/g, "kabupaten");

  const provinceClusters = formed.filter(c => wilayahType(c).includes("provinsi"));
  const kabKotaClusters = formed.filter(c => {
    const type = wilayahType(c);
    return type.includes("kabupaten") || type === "kota" || type.startsWith("kota");
  });

  $("formedTotalCount").textContent = formed.length.toLocaleString("id-ID");
  $("provinceClusterCount").textContent = provinceClusters.length.toLocaleString("id-ID");
  $("regencyClusterCount").textContent = kabKotaClusters.length.toLocaleString("id-ID");
}
function renderTable() {
  const q = norm($("searchInput").value);
  const status = norm($("statusFilter").value);
  const rows = clusters.filter(c => {
    const haystack = norm([get(c,"cluster_id"),get(c,"nama_klaster"),get(c,"nama_provinsi"),get(c,"nama_kab_kota"),get(c,"jenis_wilayah")].join(" "));
    return (!q || haystack.includes(q)) && (!status || norm(get(c,"status_pembentukan")) === status);
  });
  $("resultCount").textContent = `${rows.length.toLocaleString("id-ID")} data`;
  if (!rows.length) {
    $("clusterRows").innerHTML = `<tr><td colspan="3" class="empty">${clusters.length ? "Tidak ada data yang cocok dengan pencarian." : "Belum ada data klaster. Hubungkan Google Spreadsheet melalui pengaturan di public/app.js."}</td></tr>`;
    return;
  }
  $("clusterRows").innerHTML = rows.map(c => {
    const title = get(c,"nama_klaster") || get(c,"cluster_id") || "Klaster tanpa nama";
    const region = [get(c,"jenis_wilayah"),get(c,"nama_kab_kota"),get(c,"nama_provinsi")].filter(Boolean).join(", ") || "Wilayah belum diisi";
    const statusText = get(c,"status_pembentukan") || "Belum Ada Data";
    return `<tr><td><span class="cluster-name">${escapeHTML(title)}</span><span class="cluster-region">${escapeHTML(region)}</span></td><td><span class="status-badge ${statusClass(statusText)}">${escapeHTML(statusText)}</span></td><td>${escapeHTML(get(c,"tahun_pembentukan") || "—")}</td></tr>`;
  }).join("");
}
async function loadData() {
  $("dataState").textContent = "Memuat data…";
  $("clusterRows").innerHTML = '<tr><td colspan="3" class="empty">Menghubungkan sumber data…</td></tr>';
  hideNotice();
  if (!SHEET_CSV_URL.startsWith("http")) {
    clusters = [];
    renderStats(); renderTable(); refreshMap();
    $("dataState").textContent = "Spreadsheet belum dihubungkan";
    showNotice("Aplikasi siap digunakan. Untuk menampilkan data, publikasikan sheet DATA_KLASTER sebagai CSV dan masukkan URL-nya ke variabel SHEET_CSV_URL di public/app.js.");
    return;
  }
  try {
    const response = await fetch(SHEET_CSV_URL, {cache:"no-store"});
    if (!response.ok) throw new Error("Google Sheets merespons " + response.status);
    const csv = await response.text();
    clusters = parseCSV(csv)
      .filter(c => get(c,"nama_klaster") || get(c,"cluster_id"))
      .filter(c => !norm(get(c,"cluster_id")).includes("contoh-hapus"))
      .filter(c => ["terbentuk", "dalam proses"].includes(norm(get(c,"status_pembentukan"))));
    renderStats(); renderTable(); refreshMap();
    $("dataState").textContent = "Data berhasil dimuat";
    if (!clusters.length) showNotice("Sumber spreadsheet terhubung, tetapi belum ada baris data klaster.");
  } catch (error) {
    $("dataState").textContent = "Data belum tersedia";
    showNotice("Data Google Spreadsheet belum dapat dibaca. Pastikan sheet dipublikasikan sebagai CSV dan URL di public/app.js benar.");
    clusters = []; renderStats(); renderTable(); refreshMap();
  }
}
$("searchInput").addEventListener("input", renderTable);
$("statusFilter").addEventListener("change", renderTable);
$("refreshBtn").addEventListener("click", loadData);
initMap();
loadData();
