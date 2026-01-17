import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Character, Episode } from '../../models';
import { CharacterService, EpisodeService } from '../../services';

@Component({
  selector: 'app-episode-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './episode-detail.component.html',
  styleUrl: './episode-detail.component.css',
})
export class EpisodeDetailComponent implements OnInit {
  private readonly episodeService = inject(EpisodeService);
  private readonly characterService = inject(CharacterService);
  private readonly route = inject(ActivatedRoute);

  episode = signal<Episode | null>(null);
  characters = signal<Character[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadEpisode(id);
    }
  }

  loadEpisode(id: number): void {
    this.loading.set(true);
    this.episodeService.getById(id).subscribe({
      next: (episode) => {
        this.episode.set(episode);
        this.loadCharacters(episode.characters);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  loadCharacters(characterUrls: string[]): void {
    if (characterUrls.length === 0) {
      this.loading.set(false);
      return;
    }

    const ids = characterUrls.map((url) => Number(url.split('/').pop())).slice(0, 12);

    this.characterService.getMultiple(ids).subscribe({
      next: (characters) => {
        this.characters.set(Array.isArray(characters) ? characters : [characters]);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  getSeasonNumber(episode: string): string {
    return episode.substring(1, 3);
  }

  getEpisodeNumber(episode: string): string {
    return episode.substring(4, 6);
  }
}
