import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiResponse, Character, Episode, Location } from '../../models';
import { CharacterService } from '../../services/character.service';
import { EpisodeService } from '../../services/episode.service';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private characterService = inject(CharacterService);
  private locationService = inject(LocationService);
  private episodeService = inject(EpisodeService);

  featuredCharacters = signal<Character[]>([]);
  featuredLocations = signal<Location[]>([]);
  featuredEpisodes = signal<Episode[]>([]);
  selectedCharacter = signal<Character | null>(null);
  selectedLocation = signal<Location | null>(null);
  selectedEpisode = signal<Episode | null>(null);
  locationResidents = signal<Character[]>([]);
  episodeCharacters = signal<Character[]>([]);
  showCharacterModal = signal(false);
  showLocationModal = signal(false);
  showEpisodeModal = signal(false);
  loadingResidents = signal(false);
  loadingEpisodeCharacters = signal(false);

  ngOnInit(): void {
    this.loadFeaturedCharacters();
    this.loadFeaturedLocations();
    this.loadFeaturedEpisodes();
  }

  private loadFeaturedCharacters(): void {
    this.characterService.getAll(1).subscribe({
      next: (response: ApiResponse<Character>) => {
        const featured = response.results.slice(0, 8);
        this.featuredCharacters.set(featured);
      },
      error: (error: Error) => {
        console.error('Error loading featured characters:', error);
      },
    });
  }

  private loadFeaturedLocations(): void {
    this.locationService.getAll(1).subscribe({
      next: (response: ApiResponse<Location>) => {
        const featured = response.results.slice(0, 8);
        this.featuredLocations.set(featured);
      },
      error: (error: Error) => {
        console.error('Error loading featured locations:', error);
      },
    });
  }

  private loadFeaturedEpisodes(): void {
    this.episodeService.getAll(1).subscribe({
      next: (response: ApiResponse<Episode>) => {
        const featured = response.results.slice(0, 8);
        this.featuredEpisodes.set(featured);
      },
      error: (error: Error) => {
        console.error('Error loading featured episodes:', error);
      },
    });
  }

  openCharacterModal(character: Character): void {
    this.selectedCharacter.set(character);
    this.showCharacterModal.set(true);
    document.body.classList.add('modal-open');
  }

  openLocationModal(location: Location): void {
    this.selectedLocation.set(location);
    this.showLocationModal.set(true);
    document.body.classList.add('modal-open');
    this.loadLocationResidents(location);
  }

  openEpisodeModal(episode: Episode): void {
    this.selectedEpisode.set(episode);
    this.showEpisodeModal.set(true);
    document.body.classList.add('modal-open');
    this.loadEpisodeCharacters(episode);
  }

  closeCharacterModal(): void {
    this.showCharacterModal.set(false);
    this.selectedCharacter.set(null);
    document.body.classList.remove('modal-open');
  }

  closeLocationModal(): void {
    this.showLocationModal.set(false);
    this.selectedLocation.set(null);
    this.locationResidents.set([]);
    document.body.classList.remove('modal-open');
  }

  closeEpisodeModal(): void {
    this.showEpisodeModal.set(false);
    this.selectedEpisode.set(null);
    this.episodeCharacters.set([]);
    document.body.classList.remove('modal-open');
  }

  private loadLocationResidents(location: Location): void {
    if (!location.residents || location.residents.length === 0) {
      this.locationResidents.set([]);
      this.loadingResidents.set(false);
      return;
    }

    this.loadingResidents.set(true);
    const residentIds = location.residents
      .map((url) => {
        const parts = url.split('/');
        return parseInt(parts[parts.length - 1]);
      })
      .slice(0, 20);

    if (residentIds.length === 1) {
      this.characterService.getById(residentIds[0]).subscribe({
        next: (character: Character) => {
          this.locationResidents.set([character]);
          this.loadingResidents.set(false);
        },
        error: (error: Error) => {
          console.error('Error loading residents:', error);
          this.loadingResidents.set(false);
        },
      });
    } else {
      this.characterService.getMultiple(residentIds).subscribe({
        next: (characters: Character[]) => {
          this.locationResidents.set(Array.isArray(characters) ? characters : [characters]);
          this.loadingResidents.set(false);
        },
        error: (error: Error) => {
          console.error('Error loading residents:', error);
          this.loadingResidents.set(false);
        },
      });
    }
  }

  private loadEpisodeCharacters(episode: Episode): void {
    if (!episode.characters || episode.characters.length === 0) {
      this.episodeCharacters.set([]);
      this.loadingEpisodeCharacters.set(false);
      return;
    }

    this.loadingEpisodeCharacters.set(true);
    const characterIds = episode.characters
      .map((url) => {
        const parts = url.split('/');
        return parseInt(parts[parts.length - 1]);
      })
      .slice(0, 20);

    if (characterIds.length === 1) {
      this.characterService.getById(characterIds[0]).subscribe({
        next: (character: Character) => {
          this.episodeCharacters.set([character]);
          this.loadingEpisodeCharacters.set(false);
        },
        error: (error: Error) => {
          console.error('Error loading episode characters:', error);
          this.loadingEpisodeCharacters.set(false);
        },
      });
    } else {
      this.characterService.getMultiple(characterIds).subscribe({
        next: (characters: Character[]) => {
          this.episodeCharacters.set(Array.isArray(characters) ? characters : [characters]);
          this.loadingEpisodeCharacters.set(false);
        },
        error: (error: Error) => {
          console.error('Error loading episode characters:', error);
          this.loadingEpisodeCharacters.set(false);
        },
      });
    }
  }
}
