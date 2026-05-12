var map = L.map('map').setView([53.71109, -1.871979], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// load bradford coordinates and add markers
fetch("../bradford_coordinates.csv")
    .then(response => response.text())
    .then(data => {
        const rows = data.split("\n");

        // Skip header row
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].trim();
            if (row === "") continue;

            const cols = row.split(",");
            // CSV columns
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
            // Skip invalid coords
            if (isNaN(lat) || isNaN(lon)) {
                continue;
            }
            // Add marker
            const marker = L.marker([lat, lon]).addTo(map);
            // Popup
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
            // When marker clicked update page info
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

// Load CSV and add markers for halifax coordinates
fetch("../halifax_coordinates.csv")

    .then(response => response.text())
    .then(data => {

        const rows = data.split("\n");

        // Skip header row
        for (let i = 1; i < rows.length; i++) {

            const row = rows[i].trim();

            if (row === "") continue;

            const cols = row.split(",");

            // CSV columns
            const lat = parseFloat(cols[0]);
            const lon = parseFloat(cols[1]);

            const city = cols[2];
            const postcode = cols[3];
            const county = cols[4];
            // fuel codes E5 E10 B7S B7P B10 HVO
            const e5 = cols[6];
            const e10 = cols[7];
            const b7s = cols[8];
            const b7p = cols[9];
            const b10 = cols[10];
            const hvo = cols[11];

            // Skip invalid coords
            if (isNaN(lat) || isNaN(lon)) {
                continue;
            }

            // Add marker
            const marker = L.marker([lat, lon]).addTo(map);

            // Popup
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

            // When marker clicked update page info
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