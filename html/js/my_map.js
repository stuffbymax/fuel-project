var map = L.map('map').setView([53.71109, -1.871979], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// ==========================
// ICONS
// ==========================

const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});


// search function experimental - not quite the thing yet but it works

// ==========================
// SEARCH STORAGE
// ==========================

const allMarkers = [];

// ==========================
// SEARCH BAR
// ==========================

const search = L.control({
    position: 'topright'
});

search.onAdd = function () {
    const div = L.DomUtil.create('div');

    div.innerHTML = `
        <input type="text" id="searchBox" placeholder="Search by city or postcode..."
            style="
                padding: 8px 12px;
                width: 250px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 14px;
                background: white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                outline: none;
            "
        />
    `;

    // Prevent map zoom/drag when interacting with the search box
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);

    return div;
    
};



search.addTo(map);

// ==========================
// SEARCH FUNCTION
// ==========================


document.addEventListener("input", function (e) {

    if (e.target.id !== "searchBox") return;

    const value = e.target.value.toLowerCase().trim();

    // Reset all markers to blue
    allMarkers.forEach(item => {
        item.marker.setIcon(blueIcon);
    });

    if (value === "") return;

    // Find matching markers
    const matches = allMarkers.filter(item => {

        return (
            item.postcode.toLowerCase().includes(value) ||
            item.city.toLowerCase().includes(value)
        );

    });

    // Make matches green
    matches.forEach(item => {
        item.marker.setIcon(greenIcon);
    });

    // Zoom to first match
    if (matches.length > 0) {

        const marker = matches[0].marker;

        map.setView(marker.getLatLng(), 13);

        marker.openPopup();
        

    }

});

// ==========================
// LOAD BRADFORD
// ==========================

fetch("../bradford_coordinates.csv")
    .then(response => response.text())
    .then(data => {

        const rows = data.split("\n");

        for (let i = 1; i < rows.length; i++) {

            const row = rows[i].trim();

            if (row === "") continue;

            const cols = row.split(",");

            const lat = parseFloat(cols[0]);
            const lon = parseFloat(cols[1]);

            const city = cols[2];
            const postcode = cols[3];
            const county = cols[4];

            const e5 = cols[6];
            const e10 = cols[7];
            const b7s = cols[8];
            const b7p = cols[9];
            const b10 = cols[10];
            const hvo = cols[11];
            

            if (isNaN(lat) || isNaN(lon)) {
                continue;
            }

            // BLUE MARKER
            const marker = L.marker(
                [lat, lon],
                { icon: blueIcon }
            ).addTo(map);

            // SAVE SEARCH DATA
            allMarkers.push({
                marker: marker,
                postcode: postcode,
                city: city
            });

            marker.bindPopup(
                `
                <b>${postcode}</b><br>
                ${city}<br>
                ${county}<br><br>

                Unleaded (E10): ${e10}p<br>
                Premium (E5): ${e5}p<br>
                B7S: ${b7s}p<br>
                B7P: ${b7p}p<br>
                B10: ${b10}p<br>
                HVO: ${hvo}p<br>
                `
            );

            marker.on("click", function () {

                document.getElementById("e10_price").textContent =
                    e10 + "p";

                document.getElementById("e5_price").textContent =
                    e5 + "p";

                document.getElementById("diesel_price").textContent =
                    b7s + "p";

            });

        }

    })
    .catch(error => {
        console.error("CSV ERROR:", error);
    });

// ==========================
// LOAD HALIFAX
// ==========================

fetch("../halifax_coordinates.csv")

    .then(response => response.text())

    .then(data => {

        const rows = data.split("\n");

        for (let i = 1; i < rows.length; i++) {

            const row = rows[i].trim();

            if (row === "") continue;

            const cols = row.split(",");

            const lat = parseFloat(cols[0]);
            const lon = parseFloat(cols[1]);

            const city = cols[2];
            const postcode = cols[3];
            const county = cols[4];

            const e5 = cols[6];
            const e10 = cols[7];
            const b7s = cols[8];
            const b7p = cols[9];
            const b10 = cols[10];
            const hvo = cols[11];

            if (isNaN(lat) || isNaN(lon)) {
                continue;
            }

            // BLUE MARKER
            const marker = L.marker(
                [lat, lon],
                { icon: blueIcon }
            ).addTo(map);

            // SAVE SEARCH DATA
            allMarkers.push({
                marker: marker,
                postcode: postcode,
                city: city
            });

            marker.bindPopup(
                `
                <b>${postcode}</b><br>
                ${city}<br>
                ${county}<br><br>

                Unleaded (E10): ${e10}p<br>
                Premium (E5): ${e5}p<br>
                B7S: ${b7s}p<br>
                B7P: ${b7p}p<br>
                B10: ${b10}p<br>
                HVO: ${hvo}p<br>
                `
            );

            marker.on("click", function () {

                document.getElementById("e10_price").textContent =
                    e10 + "p";

                document.getElementById("e5_price").textContent =
                    e5 + "p";

                document.getElementById("diesel_price").textContent =
                    b7s + "p";

            });

        }

    })
    .catch(error => {
        console.error("CSV ERROR:", error);
    });