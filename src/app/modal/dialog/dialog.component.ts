import { Component, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JsonFormControl, JsonFormData } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DialogData } from '../../dialog.service';
import { NgxImageCompressService } from 'ngx-image-compress-legacy';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  schema!: JsonFormData;
  result!: any;
  disable = true;
  reset = 0;
  image1: any;
  image2: any;
  image3: any;
  image4: any;
  image5: any;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private imageCompress: NgxImageCompressService,
    private sanitizer: DomSanitizer,) {
    dialogRef.disableClose = true;
    this.schema = this.data.schema || {};
    
  }

  getImage(): any {
    return this.sanitizer.bypassSecurityTrustUrl(this.data.image!);
  }

  fileChangeEvent() {
    
    this.imageCompress.uploadFile().then(
      ({ image, orientation }) => {
        // this.imgResult = image;
        
        console.log("Size in bytes of the uploaded image was:", this.imageCompress.byteCount(image));
        // this.link = image; // TRATAR ESTE TEMA DEL LINK
        this.imageCompress
          .compressFile(image, orientation, 100, 100, this.data.imgwidth, this.data.imgheight) // 50% ratio, 50% quality
          .then(
            (compressedImage) => {
              // this.imgResult = compressedImage;
              
              this.data.image = compressedImage;
              console.log("Size in bytes after compression is now:", this.imageCompress.byteCount(compressedImage));
            }
          );
      }
    );
  }

  onGetData(result: any) {
    
    this.result = result;
    this.disable = result['_valid_'] === false;
    // console.log(result);
    if (result['_btnclick_'] && result['_btnclick_'].length> 0 && result['_btnclick_'].startsWith('pass')) {this.changeVisiblePass(result['_btnclick_']); }
  }

  private changeVisiblePass(control: string) {
    
    if (this.schema.controls && this.schema.controls.length > 1) {
      const passctrl = this.schema.controls.find(ctr => ctr.name === control) as JsonFormControl;
      // const passctrl = this.schema.controls[1] as JsonFormControl;
      passctrl.sideBtn = passctrl.sideBtn === 'visibility' ? 'visibility_off' : 'visibility';
      if (passctrl.sideBtn === 'visibility_off') {passctrl.type = 'text';} else {passctrl.type = 'password';}
      this.reset++;
    }
    
  }

  onDismiss(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.result);
  }

}
