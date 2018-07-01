import { Component } from '@angular/core';

@Component({
  selector: 'app',
  styleUrls: [
    './app.component.scss'
  ],
  template: `
    <header>
      <mat-toolbar color="primary">
        <a [routerLink]="['/']" class="logotTxt">AI Med Demo</a>
        <!--<a class="links" [routerLink]="['/posts']">Posts</a>-->
        <!--<a class="links" [routerLink]="['/react']">React</a>-->
        <!--<a class="links" href="/api/graphql">GraphQL browser</a>        -->
      </mat-toolbar>
    </header>
    <router-outlet></router-outlet>
    <footer>
    </footer>
  `
})
export class AppComponent {
  pageTitle: string = 'LMU Klinikum Demo';
}
