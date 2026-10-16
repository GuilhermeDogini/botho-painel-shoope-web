import type { PhotoUploadItem } from './PhotoUploader';

/** Placeholders 3:4 em SVG (Storybook / testes). */
function swatch(label: string, bg: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400"><rect width="300" height="400" fill="${bg}"/><text x="150" y="210" text-anchor="middle" fill="#FAF5EE" font-family="sans-serif" font-size="28" font-weight="700">${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const PHOTO_FIXTURES: PhotoUploadItem[] = [
  { id: 'p1', previewUrl: swatch('1', '#B3134F'), status: 'done', imageId: 'img1' },
  { id: 'p2', previewUrl: swatch('2', '#2F4A9A'), status: 'done', imageId: 'img2' },
  { id: 'p3', previewUrl: swatch('3', '#8FAE94'), status: 'uploading', progress: 55 },
  { id: 'p4', previewUrl: swatch('4', '#E3AE3A'), status: 'error', error: 'falha de rede' },
];
