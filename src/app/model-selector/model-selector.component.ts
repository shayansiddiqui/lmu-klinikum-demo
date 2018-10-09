import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-model-selector',
  templateUrl: './model-selector.component.html',
  styleUrls: ['./model-selector.component.css']
})
export class ModelSelectorComponent implements OnInit {
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  public modelList = [];
  public selected = '';

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get('./assets/models.json').subscribe(data => {
      const available_models = Object.keys(data);
      available_models.forEach(model => {
        this.modelList.push({'name': model, 'title': data[model].title});
      });
      this.selected = this.modelList[0].name;
      this.selectModel();
    });
  }

  selectModel() {
    this.notify.emit(this.selected);
  }
}
