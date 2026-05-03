/**
 * Centralized base-tile configuration.
 *
 * We standardize on CartoDB Dark Matter — free, no API key, and visually
 * aligned with the Obsidian Tactical design system (true-black canvas,
 * minimal labelling, lets signal-green / signal-red overlays pop).
 *
 * Switching providers later (e.g. Stadia AlidadeSmoothDark, self-hosted
 * MapTiler) only requires editing this file.
 */

export const BASE_TILE_URL =
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

export const BASE_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · &copy; <a href="https://carto.com/attributions">CARTO</a>';

export const BASE_TILE_MAX_ZOOM = 19;

export const BASE_TILE_SUBDOMAINS = 'abcd';
