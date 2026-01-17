import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Location } from '../../models';
import { LocationService } from '../../services';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.css',
})
export class LocationsComponent implements OnInit {
  private readonly locationService = inject(LocationService);

  locations = signal<Location[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  searchName = signal('');
  filterType = signal('');

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    this.loading.set(true);

    const filters: any = {
      page: this.currentPage(),
    };

    if (this.searchName()) {
      filters.name = this.searchName();
    }
    if (this.filterType()) {
      filters.type = this.filterType();
    }

    this.locationService.filter(filters).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.locations.set(response.results);
          this.totalPages.set(response.info.pages);
          this.loading.set(false);
        }, 1000);
      },
      error: () => {
        setTimeout(() => {
          this.locations.set([]);
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
    this.loadLocations();
  }

  onFilterType(type: string): void {
    this.filterType.set(type);
    this.currentPage.set(1);
    this.loadLocations();
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((page) => page + 1);
      this.loadLocations();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((page) => page - 1);
      this.loadLocations();
    }
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.loadLocations();
  }
}
