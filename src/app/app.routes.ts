import {Routes} from '@angular/router';
import {HomeComponent} from './home';
import {AppComponent} from './app.component';

export const ROUTES: Routes = [
  {path: '', component: HomeComponent},
  {path: ':selected', component: HomeComponent},
];
