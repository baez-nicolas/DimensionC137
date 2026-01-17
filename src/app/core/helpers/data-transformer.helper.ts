import { Character } from '../../models/character.model';
import { Episode } from '../../models/episode.model';
import { Location } from '../../models/location.model';

export class DataTransformer {
  static extractEpisodeNumbers(character: Character): string[] {
    return character.episode.map((url) => {
      const parts = url.split('/');
      const episodeId = parts[parts.length - 1];
      return `Episodio ${episodeId}`;
    });
  }

  static extractCharacterIds(location: Location): number[] {
    return location.residents.map((url) => {
      const parts = url.split('/');
      return parseInt(parts[parts.length - 1], 10);
    });
  }

  static extractSeasonFromEpisode(episodeCode: string): number {
    const match = episodeCode.match(/S(\d{2})/);
    return match ? parseInt(match[1], 10) : 0;
  }

  static extractEpisodeFromCode(episodeCode: string): number {
    const match = episodeCode.match(/E(\d{2})/);
    return match ? parseInt(match[1], 10) : 0;
  }

  static formatEpisodeCode(season: number, episode: number): string {
    const s = season.toString().padStart(2, '0');
    const e = episode.toString().padStart(2, '0');
    return `S${s}E${e}`;
  }

  static characterToSummary(character: Character) {
    return {
      id: character.id,
      name: character.name,
      status: character.status,
      species: character.species,
      image: character.image,
      episodeCount: character.episode.length,
    };
  }

  static locationToSummary(location: Location) {
    return {
      id: location.id,
      name: location.name,
      type: location.type,
      dimension: location.dimension,
      residentCount: location.residents.length,
    };
  }

  static episodeToSummary(episode: Episode) {
    return {
      id: episode.id,
      name: episode.name,
      episode: episode.episode,
      airDate: episode.air_date,
      characterCount: episode.characters.length,
      season: this.extractSeasonFromEpisode(episode.episode),
    };
  }

  static groupCharactersByStatus(characters: Character[]) {
    return characters.reduce(
      (groups, character) => {
        const status = character.status;
        if (!groups[status]) {
          groups[status] = [];
        }
        groups[status].push(character);
        return groups;
      },
      {} as Record<string, Character[]>,
    );
  }

  static groupLocationsByType(locations: Location[]) {
    return locations.reduce(
      (groups, location) => {
        const type = location.type;
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type].push(location);
        return groups;
      },
      {} as Record<string, Location[]>,
    );
  }

  static groupEpisodesBySeason(episodes: Episode[]) {
    return episodes.reduce(
      (groups, episode) => {
        const season = this.extractSeasonFromEpisode(episode.episode);
        if (!groups[season]) {
          groups[season] = [];
        }
        groups[season].push(episode);
        return groups;
      },
      {} as Record<number, Episode[]>,
    );
  }

  static calculateStatistics(characters: Character[]) {
    const total = characters.length;
    const alive = characters.filter((c) => c.status === 'Alive').length;
    const dead = characters.filter((c) => c.status === 'Dead').length;
    const unknown = characters.filter((c) => c.status === 'unknown').length;

    return {
      total,
      alive,
      dead,
      unknown,
      alivePercentage: ((alive / total) * 100).toFixed(1),
      deadPercentage: ((dead / total) * 100).toFixed(1),
      unknownPercentage: ((unknown / total) * 100).toFixed(1),
    };
  }

  static sortCharactersByName(characters: Character[], order: 'asc' | 'desc' = 'asc'): Character[] {
    return [...characters].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return order === 'asc' ? comparison : -comparison;
    });
  }

  static sortLocationsByResidents(
    locations: Location[],
    order: 'asc' | 'desc' = 'desc',
  ): Location[] {
    return [...locations].sort((a, b) => {
      const comparison = a.residents.length - b.residents.length;
      return order === 'asc' ? comparison : -comparison;
    });
  }

  static sortEpisodesByDate(episodes: Episode[], order: 'asc' | 'desc' = 'asc'): Episode[] {
    return [...episodes].sort((a, b) => {
      const dateA = new Date(a.air_date).getTime();
      const dateB = new Date(b.air_date).getTime();
      const comparison = dateA - dateB;
      return order === 'asc' ? comparison : -comparison;
    });
  }

  static filterFeaturedCharacters(characters: Character[], minEpisodes: number = 10): Character[] {
    return characters.filter((c) => c.episode.length >= minEpisodes);
  }

  static findMostPopularLocation(locations: Location[]): Location | null {
    if (locations.length === 0) return null;
    return locations.reduce((max, loc) =>
      loc.residents.length > max.residents.length ? loc : max,
    );
  }

  static findLatestEpisode(episodes: Episode[]): Episode | null {
    if (episodes.length === 0) return null;
    return episodes.reduce((latest, ep) => {
      const latestDate = new Date(latest.air_date).getTime();
      const epDate = new Date(ep.air_date).getTime();
      return epDate > latestDate ? ep : latest;
    });
  }

  static getUniqueSpecies(characters: Character[]): string[] {
    const species = characters.map((c) => c.species);
    return [...new Set(species)].sort();
  }

  static getUniqueLocationsTypes(locations: Location[]): string[] {
    const types = locations.map((l) => l.type);
    return [...new Set(types)].sort();
  }

  static getUniqueDimensions(locations: Location[]): string[] {
    const dimensions = locations.map((l) => l.dimension).filter((d) => d && d !== 'unknown');
    return [...new Set(dimensions)].sort();
  }
}
