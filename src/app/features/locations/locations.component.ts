import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Character, Location } from '../../models';
import { CharacterService, LocationService } from '../../services';

interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.css',
})
export class LocationsComponent implements OnInit, OnDestroy {
  private readonly locationService = inject(LocationService);
  private readonly characterService = inject(CharacterService);

  allLocations = signal<Location[]>([]);
  locations = signal<Location[]>([]);
  loading = signal(false);
  searchName = signal('');
  filterType = signal('');
  filterDimension = signal('');

  showModal = signal(false);
  selectedLocation = signal<Location | null>(null);
  locationCharacters = signal<Character[]>([]);
  loadingModal = signal(false);
  showScrollButton = signal(false);
  isScrollingUp = signal(false);
  lastScrollTop = signal(0);
  showFilterModal = signal(false);

  typeOptions = signal<FilterOption[]>([{ label: 'Todos los Tipos', value: '' }]);
  dimensionOptions = signal<FilterOption[]>([{ label: 'Todas las Dimensiones', value: '' }]);

  readonly PAGE_SIZE = 20;
  displayCount = signal(20);
  visibleLocations = computed(() => this.locations().slice(0, this.displayCount()));
  hasMore = computed(() => this.displayCount() < this.locations().length);

  hasResidents = computed(() => {
    const location = this.selectedLocation();
    return location && location.residents.length > 0;
  });

  hasActiveFilters = computed(() => {
    return this.searchName() !== '' || this.filterType() !== '' || this.filterDimension() !== '';
  });

  private scrollHandler = this.handleScroll.bind(this);

  ngOnInit(): void {
    this.loadAllLocations();
    window.addEventListener('scroll', this.scrollHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  loadAllLocations(): void {
    this.loading.set(true);

    this.locationService.getAll(1).subscribe({
      next: (firstResponse) => {
        const totalPages = firstResponse.info.pages;
        const requests = [this.locationService.getAll(1)];

        for (let page = 2; page <= totalPages; page++) {
          requests.push(this.locationService.getAll(page));
        }

        forkJoin(requests).subscribe({
          next: (responses) => {
            const all: Location[] = [];
            responses.forEach((r) => all.push(...r.results));
            this.allLocations.set(all);
            this.extractFilterOptions(all);
            this.applyLocalFilters();
            this.loading.set(false);
          },
          error: () => {
            this.allLocations.set([]);
            this.locations.set([]);
            this.loading.set(false);
          },
        });
      },
      error: () => {
        this.allLocations.set([]);
        this.locations.set([]);
        this.loading.set(false);
      },
    });
  }

  extractFilterOptions(locations: Location[]): void {
    const types = new Set<string>();
    const dimensions = new Set<string>();

    locations.forEach((loc) => {
      if (loc.type && loc.type !== 'unknown') types.add(loc.type);
      if (loc.dimension && loc.dimension !== 'unknown') dimensions.add(loc.dimension);
    });

    const typeOpts: FilterOption[] = [{ label: 'Todos los Tipos', value: '' }];
    Array.from(types)
      .sort()
      .forEach((t) => typeOpts.push({ label: t, value: t }));
    this.typeOptions.set(typeOpts);

    const dimOpts: FilterOption[] = [{ label: 'Todas las Dimensiones', value: '' }];
    Array.from(dimensions)
      .sort()
      .forEach((d) => dimOpts.push({ label: d, value: d }));
    this.dimensionOptions.set(dimOpts);
  }

  private applyLocalFilters(): void {
    let filtered = [...this.allLocations()];

    if (this.searchName()) {
      const s = this.searchName().toLowerCase();
      filtered = filtered.filter((loc) => loc.name.toLowerCase().includes(s));
    }
    if (this.filterType()) {
      filtered = filtered.filter((loc) => loc.type === this.filterType());
    }
    if (this.filterDimension()) {
      filtered = filtered.filter((loc) => loc.dimension === this.filterDimension());
    }

    this.locations.set(filtered);
    this.displayCount.set(20);
  }

  onSearch(name: string): void {
    this.searchName.set(name);
    this.applyLocalFilters();
  }

  onFilterType(type: string): void {
    this.filterType.set(type);
    this.applyLocalFilters();
  }

  onFilterDimension(dimension: string): void {
    this.filterDimension.set(dimension);
    this.applyLocalFilters();
  }

  clearFilters(): void {
    this.searchName.set('');
    this.filterType.set('');
    this.filterDimension.set('');
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

  openLocationModal(location: Location): void {
    this.selectedLocation.set(location);
    this.showModal.set(true);
    document.body.classList.add('modal-open');
    this.loadLocationCharacters(location);
  }

  closeModal(): void {
    this.showModal.set(false);
    document.body.classList.remove('modal-open');
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

    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight - 300 && this.hasMore()) {
      this.displayCount.update((n) => n + this.PAGE_SIZE);
    }
  }

  scrollToPosition(): void {
    if (this.isScrollingUp()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  }
}
