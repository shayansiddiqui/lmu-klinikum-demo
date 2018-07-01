import { Component, OnInit } from '@angular/core';
import { ModelSelectorComponent } from '../model-selector/model-selector.component';

@Component({
  selector: 'pm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public selectedModel = null;

  changeModel(model_name) {
    this.selectedModel = model_name;
  }
}
