// Placeholder data for the HUD and in-room chip props.
// Status/stat text is filler for now — real values come later once systems exist.

export const LEVELS = {
  1: {
    areaName: 'ROM Chamber',
    status: 'Intrusion!!!',
    chips: [{ label: 'D23128C ROM', x: 0.5, y: 0.22, color: 'safe' }],
  },
  3: {
    areaName: 'Upper RAM',
    status: 'Memory Leaks!',
    chips: [
      { label: '4116', x: 0.28, y: 0.2, color: 'danger' },
      { label: '4116', x: 0.28, y: 0.34, color: 'danger' },
      { label: '4116', x: 0.28, y: 0.48, color: 'danger' },
      { label: '4116', x: 0.28, y: 0.62, color: 'danger' },
    ],
  },
  5: {
    areaName: 'The Unhinged CPU',
    status: 'Wibble! Jibber!',
    chips: [{ label: 'D780C-1', x: 0.5, y: 0.5, color: 'danger' }],
  },
}

export const HUD_PLACEHOLDER_STATS = {
  lifeforce: '87%',
  laserRegen: '43%',
  healthPickups: 13,
}