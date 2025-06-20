const EDITOR_MODE = true;
const bounds = [[0, 0], [0, 0]];
const tagColors = {};
const markers = [];

const baseMap = L.imageOverlay('map_recourses/map_dark.png', bounds);
const satelliteMap = L.imageOverlay('map_recourses/map_sat.png', bounds);
const propertyBounds = L.imageOverlay('map_recourses/property_bounds.png', bounds);
const muggingMap = L.imageOverlay('map_recourses/mugging_map.png', bounds);

const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -1.6,
  maxZoom: 2,
  layers: [baseMap]
});

const baseLayers = {
  "Default View": baseMap,
  "Satellite View": satelliteMap
};

const overlayLayers = {
  "Property Boundaries": propertyBounds,
  "Mugging Map": muggingMap
};

L.control.layers(baseLayers, overlayLayers, { position: 'bottomright' }).addTo(map);

function getScaleFromZoom(zoom) {
  return 1 + zoom * 0.3;
}

function startCode() {
  const params = new URLSearchParams(window.location.search);
  return [...params.keys()][0] || null;
}

function colorizeIcon(imgSrc, colorHex, scale = 1, callback) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = () => {
    const baseSize = 32 * scale;
    const iconSize = Math.max(40, baseSize);
    const padding = 12 * scale;
    const size = iconSize + padding * 2;
    const center = size / 2;
    const radius = iconSize / 2 + padding / 2;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.arc(center, center, radius + 6, 0, 2 * Math.PI);
    ctx.fillStyle = colorHex + '55';
    ctx.fill();

    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = iconSize;
    tempCanvas.height = iconSize;
    const tempCtx = tempCanvas.getContext("2d");

    tempCtx.drawImage(img, 0, 0, iconSize, iconSize);
    tempCtx.globalCompositeOperation = "source-in";
    tempCtx.fillStyle = colorHex || 'gray';
    tempCtx.fillRect(0, 0, iconSize, iconSize);

    ctx.drawImage(tempCanvas, padding, padding);
    callback(canvas.toDataURL());
  };
  img.src = imgSrc;
}

function showSidebar(location) {
  document.getElementById('location-name').textContent = location.name;
  const tagContainer = document.getElementById('location-tags');
  tagContainer.innerHTML = '';
  location.tags.forEach(tag => {
    const span = document.createElement('span');
    span.textContent = tag;
    span.style.backgroundColor = tagColors[tag] || 'gray';
    tagContainer.appendChild(span);
  });

  document.getElementById('location-description').textContent = location.description;
  document.getElementById('location-image').src = location.image;
  document.getElementById('sidebar').classList.add('active');
}

document.getElementById('sidebar-close').addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('active');
});

document.getElementById('search-box').addEventListener('input', () => {
  const query = document.getElementById('search-box').value.toLowerCase();
  markers.forEach(marker => {
    const { name, tags, description } = marker.metaData;
    const match = name.toLowerCase().includes(query) ||
      tags.some(t => t.toLowerCase().includes(query)) ||
      (description && description.toLowerCase().includes(query));

    marker[match ? 'addTo' : 'removeFrom'](map);
  });
});

const mapImage = new Image();
mapImage.src = 'map_recourses/map.png';
mapImage.onload = () => {
  const [w, h] = [mapImage.width, mapImage.height];
  bounds[1] = [h, w];

  [baseMap, satelliteMap, propertyBounds, muggingMap].forEach(layer => layer.setBounds(bounds));
  map.setMaxBounds(bounds);
  map.fitBounds(bounds);

  const overlayKey = startCode();
  if (overlayKey === 'propertybounds') {
    propertyBounds.addTo(map);
  } else if (overlayKey === 'mugging') {
    muggingMap.addTo(map);
    document.getElementById('overlay-info').style.display = 'block';
  }

  muggingMap.on('add', () => document.getElementById('overlay-info').style.display = 'block');
  muggingMap.on('remove', () => {
    document.getElementById('overlay-info').classList.remove('hidden');
    document.getElementById('overlay-info').style.display = 'none';
    document.getElementById('overlay-info-toggle').style.display = 'none';
  });

  document.getElementById('hide-overlay-info').addEventListener('click', () => {
    document.getElementById('overlay-info').classList.add('hidden');
    document.getElementById('overlay-info-toggle').style.display = 'block';
  });

  document.getElementById('overlay-info-toggle').addEventListener('click', () => {
    document.getElementById('overlay-info').classList.remove('hidden');
    document.getElementById('overlay-info-toggle').style.display = 'none';
  });

  loadMapData();
};

//get tags
function loadMapData() {
  Promise.all([
    fetch('/map_recourses/locations.json').then(res => res.json()),
    fetch('/map_recourses/tags.json').then(res => res.json())
  ]).then(([locations, tags]) => {
    tags.forEach(t => tagColors[t.name] = t.color);
    setupTagFilter(tags, locations);
    createMarkers(locations);
    setupTagDirectory(tags, locations);
    if (EDITOR_MODE) initEditorMode();
  });
}

//filter
function setupTagFilter(tags, locations) {
  const tagFilter = document.getElementById('tag-filter');
  const activeTags = new Set();
  const usedPrimaryTags = new Set(locations.map(loc => loc.primaryTag));

  tags.forEach(t => {
    if (!usedPrimaryTags.has(t.name)) return;
    activeTags.add(t.name);

    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" value="${t.name}" checked> ${t.name}`;
    const checkbox = label.querySelector('input');
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) activeTags.add(t.name);
      else activeTags.delete(t.name);

      markers.forEach(marker => {
        const { primaryTag } = marker.metaData;
        marker[activeTags.has(primaryTag) ? 'addTo' : 'removeFrom'](map);
      });
    });
    tagFilter.appendChild(label);
  });
}

//directory
function setupTagDirectory(tags, locations) {
  const container = document.getElementById('tag-directory-content');
  const toggle = document.getElementById('tag-directory-toggle');
  const tagDirectory = document.getElementById('tag-directory');

  toggle.addEventListener('click', () => {
    const isVisible = tagDirectory.style.display === 'block';
    tagDirectory.style.display = isVisible ? 'none' : 'block';
  });

  const usedTags = new Set(locations.map(loc => loc.primaryTag));
  usedTags.forEach(tagName => {
    const card = document.createElement('div');
    card.className = 'tag-card';

    const header = document.createElement('h3');
    header.textContent = tagName;
    header.style.color = tagColors[tagName] || 'white';
    card.appendChild(header);

    const list = document.createElement('ul');
    locations.filter(loc => loc.primaryTag === tagName).forEach(loc => {
      const item = document.createElement('li');
      item.textContent = loc.name;
      item.addEventListener('click', () => {
        tagDirectory.style.display = 'none';
        const marker = markers.find(m => m.metaData === loc);
        if (marker) {
          map.setView([loc.y, loc.x], map.getZoom());
          marker.fire('click');
        }
      });
      list.appendChild(item);
    });

    card.appendChild(list);
    container.appendChild(card);
  });
}

//draw markers
function createMarkers(locations) {
  const scale = getScaleFromZoom(map.getZoom());
  locations.forEach(loc => {
    const color = tagColors[loc.primaryTag] || 'gray';

    if (loc.icon && loc.primaryTag) {
      colorizeIcon(loc.icon, color, scale, tintedSrc => {
        const size = 32 * scale;
        const icon = L.icon({
          iconUrl: tintedSrc,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2]
        });
        addMarker(loc, icon);
      });
    } else {
      const icon = L.divIcon({ className: 'custom-marker', iconSize: [16, 16] });
      addMarker(loc, icon);
    }
  });

  map.on('zoomend', () => {
    const scale = getScaleFromZoom(map.getZoom());
    markers.forEach(marker => {
      const data = marker.metaData;
      if (data.icon && data.primaryTag) {
        colorizeIcon(data.icon, tagColors[data.primaryTag] || 'gray', scale, tintedSrc => {
          const size = 34 * scale;
          marker.setIcon(L.icon({
            iconUrl: tintedSrc,
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2]
          }));
        });
      }
    });
  });
}

function addMarker(location, icon) {
  const marker = L.marker([location.y, location.x], {
    icon,
    title: location.name
  }).addTo(map);

  marker.metaData = location;
  marker.metaTags = location.tags;
  marker.on('click', () => showSidebar(location));
  markers.push(marker);
}

//edit mode
function initEditorMode() {
  const toggle = document.getElementById('editor-toggle');
  toggle.style.display = 'block';
  let enabled = false;

  toggle.addEventListener('click', () => {
    enabled = !enabled;
    toggle.textContent = enabled ? 'Disable Editor' : 'Enable Editor';
    document.getElementById('map').style.cursor = enabled ? 'crosshair' : 'grab';

    if (enabled) {
      map.once('click', e => {
        const x = Math.round(e.latlng.lng);
        const y = Math.round(e.latlng.lat);
        const newLocation = {
          name: "Location",
          x,
          y,
          tags: ["Park"],
          primaryTag: "Park",
          description: "Description here.",
          image: "map_recourses/images/image.jpg",
          icon: "map_recourses/icons/park.png"
        };
        console.log(JSON.stringify(newLocation, null, 2));
        alert('Marker data copied to console!');
      });
    }
  });
}
