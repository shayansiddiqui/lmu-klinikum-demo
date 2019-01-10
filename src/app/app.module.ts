import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {FileUploadModule} from 'ng2-file-upload';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';

import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';
import {
  MatInputModule,
  MatButtonModule,
  MatToolbarModule,
  MatCardModule,
  MatListModule,
  MatGridListModule,
  MatSelectModule,
  MatSliderModule,
  MatDialogModule
} from '@angular/material';

import {ROUTES} from './app.routes';

import '../styles/styles.scss';
import '../styles/headings.css';
import 'rxjs/Rx';
import '../../node_modules/hammerjs/hammer.min';

import {ModelDisplayComponent} from './model-display/model-display.component';
import {ModelSelectorComponent} from './model-selector/model-selector.component';
import {ModelUploadComponent} from './model-upload/model-upload.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ModelDisplayComponent,
    ModelSelectorComponent,
    ModelUploadComponent,
    InfoDialogComponent,
  ],
  entryComponents: [InfoDialogComponent],
  imports: [
    MatInputModule,
    MatButtonModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    MatSelectModule,
    MatSliderModule,
    MatGridListModule,
    FileUploadModule,
    NgxSpinnerModule,
    MatDialogModule,
    RouterModule.forRoot(ROUTES, {useHash: false, preloadingStrategy: PreloadAllModules})
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
