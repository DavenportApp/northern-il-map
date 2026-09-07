// Initialize map centered on Northern Illinois with Google Maps
const map = L.map('map').setView([41.8, -88.5], 9);

// Add Google Maps layer
L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps'
}).addTo(map);

// Precise coordinates for Northern Illinois boundaries based on actual roads and rivers
const coordinates = {
    // Major rivers and water boundaries
    rockRiverWest: -89.52,
    illinoisRiver: -89.48,
    
    // Route 47 (runs north-south, eastern edge of Linda's territory)
    route47Lat: -88.08,
    
    // Interstate 90 (runs east-west, northern boundary)
    i90Lat: 41.84,
    
    // Route 31 (runs north-south)
    route31Lon: -88.30,
    
    // Route 34 (runs east-west)
    route34Lat: 41.75,
    
    // Interstate 39 (runs north-south)
    i39Lon: -88.62,
    
    // Interstate 88 (runs east-west, southern boundary of Linda)
    i88Lat: 41.55,
    
    // Interstate 55 (runs diagonally, southern boundary of Dave)
    i55Lat: 41.65,
    
    // Interstate 74 (runs east-west, southern boundary of Nick)
    i74Lat: 41.15
};

// LINDA'S TERRITORY - Northeast corner
// Bounded by: River (west) → Route 47 (east) → I90 (south) → Route 31 → Route 34 → I39 → I88 → River
const lindaBoundary = [
    [42.15, coordinates.rockRiverWest],      // NW corner at river
    [42.15, coordinates.route47Lat],         // NE corner at Route 47
    [coordinates.i90Lat, coordinates.route47Lat],     // SE at I90/Route 47
    [coordinates.i90Lat, coordinates.route31Lon],     // I90 runs to Route 31
    [41.88, coordinates.route31Lon],         // Route 31 running south
    [41.80, coordinates.route34Lat],         // Route 34 intersection
    [41.70, coordinates.i39Lon],             // I39 junction
    [coordinates.i88Lat, coordinates.i39Lon],        // I88/I39 intersection
    [coordinates.i88Lat, coordinates.rockRiverWest], // I88 west to river
    [42.15, coordinates.rockRiverWest]      // Back to NW corner
];

// DAVE'S TERRITORY - East of Linda to I55
// Bounded by: Route 31 (west) → I90 (north) → I55 (south/east) → back to Route 31
const daveBoundary = [
    [coordinates.i90Lat, coordinates.route31Lon],    // NW at I90/Route 31
    [coordinates.i90Lat, -87.45],                     // NE at I90
    [coordinates.i55Lat, -87.45],                     // SE corner
    [coordinates.i55Lat, coordinates.route31Lon],     // SW at Route 31/I55
    [coordinates.i90Lat, coordinates.route31Lon]     // Back to start
];

// NICK'S TERRITORY - South of I55 to I74
// Bounded by: I55 (north) → I74 (south) → River (west) → back to I55
const nickBoundary = [
    [coordinates.i55Lat, coordinates.i39Lon],        // NW at I55/I39 area
    [coordinates.i55Lat, -87.45],                     // NE at I55
    [coordinates.i74Lat, -87.45],                     // SE at I74
    [coordinates.i74Lat, coordinates.rockRiverWest], // SW at I74/River
    [coordinates.i55Lat, coordinates.rockRiverWest], // NW at I55/River
    [coordinates.i55Lat, coordinates.i39Lon]         // Back to start
];

// Draw territory polygons
const lindaTerritory = L.polygon(lindaBoundary, {
    color: '#3498db',
    weight: 3,
    opacity: 0.8,
    fillColor: '#3498db',
    fillOpacity: 0.3
}).addTo(map);
lindaTerritory.bindPopup('<strong>Linda\'s Territory</strong><br><strong>Boundaries:</strong><br>• West: Rock River<br>• East: Route 47<br>• North: Route 47 line<br>• South: I88<br>• Via: I90 → Route 31 → Route 34 → I39');

const daveTerritory = L.polygon(daveBoundary, {
    color: '#2ecc71',
    weight: 3,
    opacity: 0.8,
    fillColor: '#2ecc71',
    fillOpacity: 0.3
}).addTo(map);
daveTerritory.bindPopup('<strong>Dave\'s Territory</strong><br><strong>Boundaries:</strong><br>• West: Route 31<br>• North: I90<br>• South: I55<br>• East: Open to state border');

const nickTerritory = L.polygon(nickBoundary, {
    color: '#e74c3c',
    weight: 3,
    opacity: 0.8,
    fillColor: '#e74c3c',
    fillOpacity: 0.3
}).addTo(map);
nickTerritory.bindPopup('<strong>Nick\'s Territory</strong><br><strong>Boundaries:</strong><br>• North: I55<br>• South: I74<br>• West: Illinois River<br>• East: State border');

// Add territory center labels
function addTerritorLabel(lat, lon, name, color) {
    L.marker([lat, lon], {
        icon: L.divIcon({
            className: 'territory-label',
            html: `<div style="
                background-color: ${color}; 
                color: white; 
                padding: 10px 15px; 
                border-radius: 6px; 
                font-weight: bold; 
                font-size: 16px;
                border: 3px solid white;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                text-align: center;
            ">${name}</div>`,
            iconSize: [120, 45],
            iconAnchor: [60, 22]
        })
    }).addTo(map);
}

addTerritorLabel(41.90, -88.80, 'LINDA', '#3498db');
addTerritorLabel(41.75, -87.85, 'DAVE', '#2ecc71');
addTerritorLabel(41.40, -88.50, 'NICK', '#e74c3c');

// Draw major highway/river boundary lines with labels
const boundaryLineStyle = {
    color: '#9b59b6',
    weight: 3,
    opacity: 0.9,
    dashArray: '5, 5'
};

const riverLineStyle = {
    color: '#34b4eb',
    weight: 4,
    opacity: 0.9
};

// Illinois/Rock River (western boundary)
L.polyline([
    [42.2, coordinates.rockRiverWest],
    [41.1, coordinates.rockRiverWest]
], riverLineStyle).addTo(map).bindPopup('Illinois/Rock River - Western Boundary');

// Route 47 (eastern boundary of Linda)
L.polyline([
    [42.15, coordinates.route47Lat],
    [41.5, coordinates.route47Lat]
], boundaryLineStyle).addTo(map).bindPopup('Route 47 - Linda/Dave Boundary');

// Interstate 90 (northern boundary)
L.polyline([
    [coordinates.i90Lat, coordinates.rockRiverWest],
    [coordinates.i90Lat, -87.3]
], { ...boundaryLineStyle, color: '#e67e22' }).addTo(map).bindPopup('Interstate 90 - Northern Boundary');

// Route 31 (Dave's west boundary)
L.polyline([
    [42.0, coordinates.route31Lon],
    [41.4, coordinates.route31Lon]
], boundaryLineStyle).addTo(map).bindPopup('Route 31 - Dave/Nick Boundary');

// Route 34 (Linda's southern transition)
L.polyline([
    [coordinates.route34Lat, coordinates.rockRiverWest],
    [coordinates.route34Lat, -87.8]
], boundaryLineStyle).addTo(map).bindPopup('Route 34 - Linda Territory');

// Interstate 39 (Linda/Nick division)
L.polyline([
    [42.1, coordinates.i39Lon],
    [41.2, coordinates.i39Lon]
], { ...boundaryLineStyle, color: '#e67e22' }).addTo(map).bindPopup('Interstate 39 - Territory Marker');

// Interstate 88 (Linda's southern boundary)
L.polyline([
    [coordinates.i88Lat, coordinates.rockRiverWest],
    [coordinates.i88Lat, -87.3]
], { ...boundaryLineStyle, color: '#e67e22' }).addTo(map).bindPopup('Interstate 88 - Linda/Nick Boundary');

// Interstate 55 (Dave's southern boundary)
L.polyline([
    [coordinates.i55Lat, coordinates.i39Lon],
    [coordinates.i55Lat, -87.5]
], { ...boundaryLineStyle, color: '#e67e22' }).addTo(map).bindPopup('Interstate 55 - Dave/Nick Boundary');

// Interstate 74 (Nick's southern boundary)
L.polyline([
    [coordinates.i74Lat, coordinates.rockRiverWest],
    [coordinates.i74Lat, -87.4]
], { ...boundaryLineStyle, color: '#e67e22' }).addTo(map).bindPopup('Interstate 74 - Southern Nick Boundary');

console.log('Northern Illinois Territory Map with Google Maps loaded successfully');