import { Routes } from '@angular/router';
import { CharacterDetailComponent } from './features/characters/character-detail.component';
import { CharactersComponent } from './features/characters/characters.component';
import { EpisodeDetailComponent } from './features/episodes/episode-detail.component';
import { EpisodesComponent } from './features/episodes/episodes.component';
import { HomeComponent } from './features/home/home.component';
import { LocationDetailComponent } from './features/locations/location-detail.component';
import { LocationsComponent } from './features/locations/locations.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'characters', component: CharactersComponent },
  { path: 'characters/:id', component: CharacterDetailComponent },
  { path: 'locations', component: LocationsComponent },
  { path: 'locations/:id', component: LocationDetailComponent },
  { path: 'episodes', component: EpisodesComponent },
  { path: 'episodes/:id', component: EpisodeDetailComponent },
  { path: '**', redirectTo: '' },
];
