import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-model-selector',
  templateUrl: './model-selector.component.html',
  styleUrls: ['./model-selector.component.css']
})
export class ModelSelectorComponent implements OnInit {
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  public modelList = null;
  public selected = '';

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get('./assets/models.json').subscribe(data => {
      this.modelList = data;
    });
  }

  selectModel() {
    this.notify.emit(this.selected);
    console.log(this.selected);
  }
}
