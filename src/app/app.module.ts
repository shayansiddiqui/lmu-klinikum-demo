import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';
import {
  MatToolbarModule,
  MatCardModule,
  MatListModule,
  MatGridListModule,
  MatSelectModule
} from '@angular/material';

import { ROUTES } from './app.routes';

import '../styles/styles.scss';
import '../styles/headings.css';
import { ModelDisplayComponent } from './model-display/model-display.component';
import { ModelSelectorComponent } from './model-selector/model-selector.component';
import { ModelUploadComponent } from './model-upload/model-upload.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ModelDisplayComponent,
    ModelSelectorComponent,
    ModelUploadComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    MatSelectModule,
    MatGridListModule,
    FileUploadModule,
    RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
