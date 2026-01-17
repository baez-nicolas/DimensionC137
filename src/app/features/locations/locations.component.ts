import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Character, Location } from '../../models';
import { CharacterService, LocationService } from '../../services';

interface LocationCardConfig {
  icon: string;
  label: string;
  value: string | number;
  cssClass: string;
}

interface LocationTypeConfig {
  value: string;
  label: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.css',
})
export class LocationsComponent implements OnInit {
  private readonly locationService = inject(LocationService);
  private readonly characterService = inject(CharacterService);

  locations = signal<Location[]>([]);
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  searchName = signal('');
  filterType = signal('');

  showModal = signal(false);
  selectedLocation = signal<Location | null>(null);
  locationCharacters = signal<Character[]>([]);
  loadingModal = signal(false);

  locationTypes: LocationTypeConfig[] = [
    { value: '', label: 'Todos los tipos', icon: 'bi-globe', color: 'primary' },
    { value: 'Planet', label: 'Planeta', icon: 'bi-globe2', color: 'success' },
    { value: 'Cluster', label: 'Cúmulo', icon: 'bi-stars', color: 'warning' },
    { value: 'Space station', label: 'Estación Espacial', icon: 'bi-rocket', color: 'info' },
    { value: 'Microverse', label: 'Microverso', icon: 'bi-gem', color: 'danger' },
    { value: 'TV', label: 'TV', icon: 'bi-tv', color: 'secondary' },
    { value: 'Resort', label: 'Resort', icon: 'bi-sun', color: 'warning' },
    { value: 'Fantasy town', label: 'Ciudad Fantástica', icon: 'bi-magic', color: 'primary' },
    { value: 'Dream', label: 'Sueño', icon: 'bi-cloud', color: 'info' },
  ];

  filteredTypeOptions = computed(() => {
    return this.locationTypes.filter(
      (type) => type.value === '' || this.locations().some((loc) => loc.type === type.value),
    );
  });

  hasResidents = computed(() => {
    const location = this.selectedLocation();
    return location && location.residents.length > 0;
  });

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

  getLocationCardInfo(location: Location): LocationCardConfig[] {
    return [
      {
        icon: 'bi-bookmark-fill',
        label: 'Tipo',
        value: location.type,
        cssClass: 'type-badge',
      },
      {
        icon: 'bi-stars',
        label: 'Dimensión',
        value: location.dimension || 'Desconocida',
        cssClass: 'dimension-badge',
      },
      {
        icon: 'bi-people-fill',
        label: 'Residentes',
        value: location.residents.length,
        cssClass: 'residents-badge',
      },
    ];
  }

  getTypeIcon(type: string): string {
    const typeConfig = this.locationTypes.find((t) => t.value === type);
    return typeConfig ? typeConfig.icon : 'bi-geo-alt';
  }

  getTypeColor(type: string): string {
    const typeConfig = this.locationTypes.find((t) => t.value === type);
    return typeConfig ? typeConfig.color : 'primary';
  }

  getCardGradient(index: number): string {
    const gradients = [
      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    ];
    return gradients[index % gradients.length];
  }

  isCurrentPage(page: number): boolean {
    return this.currentPage() === page;
  }

  isPaginationDisabled(): boolean {
    return this.loading() || this.totalPages() <= 1;
  }

  shouldShowEllipsis(page: number): boolean {
    return page === -1;
  }

  openLocationModal(location: Location): void {
    this.selectedLocation.set(location);
    this.showModal.set(true);
    document.body.style.overflow = 'hidden';
    this.loadLocationCharacters(location);
  }

  closeModal(): void {
    this.showModal.set(false);
    document.body.style.overflow = '';
    setTimeout(() => {
      this.selectedLocation.set(null);
      this.locationCharacters.set([]);
    }, 300);
  }

  loadLocationCharacters(location: Location): void {
    if (location.residents.length === 0) {
      this.locationCharacters.set([]);
      return;
    }

    this.loadingModal.set(true);
    const characterIds = location.residents.map((url) => {
      const parts = url.split('/');
      return parseInt(parts[parts.length - 1], 10);
    });

    this.characterService.getMultiple(characterIds).subscribe({
      next: (characters) => {
        this.locationCharacters.set(Array.isArray(characters) ? characters : [characters]);
        this.loadingModal.set(false);
      },
      error: () => {
        this.locationCharacters.set([]);
        this.loadingModal.set(false);
      },
    });
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
}
