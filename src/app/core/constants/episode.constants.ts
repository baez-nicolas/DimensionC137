export const EPISODE_SEASONS = {
  SEASON_1: 'S01',
  SEASON_2: 'S02',
  SEASON_3: 'S03',
  SEASON_4: 'S04',
  SEASON_5: 'S05',
  SEASON_6: 'S06',
  SEASON_7: 'S07',
} as const;

export const EPISODE_SEASON_NAMES = {
  [EPISODE_SEASONS.SEASON_1]: 'Temporada 1',
  [EPISODE_SEASONS.SEASON_2]: 'Temporada 2',
  [EPISODE_SEASONS.SEASON_3]: 'Temporada 3',
  [EPISODE_SEASONS.SEASON_4]: 'Temporada 4',
  [EPISODE_SEASONS.SEASON_5]: 'Temporada 5',
  [EPISODE_SEASONS.SEASON_6]: 'Temporada 6',
  [EPISODE_SEASONS.SEASON_7]: 'Temporada 7',
} as const;

export const EPISODE_COLORS = {
  PRIMARY: '#fbbf24',
  SECONDARY: '#f59e0b',
  TERTIARY: '#d97706',
  GRADIENT_START: 'rgba(251, 191, 36, 0.05)',
  GRADIENT_END: 'rgba(245, 158, 11, 0.05)',
} as const;

export const EPISODE_RANGES = {
  MIN_SEASON: 1,
  MAX_SEASON: 7,
  EPISODES_PER_SEASON: {
    1: 11,
    2: 10,
    3: 10,
    4: 10,
    5: 10,
    6: 10,
    7: 10,
  },
} as const;

export type EpisodeSeason = (typeof EPISODE_SEASONS)[keyof typeof EPISODE_SEASONS];
export type SeasonNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
