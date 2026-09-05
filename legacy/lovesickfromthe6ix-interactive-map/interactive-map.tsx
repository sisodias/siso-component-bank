import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polygon,
  Polyline,
  useMap,
  useMapEvents
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color = 'blue', size = 'medium') => {
  const sizes = {
    small: [20, 32],
    medium: [25, 41],
    large: [30, 50]
  };
  
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: sizes[size],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Map event handler component
const MapEvents = ({ onMapClick, onLocationFound }) => {
  const map = useMapEvents({
    click: (e) => {
      onMapClick && onMapClick(e.latlng);
    },
    locationfound: (e) => {
      onLocationFound && onLocationFound(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return null;
};

// Custom control component
const CustomControls = ({ onLocate, onToggleLayer, layers }) => {
  const map = useMap();

  useEffect(() => {
    const control = L.control({ position: 'topright' });
    
    control.onAdd = () => {
      const div = L.DomUtil.create('div', 'custom-controls');
      div.innerHTML = `
        <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
          <button id="locate-btn" style="margin: 2px; padding: 8px; border: none; border-radius: 3px; cursor: pointer;">📍 Locate Me</button>
          <button id="satellite-btn" style="margin: 2px; padding: 8px; border: none; border-radius: 3px; cursor: pointer;">🛰️ Satellite</button>
          <button id="traffic-btn" style="margin: 2px; padding: 8px; border: none; border-radius: 3px; cursor: pointer;">🚦 Traffic</button>
        </div>
      `;
      
      L.DomEvent.disableClickPropagation(div);
      
      const locateBtn = div.querySelector('#locate-btn');
      const satelliteBtn = div.querySelector('#satellite-btn');
      const trafficBtn = div.querySelector('#traffic-btn');
      
      locateBtn.onclick = () => onLocate();
      satelliteBtn.onclick = () => onToggleLayer('satellite');
      trafficBtn.onclick = () => onToggleLayer('traffic');
      
      return div;
    };

    control.addTo(map);

    return () => {
      control.remove();
    };
  }, [map, onLocate, onToggleLayer]);

  return null;
};

// Search component
const SearchControl = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const map = useMap();

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      // Using Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const results = await response.json();
      
      if (results.length > 0) {
        const { lat, lon, display_name } = results[0];
        const latLng = [parseFloat(lat), parseFloat(lon)];
        map.flyTo(latLng, 13);
        onSearch && onSearch({ latLng, name: display_name });
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  useEffect(() => {
    const control = L.control({ position: 'topleft' });
    
    control.onAdd = () => {
      const div = L.DomUtil.create('div', 'search-control');
      div.innerHTML = `
        <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); display: flex; gap: 5px;">
          <input 
            id="search-input" 
            type="text" 
            placeholder="Search places..." 
            style="padding: 8px; border: 1px solid #ddd; border-radius: 3px; width: 200px;"
          />
          <button 
            id="search-btn" 
            style="padding: 8px 12px; border: none; border-radius: 3px; cursor: pointer; background: #007bff; color: white;"
          >
            🔍
          </button>
        </div>
      `;
      
      L.DomEvent.disableClickPropagation(div);
      
      const input = div.querySelector('#search-input');
      const button = div.querySelector('#search-btn');
      
      input.addEventListener('input', (e) => setQuery(e.target.value));
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
      });
      button.addEventListener('click', handleSearch);
      
      return div;
    };

    control.addTo(map);

    return () => {
      control.remove();
    };
  }, [map]);

  return null;
};

// Main AdvancedMap component
export const AdvancedMap = ({
  center = [51.505, -0.09],
  zoom = 13,
  markers = [],
  polygons = [],
  circles = [],
  polylines = [],
  onMarkerClick,
  onMapClick,
  enableClustering = true,
  enableSearch = true,
  enableControls = true,
  enableDrawing = false,
  mapLayers = {
    openstreetmap: true,
    satellite: false,
    traffic: false
  },
  className = '',
  style = { height: '500px', width: '100%' }
}) => {
  const [currentLayers, setCurrentLayers] = useState(mapLayers);
  const [userLocation, setUserLocation] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [clickedLocation, setClickedLocation] = useState(null);

  // Handle layer toggling
  const handleToggleLayer = useCallback((layerType) => {
    setCurrentLayers(prev => ({
      ...prev,
      [layerType]: !prev[layerType]
    }));
  }, []);

  // Handle geolocation
  const handleLocate = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);

  // Handle map click
  const handleMapClick = useCallback((latlng) => {
    setClickedLocation(latlng);
    onMapClick && onMapClick(latlng);
  }, [onMapClick]);

  // Handle search results
  const handleSearch = useCallback((result) => {
    setSearchResult(result);
  }, []);

  return (
    <div className={`advanced-map ${className}`} style={style}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        {/* Base tile layers */}
        {currentLayers.openstreetmap && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}
        
        {currentLayers.satellite && (
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}

        {/* Map events */}
        <MapEvents
          onMapClick={handleMapClick}
          onLocationFound={setUserLocation}
        />

        {/* Search control */}
        {enableSearch && <SearchControl onSearch={handleSearch} />}

        {/* Custom controls */}
        {enableControls && (
          <CustomControls
            onLocate={handleLocate}
            onToggleLayer={handleToggleLayer}
            layers={currentLayers}
          />
        )}

        {/* Markers with clustering */}
        {enableClustering ? (
          <MarkerClusterGroup>
            {markers.map((marker, index) => (
              <Marker
                key={marker.id || index}
                position={marker.position}
                icon={marker.icon || createCustomIcon(marker.color, marker.size)}
                eventHandlers={{
                  click: () => onMarkerClick && onMarkerClick(marker)
                }}
              >
                {marker.popup && (
                  <Popup>
                    <div>
                      <h3>{marker.popup.title}</h3>
                      <p>{marker.popup.content}</p>
                      {marker.popup.image && (
                        <img 
                          src={marker.popup.image} 
                          alt={marker.popup.title}
                          style={{ maxWidth: '200px', height: 'auto' }}
                        />
                      )}
                    </div>
                  </Popup>
                )}
              </Marker>
            ))}
          </MarkerClusterGroup>
        ) : (
          markers.map((marker, index) => (
            <Marker
              key={marker.id || index}
              position={marker.position}
              icon={marker.icon || createCustomIcon(marker.color, marker.size)}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(marker)
              }}
            >
              {marker.popup && (
                <Popup>
                  <div>
                    <h3>{marker.popup.title}</h3>
                    <p>{marker.popup.content}</p>
                  </div>
                </Popup>
              )}
            </Marker>
          ))
        )}

        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={userLocation}
            icon={createCustomIcon('red', 'medium')}
          >
            <Popup>Your current location</Popup>
          </Marker>
        )}

        {/* Search result marker */}
        {searchResult && (
          <Marker 
            position={searchResult.latLng}
            icon={createCustomIcon('green', 'large')}
          >
            <Popup>{searchResult.name}</Popup>
          </Marker>
        )}

        {/* Clicked location marker */}
        {clickedLocation && (
          <Marker 
            position={[clickedLocation.lat, clickedLocation.lng]}
            icon={createCustomIcon('orange', 'small')}
          >
            <Popup>
              Lat: {clickedLocation.lat.toFixed(6)}<br/>
              Lng: {clickedLocation.lng.toFixed(6)}
            </Popup>
          </Marker>
        )}

        {/* Polygons */}
        {polygons.map((polygon, index) => (
          <Polygon
            key={polygon.id || index}
            positions={polygon.positions}
            pathOptions={polygon.style || { color: 'purple', weight: 2, fillOpacity: 0.3 }}
          >
            {polygon.popup && <Popup>{polygon.popup}</Popup>}
          </Polygon>
        ))}

        {/* Circles */}
        {circles.map((circle, index) => (
          <Circle
            key={circle.id || index}
            center={circle.center}
            radius={circle.radius}
            pathOptions={circle.style || { color: 'blue', weight: 2, fillOpacity: 0.2 }}
          >
            {circle.popup && <Popup>{circle.popup}</Popup>}
          </Circle>
        ))}

        {/* Polylines */}
        {polylines.map((polyline, index) => (
          <Polyline
            key={polyline.id || index}
            positions={polyline.positions}
            pathOptions={polyline.style || { color: 'red', weight: 3 }}
          >
            {polyline.popup && <Popup>{polyline.popup}</Popup>}
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
};