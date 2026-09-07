// Initialize map centered on Northern Illinois
const map = L.map('map').setView([41.8, -88.5], 9);

// Add base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

// Define approximate coordinates for key landmarks in Northern Illinois
// These are approximate for visualization purposes
const landmarks = {
    riverWest: -89.5,  // Rock River/Illinois River (approximate western boundary)
    route47East: -88.1, // Route 47
    route31: -88.3,
    route34: -88.15,
    i39: -88.6,
    i88: -88.0,
    i90: 41.85,
    i55: 41.65,
    i74: 41.15
};

// Define territory polygons based on your boundaries

// LINDA'S TERRITORY
// Northeast corner: River on west to Route 47 on east
// Route 47 south to I90
// I90 east to Route 31
// Route 31 south to Route 34
// Route 34 to I39 then south to I88
// I88 west to river
const lindaCoords = [
    [42.2, landmarks.riverWest],      // NW corner
    [42.2, landmarks.route47East],    // NE corner (Route 47)
    [landmarks.i90, landmarks.route47East],  // SE along Route 47 to I90
    [landmarks.i90, landmarks.route31],      // I90 east to Route 31
    [41.85, landmarks.route31],       // Route 31 south
    [41.75, landmarks.route34],       // Route 34
    [41.65, landmarks.i39],           // I39 area
    [41.55, landmarks.i88],           // I88
    [41.55, landmarks.riverWest],     // West to river
    [42.2, landmarks.riverWest]       // Back to NW
];

// DAVE'S TERRITORY
// East of Linda to I55 on the south
const daveCoords = [
    [landmarks.i90, landmarks.route31],      // Start at I90/Route 31
    [landmarks.i90, -87.5],                  // I90 east
    [41.65, -87.5],                         // South to I55 area
    [41.65, landmarks.route31],             // I55 west to Route 31
    [landmarks.i90, landmarks.route31]      // Back to start
];

// NICK'S TERRITORY
// South of Dave (I55) down to I74
// I74 to the River on the west
const nickCoords = [
    [41.65, landmarks.i39],                 // Start at I55/I39 area
    [41.65, -87.5],                         // I55 east
    [landmarks.i74, -87.5],                 // South to I74
    [landmarks.i74, landmarks.riverWest],   // I74 west to river
    [41.65, landmarks.riverWest],           // North to I55
    [41.65, landmarks.i39]                  // Back to start
];

// Draw territories
const lindaPolygon = L.polygon(lindaCoords, {
    color: '#3498db',
    weight: 3,
    opacity: 0.7,
    fillColor: '#3498db',
    fillOpacity: 0.4,
    dashArray: '5, 5'
}).addTo(map).bindPopup('<strong>Linda\'s Territory</strong><br>Northeast Corner<br>Route 47 to I90 to Route 31 to Route 34 to I39/I88');

const davePolygon = L.polygon(daveCoords, {
    color: '#2ecc71',
    weight: 3,
    opacity: 0.7,
    fillColor: '#2ecc71',
    fillOpacity: 0.4,
    dashArray: '5, 5'
}).addTo(map).bindPopup('<strong>Dave\'s Territory</strong><br>East of Linda<br>to I55 on the south');

const nickPolygon = L.polygon(nickCoords, {
    color: '#e74c3c',
    weight: 3,
    opacity: 0.7,
    fillColor: '#e74c3c',
    fillOpacity: 0.4,
    dashArray: '5, 5'
}).addTo(map).bindPopup('<strong>Nick\'s Territory</strong><br>South of Dave (I55)<br>down to I74 to River');

// Add labels for each territory
const addLabel = (latlng, text, color) => {
    L.marker(latlng, {
        icon: L.divIcon({
            className: 'territory-label',
            html: `<div style="background-color: ${color}; color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold; border: 2px solid #333; text-align: center;">${text}</div>`,
            iconSize: [100, 40],
            iconAnchor: [50, 20]
        })
    }).addTo(map);
};

addLabel([42.0, -88.8], 'LINDA', '#3498db');
addLabel([41.75, -87.8], 'DAVE', '#2ecc71');
addLabel([41.4, -88.5], 'NICK', '#e74c3c');

// Add major route/interstate lines
const routeStyle = {
    color: '#9b59b6',
    weight: 2,
    opacity: 0.8,
    dashArray: '3, 3'
};

// I90
L.polyline([
    [landmarks.i90, landmarks.riverWest],
    [landmarks.i90, -87.3]
], { ...routeStyle, color: '#e67e22', weight: 3 }).addTo(map).bindPopup('Interstate 90');

// I88
L.polyline([
    [41.55, landmarks.riverWest],
    [41.55, -87.5]
], { ...routeStyle, color: '#e67e22', weight: 3 }).addTo(map).bindPopup('Interstate 88');

// I55
L.polyline([
    [42.0, -88.3],
    [landmarks.i74, -88.3]
], { ...routeStyle, color: '#e67e22', weight: 3 }).addTo(map).bindPopup('Interstate 55');

// I74
L.polyline([
    [landmarks.i74, landmarks.riverWest],
    [landmarks.i74, -87.5]
], { ...routeStyle, color: '#e67e22', weight: 3 }).addTo(map).bindPopup('Interstate 74');

// I39
L.polyline([
    [42.2, landmarks.i39],
    [41.5, landmarks.i39]
], { ...routeStyle, color: '#e67e22', weight: 2 }).addTo(map).bindPopup('Interstate 39');

console.log('Northern Illinois Territory Map loaded successfully');