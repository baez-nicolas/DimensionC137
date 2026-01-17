export const LOCATION_TYPES = {
  PLANET: 'Planet',
  CLUSTER: 'Cluster',
  SPACE_STATION: 'Space station',
  MICROVERSE: 'Microverse',
  TV: 'TV',
  RESORT: 'Resort',
  FANTASY_TOWN: 'Fantasy town',
  DREAM: 'Dream',
  DIMENSION: 'Dimension',
  UNKNOWN: 'unknown',
} as const;

export const LOCATION_TYPE_ICONS = {
  [LOCATION_TYPES.PLANET]: 'bi-globe2',
  [LOCATION_TYPES.CLUSTER]: 'bi-stars',
  [LOCATION_TYPES.SPACE_STATION]: 'bi-bezier2',
  [LOCATION_TYPES.MICROVERSE]: 'bi-box',
  [LOCATION_TYPES.TV]: 'bi-tv',
  [LOCATION_TYPES.RESORT]: 'bi-building',
  [LOCATION_TYPES.FANTASY_TOWN]: 'bi-shop',
  [LOCATION_TYPES.DREAM]: 'bi-cloud',
  [LOCATION_TYPES.DIMENSION]: 'bi-diagram-3',
  [LOCATION_TYPES.UNKNOWN]: 'bi-question-circle',
} as const;

export const LOCATION_TYPE_COLORS = {
  [LOCATION_TYPES.PLANET]: '#047857',
  [LOCATION_TYPES.CLUSTER]: '#0891b2',
  [LOCATION_TYPES.SPACE_STATION]: '#7c3aed',
  [LOCATION_TYPES.MICROVERSE]: '#dc2626',
  [LOCATION_TYPES.TV]: '#ea580c',
  [LOCATION_TYPES.RESORT]: '#ca8a04',
  [LOCATION_TYPES.FANTASY_TOWN]: '#c026d3',
  [LOCATION_TYPES.DREAM]: '#4f46e5',
  [LOCATION_TYPES.DIMENSION]: '#059669',
  [LOCATION_TYPES.UNKNOWN]: '#6b7280',
} as const;

export const DIMENSION_PREFIXES = [
  'C-137',
  'Dimension',
  'Reality',
  'Replacement',
  'Cronenberg',
  'Fantasy',
  'Post-Apocalyptic',
] as const;

export type LocationType = (typeof LOCATION_TYPES)[keyof typeof LOCATION_TYPES];
export type DimensionPrefix = (typeof DIMENSION_PREFIXES)[number];
