export const API_CONFIG = {
  BASE_URL: 'https://rickandmortyapi.com/api',
  ENDPOINTS: {
    CHARACTER: 'character',
    LOCATION: 'location',
    EPISODE: 'episode',
  },
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  ITEMS_PER_PAGE: 20,
  MAX_VISIBLE_PAGES: 7,
  ELLIPSIS_THRESHOLD: 4,
} as const;

export const ANIMATION_CONFIG = {
  MODAL_DELAY: 300,
  HOVER_DURATION: 400,
  TRANSITION_DURATION: 300,
  DEBOUNCE_TIME: 300,
} as const;

export const UI_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 992,
  DESKTOP_BREAKPOINT: 1200,
  MAX_MODAL_WIDTH: 900,
  MAX_MODAL_HEIGHT_VH: 90,
} as const;
