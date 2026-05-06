import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Character, Episode } from '../../models';
import { CharacterService, EpisodeService } from '../../services';

interface FilterConfig {
  label: string;
  value: string;
}

interface StatusConfig extends FilterConfig {
  cssClass: string;
}

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.css',
})
export class CharactersComponent implements OnInit {
  private readonly characterService = inject(CharacterService);
  private readonly episodeService = inject(EpisodeService);

  characters = signal<Character[]>([]);
  allCharacters = signal<Character[]>([]);
  selectedCharacter = signal<Character | null>(null);
  characterEpisodes = signal<string[]>([]);
  loadingModal = signal(false);
  showModal = signal(false);
  loading = signal(false);
  searchName = signal('');
  filterStatus = signal('');
  filterGender = signal('');
  filterSpecies = signal('');
  filterLocation = signal('');
  showScrollButton = signal(false);
  isScrollingUp = signal(false);
  lastScrollTop = signal(0);
  showFilterModal = signal(false);

  statusOptions = signal<StatusConfig[]>([{ label: 'Todos los Estados', value: '', cssClass: '' }]);
  genderOptions = signal<FilterConfig[]>([{ label: 'Todos los Géneros', value: '' }]);
  speciesOptions = signal<FilterConfig[]>([{ label: 'Todas las Especies', value: '' }]);
  locationOptions = signal<FilterConfig[]>([{ label: 'Todas las Locaciones', value: '' }]);

  hasActiveFilters = computed(() => {
    return (
      this.searchName() !== '' ||
      this.filterStatus() !== '' ||
      this.filterGender() !== '' ||
      this.filterSpecies() !== '' ||
      this.filterLocation() !== ''
    );
  });

  ngOnInit(): void {
    this.loadAllCharacters();
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  loadAllCharacters(): void {
    this.loading.set(true);

    this.characterService.getAll(1).subscribe({
      next: (firstResponse) => {
        const totalPages = Math.min(firstResponse.info.pages, 50);
        const requests = [];

        requests.push(this.characterService.getAll(1));

        for (let page = 2; page <= totalPages; page++) {
          requests.push(this.characterService.getAll(page));
        }

        forkJoin(requests).subscribe({
          next: (responses) => {
            const allChars: Character[] = [];
            responses.forEach((response) => {
              allChars.push(...response.results);
            });

            this.allCharacters.set(allChars);
            this.extractFilterOptions(allChars);
            this.applyLocalFilters();
            this.loading.set(false);
          },
          error: () => {
            this.allCharacters.set([]);
            this.characters.set([]);
            this.loading.set(false);
          },
        });
      },
      error: () => {
        this.allCharacters.set([]);
        this.characters.set([]);
        this.loading.set(false);
      },
    });
  }

  extractFilterOptions(characters: Character[]): void {
    const statuses = new Set<string>();
    const genders = new Set<string>();
    const species = new Set<string>();
    const locations = new Set<string>();

    characters.forEach((char) => {
      if (char.status) statuses.add(char.status);
      if (char.gender) genders.add(char.gender);
      if (char.species) species.add(char.species);
      if (char.location.name) locations.add(char.location.name);
    });

    const statusOpts: StatusConfig[] = [{ label: 'Todos los Estados', value: '', cssClass: '' }];
    statuses.forEach((status) => {
      statusOpts.push({
        label: this.translateStatus(status),
        value: status.toLowerCase(),
        cssClass: this.getStatusClass(status),
      });
    });
    this.statusOptions.set(statusOpts);

    const genderOpts: FilterConfig[] = [{ label: 'Todos los Géneros', value: '' }];
    genders.forEach((gender) => {
      genderOpts.push({
        label: this.translateGender(gender),
        value: gender.toLowerCase(),
      });
    });
    this.genderOptions.set(genderOpts);

    const speciesOpts: FilterConfig[] = [{ label: 'Todas las Especies', value: '' }];
    Array.from(species)
      .sort()
      .forEach((sp) => {
        speciesOpts.push({ label: sp, value: sp });
      });
    this.speciesOptions.set(speciesOpts);

    const locationOpts: FilterConfig[] = [{ label: 'Todas las Locaciones', value: '' }];
    Array.from(locations)
      .sort()
      .forEach((loc) => {
        locationOpts.push({ label: loc, value: loc });
      });
    this.locationOptions.set(locationOpts);
  }

  translateStatus(status: string): string {
    const map: { [key: string]: string } = {
      Alive: 'Vivo',
      Dead: 'Muerto',
      unknown: 'Desconocido',
    };
    return map[status] || status;
  }

  translateGender(gender: string): string {
    const map: { [key: string]: string } = {
      Male: 'Masculino',
      Female: 'Femenino',
      Genderless: 'Sin Género',
      unknown: 'Desconocido',
    };
    return map[gender] || gender;
  }

  onSearch(name: string): void {
    this.searchName.set(name);
    this.applyLocalFilters();
  }

  onFilterStatus(status: string): void {
    this.filterStatus.set(status);
    this.applyLocalFilters();
  }

  onFilterGender(gender: string): void {
    this.filterGender.set(gender);
    this.applyLocalFilters();
  }

  onFilterSpecies(species: string): void {
    this.filterSpecies.set(species);
    this.applyLocalFilters();
  }

  onFilterLocation(location: string): void {
    this.filterLocation.set(location);
    this.applyLocalFilters();
  }

  clearFilters(): void {
    this.searchName.set('');
    this.filterStatus.set('');
    this.filterGender.set('');
    this.filterSpecies.set('');
    this.filterLocation.set('');
    this.applyLocalFilters();
  }

  openFilterModal(): void {
    this.showFilterModal.set(true);
    document.body.classList.add('modal-open');
  }

  closeFilterModal(): void {
    this.showFilterModal.set(false);
    document.body.classList.remove('modal-open');
  }

  applyFiltersAndClose(): void {
    this.closeFilterModal();
  }

  private applyLocalFilters(): void {
    let filtered = [...this.allCharacters()];

    if (this.searchName()) {
      const searchLower = this.searchName().toLowerCase();
      filtered = filtered.filter((char) => char.name.toLowerCase().includes(searchLower));
    }

    if (this.filterStatus()) {
      filtered = filtered.filter((char) => char.status.toLowerCase() === this.filterStatus());
    }

    if (this.filterGender()) {
      filtered = filtered.filter((char) => char.gender.toLowerCase() === this.filterGender());
    }

    if (this.filterSpecies()) {
      filtered = filtered.filter((char) => char.species === this.filterSpecies());
    }

    if (this.filterLocation()) {
      filtered = filtered.filter((char) => char.location.name === this.filterLocation());
    }

    this.characters.set(filtered);
  }

  getStatusClass(status: string): string {
    const statusConfig = this.statusOptions().find((s) => s.value === status.toLowerCase());
    return statusConfig?.cssClass || 'text-secondary';
  }

  getStatusLabel(status: string): string {
    const statusConfig = this.statusOptions().find((s) => s.value === status.toLowerCase());
    return statusConfig?.label || status;
  }

  getGenderLabel(gender: string): string {
    const genderConfig = this.genderOptions().find((g) => g.value === gender.toLowerCase());
    return genderConfig?.label || gender;
  }

  getCardClasses(character: Character): string {
    return 'card h-100 hover-card';
  }

  openCharacterModal(character: Character): void {
    this.selectedCharacter.set(character);
    this.loadingModal.set(true);
    this.characterEpisodes.set([]);
    this.showModal.set(true);
    document.body.classList.add('modal-open');

    const episodeIds = character.episode.map((url) => {
      const parts = url.split('/');
      return parseInt(parts[parts.length - 1], 10);
    });

    if (episodeIds.length > 0) {
      this.episodeService.getMultiple(episodeIds).subscribe({
        next: (episodes: Episode | Episode[]) => {
          const episodeNames = Array.isArray(episodes)
            ? episodes.map((ep) => `${ep.episode} - ${ep.name}`)
            : [`${episodes.episode} - ${episodes.name}`];
          this.characterEpisodes.set(episodeNames);
          this.loadingModal.set(false);
        },
        error: () => {
          this.loadingModal.set(false);
        },
      });
    } else {
      this.loadingModal.set(false);
    }
  }

  closeModal(): void {
    this.showModal.set(false);
    document.body.classList.remove('modal-open');
    setTimeout(() => {
      this.selectedCharacter.set(null);
      this.characterEpisodes.set([]);
    }, 300);
  }

  handleScroll(): void {
    const scrollTop = window.scrollY;
    const lastScroll = this.lastScrollTop();

    this.showScrollButton.set(scrollTop > 300);

    if (scrollTop > lastScroll) {
      this.isScrollingUp.set(false);
    } else if (scrollTop < lastScroll) {
      this.isScrollingUp.set(true);
    }

    this.lastScrollTop.set(scrollTop);
  }

  scrollToPosition(): void {
    if (this.isScrollingUp()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  }
}
