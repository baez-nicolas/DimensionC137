export const CHARACTER_STATUS = {
  ALIVE: 'alive',
  DEAD: 'dead',
  UNKNOWN: 'unknown',
} as const;

export const CHARACTER_GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  GENDERLESS: 'genderless',
  UNKNOWN: 'unknown',
} as const;

export const CHARACTER_STATUS_COLORS = {
  [CHARACTER_STATUS.ALIVE]: '#10b981',
  [CHARACTER_STATUS.DEAD]: '#ef4444',
  [CHARACTER_STATUS.UNKNOWN]: '#6b7280',
} as const;

export const CHARACTER_STATUS_LABELS = {
  [CHARACTER_STATUS.ALIVE]: 'Vivo',
  [CHARACTER_STATUS.DEAD]: 'Muerto',
  [CHARACTER_STATUS.UNKNOWN]: 'Desconocido',
} as const;

export const CHARACTER_GENDER_LABELS = {
  [CHARACTER_GENDER.MALE]: 'Masculino',
  [CHARACTER_GENDER.FEMALE]: 'Femenino',
  [CHARACTER_GENDER.GENDERLESS]: 'Sin Género',
  [CHARACTER_GENDER.UNKNOWN]: 'Desconocido',
} as const;

export const CHARACTER_SPECIES = [
  'Human',
  'Alien',
  'Humanoid',
  'Robot',
  'Cronenberg',
  'Disease',
  'Animal',
  'Mythological Creature',
  'Poopybutthole',
] as const;

export type CharacterStatus = (typeof CHARACTER_STATUS)[keyof typeof CHARACTER_STATUS];
export type CharacterGender = (typeof CHARACTER_GENDER)[keyof typeof CHARACTER_GENDER];
export type CharacterSpecies = (typeof CHARACTER_SPECIES)[number];
