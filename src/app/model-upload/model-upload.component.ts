import { Component, OnInit } from '@angular/core';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


const URL = 'api/resnet';

@Component({
  selector: 'app-model-upload',
  templateUrl: './model-upload.component.html',
  styleUrls: ['./model-upload.component.css']
})
export class ModelUploadComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver: boolean = false;
  public filePreviewPath: SafeUrl;
  public resultImgPath: string;


  constructor(private sanitizer: DomSanitizer) {
    this.uploader.onAfterAddingFile = (fileItem) => {



      // this.filePreviewPath = (window.URL) ?
      //   this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(fileItem._file))
      //   : this.sanitizer.bypassSecurityTrustUrl((window as any).webkitURL.createObjectURL(fileItem._file));
    };

  }

  get noFile() {
    return this.uploader.queue.length === 0;
  }

  get noResult() {
    return !this.resultImgPath;
  }

  ngOnInit() {
    const that = this;
    this.uploader.onSuccessItem = (item: FileItem, response: any, status: number, headers: ParsedResponseHeaders) => {
      that.resultImgPath = 'data:image/png;base64,' + response;
      // const outputImg = document.createElement('img');
      // outputImg.src = 'data:image/png;base64,' + response;
      // document.body.appendChild(outputImg);
      // let imagedata = "data:" + headers["content-type"] + ";base64," + new Buffer(response).toString('base64');
      // console.log(imagedata);
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

}
