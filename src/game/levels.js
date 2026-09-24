export const LEVELS = {
  1: {
    areaName: 'ROM Chamber',
    status: 'Intrusion!!!',
    chips: [{ label: 'D23128C ROM', x: 0.5, y: 0.22, colour: 'safe' }],
  },
  2: {
    areaName: 'Address Bus',
    status: 'Contention Rising...',
    chips: [],
  },
  3: {
    areaName: 'Status Register',
    status: 'Register Corruption!',
    chips: [
      { label: '4116', x: 0.28, y: 0.2, colour: 'danger' },
      { label: '4116', x: 0.28, y: 0.34, colour: 'danger' },
      { label: '4116', x: 0.28, y: 0.48, colour: 'danger' },
      { label: '4116', x: 0.28, y: 0.62, colour: 'danger' },
    ],
  },
  4: {
    areaName: 'Intrusion',
    status: 'System Breach!!!',
    chips: [],
  },
  5: {
    areaName: 'The Unhinged CPU',
    status: 'Woof!!! Baa!',
    chips: [],
  },
}

export const HUD_PLACEHOLDER_STATS = {
  lifeforce: '87%',
  laserRegen: '43%',
  healthPickups: 13,
}

