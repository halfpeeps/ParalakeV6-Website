const EDITOR_MODE = true;
  const bounds = [[0, 0], [0, 0]];
  const baseMap = L.imageOverlay('map_recourses/map_dark.png', bounds);
  const satelliteMap = L.imageOverlay('map_recourses/map_sat.png', bounds);
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
  L.control.layers(baseLayers, null, { position: 'bottomright' }).addTo(map);
  
  const tagColors = {};
  const markers = [];
  
  function getScaleFromZoom(zoom) {
    return 1 + zoom * 0.3;
  }
  
  function colorizeIcon(imgSrc, colorHex, scale = 1, callback) {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      const baseSize = 32 * scale;
      const iconSize = Math.max(40, baseSize);
      const padding = 12 * scale;
      const size = iconSize + padding * 2;
  
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
  
      const center = size / 2;
      const radius = iconSize / 2 + padding / 2;
  
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
    const tags = document.getElementById('location-tags');
    tags.innerHTML = '';
    location.tags.forEach(tag => {
      const span = document.createElement('span');
      span.textContent = tag;
      span.style.backgroundColor = tagColors[tag] || 'gray';
      tags.appendChild(span);
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
      const b = marker.metaData;
      const match =
        b.name.toLowerCase().includes(query) ||
        b.tags.some(t => t.toLowerCase().includes(query)) ||
        (b.description && b.description.toLowerCase().includes(query));
      marker[match ? 'addTo' : 'removeFrom'](map);
    });
  });
  
  const mapImage = new Image();
  mapImage.src = 'map_recourses/map.png';
  mapImage.onload = () => {
    const w = mapImage.width;
    const h = mapImage.height;
    bounds[1] = [h, w];
    baseMap.setBounds(bounds);
    satelliteMap.setBounds(bounds);
    map.setMaxBounds(bounds);
    map.fitBounds(bounds);
  
    Promise.all([
      fetch('/map_recourses/locations.json').then(res => res.json()),
      fetch('/map_recourses/tags.json').then(res => res.json())
    ]).then(([locations, tags]) => {
      tags.forEach(t => tagColors[t.name] = t.color);
      const usedPrimaryTags = new Set(locations.map(loc => loc.primaryTag));
      const tagFilter = document.getElementById('tag-filter');
      const activeTags = new Set();
  
      tags.forEach(t => {
        if (!usedPrimaryTags.has(t.name)) return;
        activeTags.add(t.name);
  
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" value="${t.name}" checked> ${t.name}`;
        const checkbox = label.querySelector('input');
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            activeTags.add(t.name);
          } else {
            activeTags.delete(t.name);
          }
  
          markers.forEach(marker => {
            const b = marker.metaData;
            const isVisible = activeTags.has(b.primaryTag);
            marker[isVisible ? 'addTo' : 'removeFrom'](map);
          });
        });
        tagFilter.appendChild(label);
      });
  
      const tagDirectoryContent = document.getElementById('tag-directory-content');
      usedPrimaryTags.forEach(tagName => {
        const tagCard = document.createElement('div');
        tagCard.className = 'tag-card';
  
        const header = document.createElement('h3');
        header.textContent = tagName;
        header.style.color = tagColors[tagName] || 'white';
        tagCard.appendChild(header);

  
        const list = document.createElement('ul');
  
        locations
          .filter(loc => loc.primaryTag === tagName)
          .forEach(loc => {
            const item = document.createElement('li');
            item.textContent = loc.name;
            item.addEventListener('click', () => {
              document.getElementById('tag-directory').style.display = 'none';
              const marker = markers.find(m => m.metaData === loc);
              if (marker) {
                map.setView([loc.y, loc.x], map.getZoom());
                marker.fire('click');
              }
            });
            list.appendChild(item);
          });
  
        tagCard.appendChild(list);
        tagDirectoryContent.appendChild(tagCard);
      });
  
      const tagDirectory = document.getElementById('tag-directory');
      let tagDirectoryVisible = false;

      document.getElementById('tag-directory-toggle').addEventListener('click', () => {
        tagDirectoryVisible = !tagDirectoryVisible;
        tagDirectory.style.display = tagDirectoryVisible ? 'block' : 'none';
      });

  
      const scale = getScaleFromZoom(map.getZoom());
  
      locations.forEach(b => {
        const color = tagColors[b.primaryTag] || 'gray';
        if (b.icon && b.primaryTag) {
          colorizeIcon(b.icon, color, scale, (tintedSrc) => {
            const size = 32 * scale;
            const icon = L.icon({
              iconUrl: tintedSrc,
              iconSize: [size, size],
              iconAnchor: [size / 2, size / 2]
            });
            placeMarker(b, icon);
          });
        } else {
          const icon = L.divIcon({
            className: 'custom-marker',
            iconSize: [16, 16]
          });
          placeMarker(b, icon);
        }
      });
  
      function placeMarker(b, icon) {
        const marker = L.marker([b.y, b.x], { icon, title: b.name }).addTo(map);
        marker.metaTags = b.tags;
        marker.metaData = b;
        marker.on('click', () => showSidebar(b));
        markers.push(marker);
      }
  
      if (EDITOR_MODE) {
        const toggle = document.getElementById('editor-toggle');
        toggle.style.display = 'block';
        let editorEnabled = false;
        toggle.addEventListener('click', () => {
          editorEnabled = !editorEnabled;
          toggle.textContent = editorEnabled ? 'Disable Editor' : 'Enable Editor';
          document.getElementById('map').style.cursor = editorEnabled ? 'crosshair' : 'grab';
  
          if (editorEnabled) {
            map.once('click', e => {
              const x = Math.round(e.latlng.lng);
              const y = Math.round(e.latlng.lat);
              const json = {
                name: "New location",
                x: x,
                y: y,
                  "tags": [
                  "Parking"
                ],
                "primaryTag": "Parking",
                "description": "Description here.",
                "image": "map_recourses/images/image.jpg",
                "icon": "map_recourses/icons/parking.png"
              };
              console.log(JSON.stringify(json, null, 2));
              alert('Marker data copied to console!');
            });
          }
        });
      }
  
      map.on('zoomend', () => {
        const zoom = map.getZoom();
        const scale = getScaleFromZoom(zoom);
  
        markers.forEach(marker => {
          const data = marker.metaData;
          const color = tagColors[data.primaryTag] || 'gray';
  
          if (data.icon && data.primaryTag) {
            colorizeIcon(data.icon, color, scale, (tintedSrc) => {
              const size = 34 * scale;
              const icon = L.icon({
                iconUrl: tintedSrc,
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2]
              });
              marker.setIcon(icon);
            });
          }
        });
      });
    });
  };