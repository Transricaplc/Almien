/**
 * Lightweight helpers to open Google Maps for a place name or directions.
 * Used by SAPS/Hospital "Navigate" buttons across the app.
 */

export function openInMaps(name: string, city = 'Cape Town') {
  const query = encodeURIComponent(`${name}, ${city}, South Africa`);
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${query}`,
    '_blank',
    'noopener'
  );
}

export function openDirectionsTo(name: string, city = 'Cape Town') {
  const query = encodeURIComponent(`${name}, ${city}, South Africa`);
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination=${query}`,
    '_blank',
    'noopener'
  );
}
