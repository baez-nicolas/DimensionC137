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
        this.locations.set(response.results);
        this.totalPages.set(response.info.pages);
        this.loading.set(false);
      },
      error: () => {
        this.locations.set([]);
        this.loading.set(false);
      },
    });
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
