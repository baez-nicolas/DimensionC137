import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Episode } from '../../models';
import { EpisodeService } from '../../services';

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './episodes.component.html',
  styleUrl: './episodes.component.css',
})
export class EpisodesComponent implements OnInit {
  private readonly episodeService = inject(EpisodeService);

  episodes = signal<Episode[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  searchName = signal('');
  filterEpisode = signal('');

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
        this.episodes.set(response.results);
        this.totalPages.set(response.info.pages);
        this.loading.set(false);
      },
      error: () => {
        this.episodes.set([]);
        this.loading.set(false);
      },
    });
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
}
