const fs = require('fs');

// issue body passed as arg
const raw = process.argv[2];

function extractValue(label) {
  const match = raw.match(new RegExp(`${label}:\\s*([\\s\\S]*?)(\\n\\w|$)`));
  return match ? match[1].trim().split('\n')[0] : '';
}

const name = extractValue('Location Name');
const coords = extractValue('Coordinates').split(',').map(Number);
const description = extractValue('Description');

if (!name || coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
  console.error('Missing or invalid location data');
  process.exit(1);
}

const newFeature = {
  type: "Feature",
  properties: {
    name,
    description
  },
  geometry: {
    type: "Point",
    coordinates: [coords[1], coords[0]] // [lng, lat]
  }
};

const geojsonPath = 'locations.geojson';
const geojson = JSON.parse(fs.readFileSync(geojsonPath, 'utf-8'));
geojson.features.push(newFeature);

fs.writeFileSync(geojsonPath, JSON.stringify(geojson, null, 2));
console.log(`✅ Added "${name}" to locations.geojson`);
