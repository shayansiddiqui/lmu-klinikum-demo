import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-model-display',
  templateUrl: './model-display.component.html',
  styleUrls: ['./model-display.component.css']
})
export class ModelDisplayComponent implements OnInit {
  @Input() public selectedModel: any;

  stats: any;

  constructor() {
  }

  ngOnInit() {
  }

  changeContent(stats) {
    console.log(stats);
    this.stats = stats;
  }

}
