import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Character, Episode } from '../../models';
import { CharacterService, EpisodeService } from '../../services';

interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './episodes.component.html',
  styleUrl: './episodes.component.css',
})
export class EpisodesComponent implements OnInit, OnDestroy {
  private readonly episodeService = inject(EpisodeService);
  private readonly characterService = inject(CharacterService);

  allEpisodes = signal<Episode[]>([]);
  episodes = signal<Episode[]>([]);
  loading = signal(false);
  searchName = signal('');
  filterSeason = signal('');

  showModal = signal(false);
  selectedEpisode = signal<Episode | null>(null);
  episodeCharacters = signal<Character[]>([]);
  loadingModal = signal(false);
  showScrollButton = signal(false);
  isScrollingUp = signal(false);
  lastScrollTop = signal(0);
  showFilterModal = signal(false);

  seasonOptions = signal<FilterOption[]>([{ label: 'Todas las Temporadas', value: '' }]);

  hasCharacters = computed(() => this.episodeCharacters().length > 0);

  hasActiveFilters = computed(() => {
    return this.searchName() !== '' || this.filterSeason() !== '';
  });

  private scrollHandler = this.handleScroll.bind(this);

  ngOnInit(): void {
    this.loadAllEpisodes();
    window.addEventListener('scroll', this.scrollHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  loadAllEpisodes(): void {
    this.loading.set(true);

    this.episodeService.getAll(1).subscribe({
      next: (firstResponse) => {
        const totalPages = firstResponse.info.pages;
        const requests = [this.episodeService.getAll(1)];

        for (let page = 2; page <= totalPages; page++) {
          requests.push(this.episodeService.getAll(page));
        }

        forkJoin(requests).subscribe({
          next: (responses) => {
            const all: Episode[] = [];
            responses.forEach((r) => all.push(...r.results));
            this.allEpisodes.set(all);
            this.extractSeasonOptions(all);
            this.applyLocalFilters();
            this.loading.set(false);
          },
          error: () => {
            this.allEpisodes.set([]);
            this.episodes.set([]);
            this.loading.set(false);
          },
        });
      },
      error: () => {
        this.allEpisodes.set([]);
        this.episodes.set([]);
        this.loading.set(false);
      },
    });
  }

  extractSeasonOptions(episodes: Episode[]): void {
    const seasons = new Set<string>();
    episodes.forEach((ep) => {
      if (ep.episode) {
        const season = ep.episode.substring(0, 3);
        seasons.add(season);
      }
    });

    const opts: FilterOption[] = [{ label: 'Todas las Temporadas', value: '' }];
    Array.from(seasons)
      .sort()
      .forEach((s) => {
        const num = parseInt(s.substring(1), 10);
        opts.push({ label: `Temporada ${num}`, value: s });
      });
    this.seasonOptions.set(opts);
  }

  private applyLocalFilters(): void {
    let filtered = [...this.allEpisodes()];

    if (this.searchName()) {
      const s = this.searchName().toLowerCase();
      filtered = filtered.filter((ep) => ep.name.toLowerCase().includes(s));
    }
    if (this.filterSeason()) {
      filtered = filtered.filter((ep) => ep.episode.startsWith(this.filterSeason()));
    }

    this.episodes.set(filtered);
  }

  onSearch(name: string): void {
    this.searchName.set(name);
    this.applyLocalFilters();
  }

  onFilterSeason(season: string): void {
    this.filterSeason.set(season);
    this.applyLocalFilters();
  }

  clearFilters(): void {
    this.searchName.set('');
    this.filterSeason.set('');
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

  openEpisodeModal(episode: Episode): void {
    this.selectedEpisode.set(episode);
    this.showModal.set(true);
    document.body.classList.add('modal-open');
    this.loadEpisodeCharacters(episode);
  }

  closeModal(): void {
    this.showModal.set(false);
    document.body.classList.remove('modal-open');
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

  getSeasonLabel(episodeCode: string): string {
    const num = parseInt(episodeCode.substring(1, 3), 10);
    return `T${num}`;
  }

  getEpisodeNumber(episodeCode: string): string {
    return `E${episodeCode.substring(4, 6)}`;
  }

  getCharacterStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      Alive: 'status-alive',
      Dead: 'status-dead',
      unknown: 'status-unknown',
    };
    return statusMap[status] || 'status-unknown';
  }

  getCharacterStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      Alive: 'Vivo',
      Dead: 'Muerto',
      unknown: 'Desconocido',
    };
    return statusMap[status] || 'Desconocido';
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
