import { Component, OnInit } from '@angular/core';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { Base64 } from 'js-base64';

const URL = 'api/resnet';

@Component({
  selector: 'app-model-upload',
  templateUrl: './model-upload.component.html',
  styleUrls: ['./model-upload.component.css']
})
export class ModelUploadComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver: boolean = false;

  constructor() {
  }

  ngOnInit() {
    this.uploader.onSuccessItem = (item: FileItem, response: any, status: number, headers: ParsedResponseHeaders) => {
      const outputImg = document.createElement('img');
      outputImg.src = 'data:image/png;base64,' + response;
      document.body.appendChild(outputImg);
      // let imagedata = "data:" + headers["content-type"] + ";base64," + new Buffer(response).toString('base64');
      // console.log(imagedata);
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

}
