import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Character, Location } from '../../models';
import { CharacterService, LocationService } from '../../services';

@Component({
  selector: 'app-location-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './location-detail.component.html',
  styleUrl: './location-detail.component.css',
})
export class LocationDetailComponent implements OnInit {
  private readonly locationService = inject(LocationService);
  private readonly characterService = inject(CharacterService);
  private readonly route = inject(ActivatedRoute);

  location = signal<Location | null>(null);
  residents = signal<Character[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadLocation(id);
    }
  }

  loadLocation(id: number): void {
    this.loading.set(true);
    this.locationService.getById(id).subscribe({
      next: (location) => {
        this.location.set(location);
        this.loadResidents(location.residents);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  loadResidents(residentUrls: string[]): void {
    if (residentUrls.length === 0) {
      this.loading.set(false);
      return;
    }

    const ids = residentUrls.map((url) => Number(url.split('/').pop())).slice(0, 10);

    this.characterService.getMultiple(ids).subscribe({
      next: (characters) => {
        this.residents.set(Array.isArray(characters) ? characters : [characters]);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
