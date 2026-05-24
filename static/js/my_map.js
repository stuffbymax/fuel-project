var map = L.map('map').setView([53.71109, -1.871979], 7);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


// // ==========================
// // ICONS
// // ==========================

// const blueIcon = new L.Icon({
//     iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
//     shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34]
// });

// const greenIcon = new L.Icon({
//     iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
//     shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34]
// });

// // ==========================
// // SEARCH STORAGE
// // ==========================

// const allMarkers = [];

// // ==========================
// // SEARCH BAR
// // ==========================

// const searchControl = L.control({ position: 'topright' });

// searchControl.onAdd = function () {
//     const div = L.DomUtil.create('div');
//     div.innerHTML = `
//         <input
//             type="text"
//             id="searchBox"
//             placeholder="Search by city or postcode..."
//             style="
//                 padding: 8px 12px;
//                 width: 250px;
//                 border: 1px solid #ccc;
//                 border-radius: 4px;
//                 font-size: 14px;
//                 background: white;
//                 box-shadow: 0 2px 6px rgba(0,0,0,0.2);
//                 outline: none;
//             "
//         />
//     `;
//     L.DomEvent.disableClickPropagation(div);
//     L.DomEvent.disableScrollPropagation(div);
//     return div;
// };

// searchControl.addTo(map);

// // ==========================
// // SEARCH LOGIC
// // ==========================

// document.addEventListener("input", function (e) {
//     if (e.target.id !== "searchBox") return;

//     const value = e.target.value.toLowerCase().trim();

//     // Reset all markers to blue
//     allMarkers.forEach(item => item.marker.setIcon(blueIcon));

//     if (value === "") return;

//     const matches = allMarkers.filter(item =>
//         item.postcode.toLowerCase().includes(value) ||
//         item.city.toLowerCase().includes(value)
//     );

//     matches.forEach(item => item.marker.setIcon(greenIcon));

//     if (matches.length > 0) {
//         const marker = matches[0].marker;
//         map.setView(marker.getLatLng(), 13);
//         marker.openPopup();
//     }
// });

// // ==========================
// // PRICE PANEL UPDATE
// // ==========================

// function updatePricePanel(row) {
//     document.getElementById("e10_price").textContent = row.E10 ? row.E10 + "p" : "N/A";
//     document.getElementById("e5_price").textContent  = row.E5  ? row.E5  + "p" : "N/A";
//     document.getElementById("diesel_price").textContent = row.B7S ? row.B7S + "p" : "N/A";
// }

// // ==========================
// // ADD MARKERS
// // ==========================

// function addMarkers(data) {
//     data.forEach(row => {
//         const lat = parseFloat(row.latitude);
//         const lon = parseFloat(row.longitude);

//         if (isNaN(lat) || isNaN(lon)) return;

//         const marker = L.marker([lat, lon], { icon: blueIcon }).addTo(map);

//         allMarkers.push({
//             marker,
//             postcode: row.postcode || "",
//             city:     row.city     || ""
//         });

//         marker.bindPopup(`
//             <b>${row.postcode || "Unknown"}</b><br>
//             ${row.address_line_1 || ""}<br>
//             ${row.city || ""}, ${row.county || ""}<br><br>
//             <table style="border-collapse:collapse;font-size:13px;">
//                 <tr><td><b>Unleaded (E10)</b></td><td style="padding-left:8px">${row.E10  || "N/A"}p</td></tr>
//                 <tr><td><b>Premium (E5)</b></td> <td style="padding-left:8px">${row.E5   || "N/A"}p</td></tr>
//                 <tr><td><b>Diesel (B7S)</b></td> <td style="padding-left:8px">${row.B7S  || "N/A"}p</td></tr>
//                 <tr><td><b>B7P</b></td>          <td style="padding-left:8px">${row.B7P  || "N/A"}p</td></tr>
//                 <tr><td><b>B10</b></td>          <td style="padding-left:8px">${row.B10  || "N/A"}p</td></tr>
//                 <tr><td><b>HVO</b></td>          <td style="padding-left:8px">${row.HVO  || "N/A"}p</td></tr>
//             </table>
//         `);

//         marker.on("click", function () {
//             updatePricePanel(row);
//         });
//     });
// }

// // ==========================
// // FETCH FROM FLASK API
// // ==========================

// const cities = ["bradford", "halifax"]; // add more cities here

// cities.forEach(city => {
//     fetch(`/fuel/${city}`)
//         .then(res => {
//             if (!res.ok) throw new Error(`${city}: ${res.status}`);
//             return res.json();
//         })
//         .then(data => addMarkers(data))
//         .catch(err => console.error(`Failed to load ${city}:`, err));
// });