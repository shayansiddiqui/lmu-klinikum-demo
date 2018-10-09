import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app',
  styleUrls: [
    './app.component.scss'
  ],
  template: `
    <header>
      <mat-toolbar color="primary" class="mat-elevation-z4 main-toolbar">
        <!--<div class="row">-->
        <div class="col-lg-3">
          <a [routerLink]="['/']"><img src="../assets/images/LMULogo_full_adpt_small.png"></a>
          <!--<a class="links" [routerLink]="['/posts']">Posts</a>-->
          <!--<a class="links" [routerLink]="['/react']">React</a>-->
          <!--<a class="links" href="/api/graphql">GraphQL browser</a>        -->
        </div>
        <div class="col-lg-6">
          <mat-form-field style="width: 100%">
            <mat-select [(value)]="selected" (selectionChange)="selectModel()">
              <mat-option *ngFor="let model of modelList" value="{{model.name}}">{{model.title}}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <div class="col-lg-3" style="text-align: right">
          <a [routerLink]="" (click)="openHelp()" class="toolBarTxt">
            <i class="fa fa-question-circle"></i>
          </a>
        </div>
        <!--</div>-->
      </mat-toolbar>
    </header>
    <router-outlet></router-outlet>
    <footer>
    </footer>
  `
})
export class AppComponent implements OnInit {
  pageTitle: string = 'AI Med Demo';

  public modelList = [];
  public selected = '';

  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
    this.http.get('./assets/models.json').subscribe(data => {
      const available_models = Object.keys(data);
      available_models.forEach(model => {
        this.modelList.push({'name': model, 'title': data[model].title});
      });
      this.selected = this.modelList[0].name;
    });
  }

  selectModel() {
    console.log(this.selected);
    this.router.navigate(['', this.selected]);
  }

  openHelp() {
    console.log('Help');
  }
}
