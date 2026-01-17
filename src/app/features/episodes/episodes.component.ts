import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Character, Episode } from '../../models';
import { CharacterService, EpisodeService } from '../../services';

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './episodes.component.html',
  styleUrl: './episodes.component.css',
})
export class EpisodesComponent implements OnInit {
  private readonly episodeService = inject(EpisodeService);
  private readonly characterService = inject(CharacterService);

  episodes = signal<Episode[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  searchName = signal('');
  filterEpisode = signal('');

  showModal = signal(false);
  selectedEpisode = signal<Episode | null>(null);
  episodeCharacters = signal<Character[]>([]);
  loadingModal = signal(false);

  hasCharacters = computed(() => this.episodeCharacters().length > 0);

  ngOnInit(): void {
    this.loadEpisodes();
  }

  loadEpisodes(): void {
    this.loading.set(true);

    const filters: any = {
      page: this.currentPage(),
    };

    if (this.searchName()) {
      filters.name = this.searchName();
    }
    if (this.filterEpisode()) {
      filters.episode = this.filterEpisode();
    }

    this.episodeService.filter(filters).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.episodes.set(response.results);
          this.totalPages.set(response.info.pages);
          this.loading.set(false);
        }, 1000);
      },
      error: () => {
        setTimeout(() => {
          this.episodes.set([]);
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
    this.loadEpisodes();
  }

  onFilterEpisode(episode: string): void {
    this.filterEpisode.set(episode);
    this.currentPage.set(1);
    this.loadEpisodes();
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
      this.loadEpisodes();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
      this.loadEpisodes();
    }
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadEpisodes();
  }

  getSeasonNumber(episode: string): string {
    return episode.substring(1, 3);
  }

  getEpisodeNumber(episode: string): string {
    return episode.substring(4, 6);
  }

  isCurrentPage(page: number): boolean {
    return this.currentPage() === page;
  }

  isPaginationDisabled(direction: 'prev' | 'next'): boolean {
    if (direction === 'prev') return this.currentPage() === 1;
    return this.currentPage() === this.totalPages();
  }

  shouldShowEllipsis(pages: number[], index: number): boolean {
    return pages[index] === -1;
  }

  openEpisodeModal(episode: Episode): void {
    this.selectedEpisode.set(episode);
    this.showModal.set(true);
    this.loadEpisodeCharacters(episode);
  }

  closeModal(): void {
    this.showModal.set(false);
    setTimeout(() => {
      this.selectedEpisode.set(null);
      this.episodeCharacters.set([]);
    }, 300);
  }

  loadEpisodeCharacters(episode: Episode): void {
    if (episode.characters.length === 0) {
      this.episodeCharacters.set([]);
      return;
    }

    this.loadingModal.set(true);
    const characterIds = episode.characters.map((url) => {
      const parts = url.split('/');
      return parseInt(parts[parts.length - 1], 10);
    });

    this.characterService.getMultiple(characterIds).subscribe({
      next: (characters) => {
        this.episodeCharacters.set(Array.isArray(characters) ? characters : [characters]);
        this.loadingModal.set(false);
      },
      error: () => {
        this.episodeCharacters.set([]);
        this.loadingModal.set(false);
      },
    });
  }

  getCharacterStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'alive':
        return 'status-alive';
      case 'dead':
        return 'status-dead';
      default:
        return 'status-unknown';
    }
  }

  getCharacterStatusLabel(status: string): string {
    switch (status.toLowerCase()) {
      case 'alive':
        return 'Vivo';
      case 'dead':
        return 'Muerto';
      default:
        return 'Desconocido';
    }
  }
}
