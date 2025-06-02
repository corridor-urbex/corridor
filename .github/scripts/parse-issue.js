const fs = require('fs');

const issueBody = process.argv[2];

const nameMatch = issueBody.match(/### 🏚️ Location Name:\\n(.+?)\\n/);
const coordsMatch = issueBody.match(/### 📍 Coordinates:\\n(.+?)\\n/);
const descMatch = issueBody.match(/### 📄 Description:\\n([\s\S]+?)\\n### 📷/);

if (!nameMatch || !coordsMatch || !descMatch) {
  console.error('Invalid issue format');
  process.exit(1);
}

const name = nameMatch[1].trim();
const coords = coordsMatch[1].trim().split(',').map(Number);
const description = descMatch[1].trim();

const newFeature = {
  type: "Feature",
  properties: { name, description },
  geometry: {
    type: "Point",
    coordinates: [coords[1], coords[0]]
  }
};

const data = JSON.parse(fs.readFileSync('locations.geojson'));
data.features.push(newFeature);
fs.writeFileSync('locations.geojson', JSON.stringify(data, null, 2));
