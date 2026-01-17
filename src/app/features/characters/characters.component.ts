import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  selectedCharacter = signal<Character | null>(null);
  characterEpisodes = signal<string[]>([]);
  loadingModal = signal(false);
  showModal = signal(false);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  searchName = signal('');
  filterStatus = signal('');
  filterGender = signal('');

  readonly statusOptions: StatusConfig[] = [
    { label: 'Todos los Estados', value: '', cssClass: '' },
    { label: 'Vivo', value: 'alive', cssClass: 'text-success' },
    { label: 'Muerto', value: 'dead', cssClass: 'text-danger' },
    { label: 'Desconocido', value: 'unknown', cssClass: 'text-secondary' },
  ];

  readonly genderOptions: FilterConfig[] = [
    { label: 'Todos los Géneros', value: '' },
    { label: 'Masculino', value: 'male' },
    { label: 'Femenino', value: 'female' },
    { label: 'Sin Género', value: 'genderless' },
    { label: 'Desconocido', value: 'unknown' },
  ];

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.loading.set(true);

    const filters: any = {
      page: this.currentPage(),
    };

    if (this.searchName()) {
      filters.name = this.searchName();
    }
    if (this.filterStatus()) {
      filters.status = this.filterStatus();
    }
    if (this.filterGender()) {
      filters.gender = this.filterGender();
    }

    this.characterService.filter(filters).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.characters.set(response.results);
          this.totalPages.set(response.info.pages);
          this.loading.set(false);
        }, 1000);
      },
      error: () => {
        setTimeout(() => {
          this.characters.set([]);
          this.loading.set(false);
        }, 1000);
      },
    });
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push(-1);
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push(-1);
        pages.push(total);
      }
    }

    return pages;
  }

  onSearch(name: string): void {
    this.searchName.set(name);
    this.currentPage.set(1);
    this.loadCharacters();
  }

  onFilterStatus(status: string): void {
    this.filterStatus.set(status);
    this.currentPage.set(1);
    this.loadCharacters();
  }

  onFilterGender(gender: string): void {
    this.filterGender.set(gender);
    this.currentPage.set(1);
    this.loadCharacters();
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
      this.loadCharacters();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
      this.loadCharacters();
    }
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadCharacters();
  }

  getStatusClass(status: string): string {
    const statusConfig = this.statusOptions.find((s) => s.value === status.toLowerCase());
    return statusConfig?.cssClass || 'text-secondary';
  }

  getStatusLabel(status: string): string {
    const statusConfig = this.statusOptions.find((s) => s.value === status.toLowerCase());
    return statusConfig?.label || status;
  }

  getGenderLabel(gender: string): string {
    const genderConfig = this.genderOptions.find((g) => g.value === gender.toLowerCase());
    return genderConfig?.label || gender;
  }

  getCardClasses(character: Character): string {
    return 'card h-100 hover-card';
  }

  shouldShowEllipsis(page: number): boolean {
    return page === -1;
  }

  isCurrentPage(page: number): boolean {
    return this.currentPage() === page;
  }

  isPaginationDisabled(direction: 'prev' | 'next'): boolean {
    return direction === 'prev'
      ? this.currentPage() === 1
      : this.currentPage() === this.totalPages();
  }

  openCharacterModal(character: Character): void {
    this.selectedCharacter.set(character);
    this.loadingModal.set(true);
    this.characterEpisodes.set([]);
    this.showModal.set(true);

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
    setTimeout(() => {
      this.selectedCharacter.set(null);
      this.characterEpisodes.set([]);
    }, 300);
  }
}
