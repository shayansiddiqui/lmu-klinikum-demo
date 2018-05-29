import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-model-selector',
  templateUrl: './model-selector.component.html',
  styleUrls: ['./model-selector.component.css']
})
export class ModelSelectorComponent implements OnInit {
  public modelList = null;

  constructor() {
  }

  ngOnInit() {
    this.modelList = [{
      name: 'RelayNet',
      hasDemo: true
    },
      {
        name: 'QuickNat',
        hasDemo: true
      }];
  }
}
