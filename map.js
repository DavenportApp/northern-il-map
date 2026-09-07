// Initialize map centered on Northern Illinois
const map = L.map('map').setView([41.8, -88.5], 9);

// Add Stamen TonerLite layer - works great for local files and shows roads clearly
L.tileLayer('https://tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors, &copy; Hydda',
    maxZoom: 18
}).addTo(map);

// Precise coordinates for Northern Illinois boundaries
const coordinates = {
    riverWest: -89.50,
    route47: -88.08,
    i90: 41.84,
    route31: -88.30,
    route34: 41.75,
    i39: -88.62,
    i88: 41.55,
    i55: 41.65,
    i74: 41.15
};

// LINDA'S TERRITORY - Northeast corner
// River (west) → Route 47 (east) → I90 (south) → Route 31 → Route 34 → I39 → I88 → River
const lindaBoundary = [
    [42.15, coordinates.riverWest],           // NW corner at river
    [42.15, coordinates.route47],             // NE corner at Route 47
    [coordinates.i90, coordinates.route47],   // SE at I90/Route 47
    [coordinates.i90, coordinates.route31],   // I90 to Route 31
    [41.88, coordinates.route31],             // Route 31 south
    [41.78, coordinates.route34],             // Route 34
    [41.68, coordinates.i39],                 // I39 junction
    [coordinates.i88, coordinates.i39],       // I88/I39 intersection
    [coordinates.i88, coordinates.riverWest], // I88 west to river
    [42.15, coordinates.riverWest]            // Back to NW
];

// DAVE'S TERRITORY - East of Linda to I55
const daveBoundary = [
    [coordinates.i90, coordinates.route31],   // NW at I90/Route 31
    [coordinates.i90, -87.45],                // NE at I90
    [coordinates.i55, -87.45],                // SE corner
    [coordinates.i55, coordinates.route31],   // SW at Route 31/I55
    [coordinates.i90, coordinates.route31]    // Back to start
];

// NICK'S TERRITORY - South of I55 to I74
const nickBoundary = [
    [coordinates.i55, coordinates.i39],       // NW at I55/I39
    [coordinates.i55, -87.45],                // NE at I55
    [coordinates.i74, -87.45],                // SE at I74
    [coordinates.i74, coordinates.riverWest], // SW at I74/River
    [coordinates.i55, coordinates.riverWest], // NW at I55/River
    [coordinates.i55, coordinates.i39]        // Back to start
];

// Draw territory polygons with bold outlines
const lindaTerritory = L.polygon(lindaBoundary, {
    color: '#3498db',
    weight: 4,
    opacity: 0.9,
    fillColor: '#3498db',
    fillOpacity: 0.25,
    lineCap: 'round',
    lineJoin: 'round'
}).addTo(map);
lindaTerritory.bindPopup('<div style="font-weight: bold; font-size: 14px;"><strong style="color: #3498db;">LINDA\'S TERRITORY</strong><br><strong>Boundaries:</strong><br>• West: Rock/Illinois River<br>• East: Route 47<br>• North: Route 47 line<br>• South: I88<br>• Via: I90 → Route 31 → Route 34 → I39</div>');

const daveTerritory = L.polygon(daveBoundary, {
    color: '#2ecc71',
    weight: 4,
    opacity: 0.9,
    fillColor: '#2ecc71',
    fillOpacity: 0.25,
    lineCap: 'round',
    lineJoin: 'round'
}).addTo(map);
daveTerritory.bindPopup('<div style="font-weight: bold; font-size: 14px;"><strong style="color: #2ecc71;">DAVE\'S TERRITORY</strong><br><strong>Boundaries:</strong><br>• West: Route 31<br>• North: Interstate 90<br>• South: Interstate 55<br>• East: Open to state border</div>');

const nickTerritory = L.polygon(nickBoundary, {
    color: '#e74c3c',
    weight: 4,
    opacity: 0.9,
    fillColor: '#e74c3c',
    fillOpacity: 0.25,
    lineCap: 'round',
    lineJoin: 'round'
}).addTo(map);
nickTerritory.bindPopup('<div style="font-weight: bold; font-size: 14px;"><strong style="color: #e74c3c;">NICK\'S TERRITORY</strong><br><strong>Boundaries:</strong><br>• North: Interstate 55<br>• South: Interstate 74<br>• West: Illinois River<br>• East: State border</div>');

// Add territory labels
function addTerritoryLabel(lat, lon, name, color) {
    L.marker([lat, lon], {
        icon: L.divIcon({
            className: 'territory-label',
            html: `<div style="
                background-color: ${color}; 
                color: white; 
                padding: 12px 18px; 
                border-radius: 8px; 
                font-weight: bold; 
                font-size: 18px;
                border: 4px solid white;
                box-shadow: 0 3px 8px rgba(0,0,0,0.4);
                text-align: center;
                letter-spacing: 2px;
            ">${name}</div>`,
            iconSize: [140, 50],
            iconAnchor: [70, 25]
        })
    }).addTo(map);
}

addTerritoryLabel(41.90, -88.80, 'LINDA', '#3498db');
addTerritoryLabel(41.75, -87.85, 'DAVE', '#2ecc71');
addTerritoryLabel(41.40, -88.50, 'NICK', '#e74c3c');

// Draw boundary lines tracing actual roads and rivers
const highwayStyle = {
    color: '#e67e22',
    weight: 3,
    opacity: 0.9,
    dashArray: '8, 4',
    lineCap: 'round'
};

const riverStyle = {
    color: '#3498db',
    weight: 4,
    opacity: 0.85,
    lineCap: 'round',
    lineJoin: 'round'
};

// ===== RIVERS =====
// Rock/Illinois River - Western boundary (runs north-south)
L.polyline([
    [42.3, coordinates.riverWest],
    [41.0, coordinates.riverWest]
], { ...riverStyle, color: '#2980b9', weight: 5 }).addTo(map)
.bindPopup('<strong style="color: #2980b9; font-size: 12px;">ROCK/ILLINOIS RIVER<br>Western Boundary</strong>');

// ===== HIGHWAYS TRACING BOUNDARIES =====

// Route 47 - Linda/Dave boundary (runs north-south on eastern edge)
L.polyline([
    [42.2, coordinates.route47],
    [41.5, coordinates.route47]
], { ...highwayStyle, color: '#e67e22', weight: 3 }).addTo(map)
.bindPopup('<strong style="color: #e67e22;">US ROUTE 47<br>Linda/Dave Eastern Boundary</strong>');

// Interstate 90 - Northern boundary (runs east-west)
L.polyline([
    [coordinates.i90, coordinates.riverWest],
    [coordinates.i90, -87.2]
], { ...highwayStyle, weight: 4 }).addTo(map)
.bindPopup('<strong style="color: #e67e22;">INTERSTATE 90<br>Northern Boundary</strong>');

// Route 31 - Dave/Nick western boundary (runs north-south)
L.polyline([
    [42.0, coordinates.route31],
    [41.3, coordinates.route31]
], { ...highwayStyle, color: '#27ae60', weight: 3 }).addTo(map)
.bindPopup('<strong style="color: #27ae60;">US ROUTE 31<br>Dave/Nick Western Boundary</strong>');

// Route 34 - Linda interior junction (runs east-west)
L.polyline([
    [coordinates.route34, coordinates.riverWest],
    [coordinates.route34, -87.8]
], { ...highwayStyle, color: '#c0392b', weight: 3 }).addTo(map)
.bindPopup('<strong style="color: #c0392b;">US ROUTE 34<br>Linda Interior Transition</strong>');

// Interstate 39 - Linda/Nick division (runs north-south)
L.polyline([
    [42.1, coordinates.i39],
    [41.2, coordinates.i39]
], { ...highwayStyle, weight: 3 }).addTo(map)
.bindPopup('<strong style="color: #e67e22;">INTERSTATE 39<br>Linda/Nick Interior Marker</strong>');

// Interstate 88 - Linda southern boundary (runs east-west)
L.polyline([
    [coordinates.i88, coordinates.riverWest],
    [coordinates.i88, -87.2]
], { ...highwayStyle, weight: 4 }).addTo(map)
.bindPopup('<strong style="color: #e67e22;">INTERSTATE 88<br>Linda/Nick Southern Boundary</strong>');

// Interstate 55 - Dave/Nick southern boundary (runs diagonally)
L.polyline([
    [coordinates.i55, coordinates.i39],
    [coordinates.i55, -87.5]
], { ...highwayStyle, weight: 4 }).addTo(map)
.bindPopup('<strong style="color: #e67e22;">INTERSTATE 55<br>Dave/Nick Southern Boundary</strong>');

// Interstate 74 - Nick southern boundary (runs east-west)
L.polyline([
    [coordinates.i74, coordinates.riverWest],
    [coordinates.i74, -87.4]
], { ...highwayStyle, weight: 4 }).addTo(map)
.bindPopup('<strong style="color: #e67e22;">INTERSTATE 74<br>Nick Southern Boundary</strong>');

console.log('Northern Illinois Territory Map with road/river boundaries loaded successfully');