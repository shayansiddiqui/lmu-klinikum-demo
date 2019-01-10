import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {InfoDialogComponent} from './info-dialog/info-dialog.component';
import {MatDialog} from '@angular/material';

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
          <a href="http://ai-med.de" target="_blank"><img src="../assets/images/LMULogo_full_adpt_small_v1.png"></a>
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

  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) {
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
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      width: '750px',
      data: {
        title: 'User Instructions',
        content: '<div><strong>This is a website for automated whole brain segmentation of MRI T1 scans.</strong></div> <br>' +
        ' <div><strong>Steps to use the service:</strong></div>' +
        '  <ol>\n' +
        '    <li> \'Drag and drop\' or \'select from your computer\' the brain scan you intend to segment in the left-hand side box. (You may use our sample MRI scan for testing)</li>\n' +
        '    <li> Press the \'segment\' button in the middle to start the segmentation process.</li>\n' +
        '    <li> You may scroll through the \'scroll-bar\' to view the input and segmentation across the volume (displayed in coronal view)</li>\n' +
        '    <li> You can refer the table below for the brain structures corresponding to each colors and their volume estimates.\n</li>\n' +
        '    <li> The segmentation file can be downloaded using the \'download\' button to the right.</li>\n' +
        '    <li> Press the \'Clear\' button on the left to restart processing a new volume.\n</li>\n' +
        '  </ol>' +
        '  <strong>All the best!!! Please provide us feedback at: abhijit@ai-med.de</strong>'
      }
    });
  }
}
