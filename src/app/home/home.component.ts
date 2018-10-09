import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ModelSelectorComponent} from '../model-selector/model-selector.component';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'pm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public selectedModel = null;
  private sub: any;

  constructor(private http: HttpClient, private route: ActivatedRoute) {

  }

  changeModel(model_name) {
    console.log(model_name);
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      const selected = params['selected'];
      const model_name = selected ? selected : 'quicknat';
      this.http.get('./assets/models.json').subscribe(data => {
        this.selectedModel = data[model_name];
        this.selectedModel.name = model_name;
      });

      // In a real app: dispatch action to load the details here.
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
