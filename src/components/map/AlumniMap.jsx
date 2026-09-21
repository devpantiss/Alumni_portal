import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MapContainer, TileLayer, GeoJSON, Pane,
  Marker, Tooltip, CircleMarker, useMap, useMapEvents,
} from 'react-leaflet';
import { divIcon, latLngBounds } from 'leaflet';
import { Plus, Minus, LocateFixed, Maximize2, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import 'leaflet/dist/leaflet.css';

/* ─── Constants ─────────────────────────────────────────────────── */
const INDIA  = [[8.4, 68.7], [35.5, 97.25]];
const CENTER = [22.5, 82.5];
const point    = p => [p.lat, p.lng];
const noMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── Tile catalogue ─────────────────────────────────────────────── */
const TILES = {
  /* dark theme */
  dark: {
    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    label: 'Dark',
    attribution: '&copy; <a href="https://stadiamaps.com/attribution/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  /* light theme */
  light: {
    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
    label: 'Light',
    attribution: '&copy; <a href="https://stadiamaps.com/attribution/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  /* extra: toner style (neutral, works in both) */
  toner: {
    url: 'https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png',
    label: 'Toner',
    attribution: '&copy; <a href="https://stadiamaps.com/attribution/">Stadia Maps</a> &copy; <a href="https://stamen.com/">Stamen</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
};

function LocalGeography({ onLoad }) {
  const [geography, setGeography] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${import.meta.env.BASE_URL}countries.geo.json`, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('Geography unavailable');
        return response.json();
      })
      .then(data => { setGeography(data); onLoad(true); })
      .catch(() => {});
    return () => controller.abort();
  }, [onLoad]);
  return geography ? (
    <Pane name="local-geography" style={{ zIndex: 150 }}>
      <GeoJSON data={geography} interactive={false} style={{ className: 'map-local-geography', weight: 1, fillOpacity: 1 }} />
    </Pane>
  ) : null;
}

/* ─── Map behaviour hook ─────────────────────────────────────────── */
function MapBehavior({ selected, resetVersion, onReady }) {
  const map = useMap();
  useEffect(() => { onReady(map); }, [map, onReady]);
  useEffect(() => {
    const obs = new ResizeObserver(() => map.invalidateSize());
    obs.observe(map.getContainer());
    return () => obs.disconnect();
  }, [map]);
  useEffect(() => {
    map.fitBounds(INDIA, { padding: [24, 24], animate: false });
  }, [map, resetVersion]);
  useEffect(() => {
    if (!selected) return;
    const zoom   = Math.max(8, map.getZoom());
    const offset = map.getSize().x > 620 ? 130 : 0;
    const center = map.unproject(map.project(point(selected), zoom).add([offset, 0]), zoom);
    map.flyTo(center, zoom, { animate: !noMotion(), duration: 0.65 });
  }, [map, selected?.id]);
  return null;
}

/* ─── SVG pin builder ────────────────────────────────────────────── */
function makePinIcon(color, shadow, active) {
  const size   = active ? 40 : 32;
  const anchor = [size / 2, size];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 38">
      <defs>
        <filter id="ps${active ? 'a' : 'i'}" x="-40%" y="-30%" width="180%" height="180%">
          <feDropShadow dx="0" dy="4" stdDeviation="${active ? 4 : 3}"
            flood-color="${shadow}" flood-opacity="${active ? 0.7 : 0.5}"/>
        </filter>
      </defs>
      <path d="M16 0C9.37 0 4 5.37 4 12c0 9 12 26 12 26s12-17 12-26c0-6.63-5.37-12-12-12z"
            fill="${color}" filter="url(#ps${active ? 'a' : 'i'})"/>
      <circle cx="16" cy="11.5" r="6.2" fill="white" opacity="0.93"/>
      <circle cx="16" cy="9.6"  r="2.5" fill="${color}"/>
      <path d="M10.2 17.2c0-3.2 2.6-5.8 5.8-5.8s5.8 2.6 5.8 5.8H10.2z" fill="${color}"/>
    </svg>`;
  return divIcon({
    className: active ? 'map-pin-active' : 'map-pin-idle',
    html: svg,
    iconSize:    [size, size],
    iconAnchor:  anchor,
    popupAnchor: [0, -size],
  });
}

/* ─── Markers ────────────────────────────────────────────────────── */
function AlumniMarkers({ people, selected, onSelect, heatmap, isDark }) {
  const map  = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  const mapEvents = useMemo(() => ({ zoomend: () => setZoom(map.getZoom()) }), [map]);
  useMapEvents(mapEvents);

  const groups = useMemo(() => Object.values(
    people.reduce((acc, p) => { (acc[p.state] ??= []).push(p); return acc; }, {})
  ), [people]);

  const clusterMode = zoom < 6 && !selected && !heatmap;
  const clusterCls  = isDark ? 'alumni-cluster-dark' : 'alumni-cluster-light';
  const tooltipCls  = isDark ? 'map-tooltip-dark'    : 'map-tooltip-light';

  if (clusterMode) return groups.map(group => {
    const center = latLngBounds(group.map(point)).getCenter();
    const icon   = divIcon({
      className: clusterCls,
      html: `<span>${group.length}</span>`,
      iconSize: [44, 44], iconAnchor: [22, 22],
    });
    return (
      <Marker
        key={group[0].state}
        position={center}
        icon={icon}
        title={`${group.length} alumni in ${group[0].state}`}
        eventHandlers={{ click: () => map.fitBounds(group.map(point), { padding: [65, 65], maxZoom: 9, animate: !noMotion() }) }}
      >
        <Tooltip direction="top" className={tooltipCls}>
          <strong>{group.length} alumni</strong> · {group[0].state}<br/>Click to explore
        </Tooltip>
      </Marker>
    );
  });

  return people.map(person => {
    const active = selected?.id === person.id;

    if (heatmap) return (
      <CircleMarker
        key={person.id}
        center={point(person)}
        radius={active ? 32 : 22}
        pathOptions={{
          color:       '#df293b',
          stroke:      active,
          weight:      2,
          fillColor:   '#df293b',
          fillOpacity: active ? 0.35 : 0.18,
        }}
        eventHandlers={{ click: () => onSelect(person) }}
      >
        <Tooltip className={tooltipCls}>{person.name} · {person.city}</Tooltip>
      </CircleMarker>
    );

    // pick pin colour by status
    const pinColor  = active          ? '#df293b'
                    : person.online   ? '#16a34a'
                    :                   '#2563eb';
    const pinShadow = active          ? '#dc2626'
                    : person.online   ? '#15803d'
                    :                   '#1d4ed8';
    const icon = makePinIcon(pinColor, pinShadow, active);

    return (
      <Marker
        key={person.id}
        position={point(person)}
        icon={icon}
        zIndexOffset={active ? 1000 : 0}
        eventHandlers={{ click: () => onSelect(person) }}
      >
        <Tooltip direction="top" offset={[0, -(active ? 38 : 32)]} className={tooltipCls}>
          <strong>{person.name}</strong><br/>{person.role}<br/>{person.city}, {person.state}
        </Tooltip>
      </Marker>
    );
  });
}

/* ─── Main Component ─────────────────────────────────────────────── */
function AlumniMap({ people, selected, onSelect, heatmap = false }) {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const wrapper = useRef(null);
  const [map, setMap]               = useState(null);
  const [resetVersion, setReset]    = useState(0);
  const [tileOverride, setOverride] = useState(null); // manual override; null = follow theme
  const [fsError, setFsError]       = useState('');
  const [tileError, setTileError]   = useState(false);
  const [geographyReady, setGeographyReady] = useState(false);
  const [showTileMenu, setTileMenu] = useState(false);
  const onReady = useCallback(m => setMap(m), []);

  /* Reset manual override whenever the global theme flips */
  useEffect(() => { setOverride(null); }, [theme]);

  const tileKey  = tileOverride ?? (isDark ? 'dark' : 'light');
  const tile     = TILES[tileKey];
  const wrapCls  = `map-canvas ${isDark ? 'alumni-dark-map' : 'alumni-light-map'}`;

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (wrapper.current?.requestFullscreen) await wrapper.current.requestFullscreen();
      else setFsError('Fullscreen unavailable in this browser.');
    } catch { setFsError('Fullscreen unavailable in this browser.'); }
  }

  return (
    <div className={wrapCls} ref={wrapper}>
      <MapContainer
        center={CENTER}
        zoom={5}
        minZoom={4}
        maxZoom={18}
        zoomControl={false}
        scrollWheelZoom
        keyboard
        attributionControl
        className="alumni-leaflet-map"
      >
        <MapBehavior selected={selected} resetVersion={resetVersion} onReady={onReady} />
        <LocalGeography onLoad={setGeographyReady} />

        <TileLayer
          key={tileKey}
          url={tile.url}
          attribution={tile.attribution}
          maxZoom={20}
          eventHandlers={{
            tileerror: () => setTileError(true),
            tileload:  () => setTileError(false),
          }}
        />

        <AlumniMarkers
          people={people}
          selected={selected}
          onSelect={onSelect}
          heatmap={heatmap}
          isDark={isDark}
        />
      </MapContainer>

      {/* ── HUD Overlays ── */}
      <div className="map-top-badge">
        <span className="live-dot" />
        INDIA NETWORK
        <span>·</span>
        {people.length} professionals
      </div>

      {/* Tile switcher */}
      <div className="map-tile-switcher">
        <button
          aria-label="Switch map style"
          className={showTileMenu ? 'active' : ''}
          onClick={() => setTileMenu(v => !v)}
        >
          <Layers size={16} />
        </button>
        {showTileMenu && (
          <div className="tile-menu">
            {Object.entries(TILES).map(([k, t]) => (
              <button
                key={k}
                className={tileKey === k ? 'active' : ''}
                onClick={() => { setOverride(k); setTileMenu(false); }}
              >
                {t.label}
                {tileOverride === null && ((isDark && k === 'dark') || (!isDark && k === 'light')) && (
                  <span className="tile-auto-badge">auto</span>
                )}
              </button>
            ))}
            {tileOverride !== null && (
              <button className="tile-reset" onClick={() => { setOverride(null); setTileMenu(false); }}>
                ↩ Follow theme
              </button>
            )}
          </div>
        )}
      </div>

      {/* Zoom / pan controls */}
      <div className="map-controls">
        <button aria-label="Zoom in"      onClick={() => map?.zoomIn()}>  <Plus      size={17} /></button>
        <button aria-label="Zoom out"     onClick={() => map?.zoomOut()}> <Minus     size={17} /></button>
        <button aria-label="Recenter map" onClick={() => { onSelect(null); setReset(v => v + 1); }}><LocateFixed size={17} /></button>
        <button aria-label="Fullscreen"   onClick={toggleFullscreen}>     <Maximize2 size={16} /></button>
      </div>

      {/* Legend */}
      <div className="map-legend">
        <span><i className="map-dot online"   />Online</span>
        <span><i className="map-dot offline"  />Offline</span>
        <span><i className="map-dot selected" />Selected</span>
      </div>

      <div className="map-interaction-note">
        {fsError || (tileError
          ? `Map tiles unavailable · ${geographyReady ? 'Showing local geography' : 'Showing alumni locations'}`
          : 'Drag to pan · Scroll to zoom · Demo locations')}
      </div>
    </div>
  );
}

export default memo(AlumniMap);
