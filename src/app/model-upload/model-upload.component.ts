import {Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output} from '@angular/core';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ViewChild, ElementRef} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {ModelDisplayComponent} from '../model-display/model-display.component';
import 'rxjs/add/operator/toPromise';
import {saveAs} from 'file-saver/FileSaver';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {InfoDialogComponent} from '../info-dialog/info-dialog.component';


const SEGMENT_URL = 'api/segment/';
const PREVIEW_URL = 'api/preview/';
const SAMPLE_URL = 'api/sample/';
const DEFAULT_UPLOAD_ENDPOINT = 'quicknat';

@Component({
  selector: 'app-model-upload',
  templateUrl: './model-upload.component.html',
  styleUrls: ['./model-upload.component.css']
})
export class ModelUploadComponent implements OnInit, OnChanges {

  private uploadEndpoint: string = DEFAULT_UPLOAD_ENDPOINT;
  private downloadPath: string;

  @Output() notify: EventEmitter<any> = new EventEmitter<any>();

  @Input() private selectedModel: any;

  public uploader: FileUploader = new FileUploader({});
  public hasBaseDropZoneOver: boolean = false;
  public filePreviewPath: string;
  public resultImgPath: string;
  private previewVideo: any;
  private resultVideo: any;
  sliderValue: number = 0;

  @ViewChild('playPauseButton') private playPauseButton: any;
  @ViewChild('seekslider') private seekslider: any;

  @ViewChild('previewVideo') set _previewVideo(video: ElementRef) {
    if (video) {
      this.previewVideo = video.nativeElement;
    }
  }

  @ViewChild('resultVideo') set _resultVideo(video: ElementRef) {
    if (video) {
      this.resultVideo = video.nativeElement;
    }
  }

  constructor(private sanitizer: DomSanitizer, private http: HttpClient, private spinner: NgxSpinnerService,
              private parent: ModelDisplayComponent, public dialog: MatDialog) {
    const that = this;
    this.uploader.onAfterAddingFile = (fileItem) => {
      that.spinner.show();
      const formData = new FormData();
      formData.append('type', 'relaynet');
      formData.append('file', fileItem._file);
      const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
      const req = that.http.post(PREVIEW_URL + this.uploadEndpoint, formData)
        .subscribe(
          (res: Response) => {
            that.filePreviewPath = 'data:video/mp4;base64,' + res.body;
            that.spinner.hide();
            const id = setInterval(t => {
              if (that.previewVideo.readyState === 4) {
                that.previewVideo.currentTime = that.previewVideo.duration / 2;
                clearInterval(id);
              }
            }, 500);

          },
          err => {
            console.log(err);
            that.spinner.hide();
          }
        );
    };

  }

  get noFile() {
    return this.uploader.queue.length === 0;
  }

  get noResult() {
    return !this.resultImgPath;
  }

  ngOnChanges() {
    this.uploadEndpoint = this.selectedModel ? this.selectedModel.name : DEFAULT_UPLOAD_ENDPOINT;
    this.uploader.setOptions({url: SEGMENT_URL + this.uploadEndpoint});
  }

  downloadFile() {
    this.http.get<Blob>(this.downloadPath, {responseType: 'blob' as 'json'}).toPromise()
      .then(response => this.saveToFileSystem(response));
  }

  sampleFile() {
    this.spinner.show();
    this.http.get<Blob>(SAMPLE_URL + this.selectedModel.name, {responseType: 'blob' as 'json'}).toPromise()
      .then(response => {
        // TODO:Need to fix this hack
        const model_name = this.selectedModel.name;
        const ext = model_name === 'quicknat' ? '.mgz' : '.nii';
        const fileFromBlob: File = new File([response], 'sample' + ext);
        this.uploader.addToQueue(new Array<File>(fileFromBlob));
      });
  }

  private saveToFileSystem(response) {
    const blob = new Blob([response]);
    saveAs(blob, 'segmentaion.mgz');
  }

  ngOnInit() {
    const that = this;
    this.uploader.onBeforeUploadItem = (fileItem) => {
      this.spinner.show();
    };
    this.uploader.onSuccessItem = (item: FileItem, response: any, status: number, headers: ParsedResponseHeaders) => {
      response = JSON.parse(response);
      const seg_result = response.seg_result;
      const stats = response.stats;
      this.notifyStats(stats);
      this.downloadPath = 'api/' + response.download_path;

      that.resultImgPath = 'data:video/mp4;base64,' + seg_result;
      that.spinner.hide();
      const id = setInterval(t => {
        if (that.resultVideo.readyState === 4) {
          that.resultVideo.currentTime = that.resultVideo.duration / 2;
          that.previewVideo.currentTime = that.previewVideo.duration / 2;
          clearInterval(id);
        }
      }, 500);
    };
  }

  private notifyStats(stats) {
    this.notify.emit(stats);
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public playPause(e: any) {
    const nativePreviewVideo = this.previewVideo;
    const nativeResultVideo = this.resultVideo;
    const playPauseButton = this.playPauseButton;
    if (nativePreviewVideo.paused) {
      nativePreviewVideo.play();
      if (nativeResultVideo) {
        nativeResultVideo.play();
      }
      playPauseButton.nativeElement.innerHTML = '<i class="fa fa-pause"></i>';
    } else {
      nativePreviewVideo.pause();
      if (nativeResultVideo) {
        nativeResultVideo.pause();
      }
      playPauseButton.nativeElement.innerHTML = '<i class="fa fa-play"></i>';
    }
  }

  public vidSeek(event: any) {
    console.log('vidseek');
    const preview = this.previewVideo;
    const result = this.resultVideo;
    const seekTo = preview.duration * (event.value / 100);
    console.log('seek to :' + seekTo);
    preview.currentTime = seekTo;
    if (result) {
      result.currentTime = seekTo;
    }
  }

  public timeUpdate(event: any) {
    const video = event.target;
    const id = setInterval(t => {
      if (video.readyState === 4) {
        const currentTime = event.target.currentTime;
        const duration = event.target.duration;
        const preview = this.previewVideo;
        const nt = currentTime * (100 / duration);
        this.sliderValue = nt;
        if (currentTime === duration) {
          this.playPauseButton.nativeElement.innerHTML = '<i class="fa fa-play"></i>';
        }
        clearInterval(id);
      }
    }, 500);
  }

  public clear() {
    this.uploader.clearQueue();
    this.filePreviewPath = null;
    this.resultImgPath = null;
    this.notifyStats(null);
  }


  openTncDialog(): void {
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      width: '550px',
      data: {
        title: 'Terms and Conditions',
        content: '  <ol>\n' +
        '    <li>This service comes with no warranty expressed or implied.</li>\n' +
        '    <li>This service can only be used for non commercial purposes.</li>\n' +
        '  </ol>'
      }
    });
  }
}
