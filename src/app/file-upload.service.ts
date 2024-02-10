import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, } from 'rxjs';
// import { MongoBaseService } from './mongo-base.service';
import { SharedVarsService } from './shared-vars.service';
// import { env } from './environmets';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {



  constructor(private http: HttpClient, private sharedvar: SharedVarsService) { }

  private SERVER_EXCEL = this.sharedvar.OMV_SERVER + 'catalog/excel2Mongodb';
  // private SERVER_IMAGES = this.sharedvar.OMV_SERVER + 'catalog/images2dtbase2';
  private SERVER_IMAGES = this.sharedvar.OMV_SERVER + 'catalog/images2dtbase_';
  private DOWNLOAD_JSON = this.sharedvar.OMV_SERVER + 'catalog/dtbase2Json';
  private DOWNLOAD_ALL_IMAGES = this.sharedvar.OMV_SERVER + 'catalog/backupImages';



  upload2Excel(file: any): Observable<any> {
    const formData = new FormData();
    formData.append("file", file, file.name);
    return this.http.post(this.SERVER_EXCEL, formData)
  }

  uploadImages(fileList: any[]): Observable<any> {

    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append("files", fileList[i], fileList[i].name);
    }
    // formData.append("file", file, file.name);
    return this.http.post(this.SERVER_IMAGES, formData)
  }

  download2Excel(): Observable<any> {
    return this.http.get<any>(this.DOWNLOAD_JSON)
  }

  async donwnloadallimgs(): Promise<any> {
    const list = await firstValueFrom(
      this.http.get<any>(this.DOWNLOAD_ALL_IMAGES)
    )
    return list;

  }

}
