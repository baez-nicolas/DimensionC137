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
    const classes: Record<string, string> = {
      Alive: 'text-success',
      Dead: 'text-danger',
      unknown: 'text-secondary',
    };
    return classes[status] || 'text-secondary';
  }
}
