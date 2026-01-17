import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Character } from '../../models';
import { CharacterService } from '../../services';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.css',
})
export class CharacterDetailComponent implements OnInit {
  private readonly characterService = inject(CharacterService);
  private readonly route = inject(ActivatedRoute);

  character = signal<Character | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadCharacter(id);
    }
  }

  loadCharacter(id: number): void {
    this.loading.set(true);
    this.characterService.getById(id).subscribe({
      next: (character) => {
        this.character.set(character);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      Alive: 'badge bg-success',
      Dead: 'badge bg-danger',
      unknown: 'badge bg-secondary',
    };
    return classes[status] || 'badge bg-secondary';
  }

  getEpisodeNumber(url: string): string {
    return url.split('/').pop() || '';
  }
}
