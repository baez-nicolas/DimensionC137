import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Character } from '../../models';
import { CharacterService } from '../../services';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.css',
})
export class CharactersComponent implements OnInit {
  private readonly characterService = inject(CharacterService);

  characters = signal<Character[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  searchName = signal('');
  filterStatus = signal('');
  filterGender = signal('');

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
        this.characters.set(response.results);
        this.totalPages.set(response.info.pages);
        this.loading.set(false);
      },
      error: () => {
        this.characters.set([]);
        this.loading.set(false);
      },
    });
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
    const classes: Record<string, string> = {
      Alive: 'text-success',
      Dead: 'text-danger',
      unknown: 'text-secondary',
    };
    return classes[status] || 'text-secondary';
  }
}
