import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { JsonFormData } from './components/dynamic-form/dynamic-form.component';
import { DialogComponent } from './modal/dialog/dialog.component';
import { QouteEditComponent } from './modal/qoute-edit/qoute-edit.component';
// import { SelectdialogComponent } from './modal/selectdialog/selectdialog.component';

export interface DialogData {
  title?: string;
  description?: string;
  schema?: JsonFormData;
  value?: any;
  file?: boolean;
  bfile?: boolean;
  measure?: boolean;
  newUsr?: boolean;
  dgwidth?: number;
  dgheigth?: number;
  imgwidth?: number;
  imgheight?: number;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  public dialogRef: any;

  constructor(public dialog: MatDialog) { }

  aPass(adata: DialogData): any {
    const passData: JsonFormData = {
      controls: [
        {
          name: 'email',
          label: 'Correo electrónico:',
          type: 'text',
          style: {'width':'150px'},
          validators: { required: true }
        },
        {
          name: 'pass',
          label: 'Contraseña:',
          type: 'password',
          sideBtn: 'visibility',
          // style: {'width':'100px','background-color': 'white'},
          validators: { required: true }
        },
      ]
    }

    /*
    if (passData.controls && adata.newUsr) {
      passData.controls.push({
        name: 'new',
        label: 'Nuevo usuario',
        type: 'checkbox',
        default: 'false',
        validators: {}
      })
    };
    */

    adata.schema = passData;

    this.dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-dialog-container',
      height: '325px',
      width: '275px',
      data: adata
    });
    return this.dialogRef.afterClosed(); // .subscribe(result => { return result; });
  }

  aDefault(adata: DialogData): any {

    const dgsize = this.dialogsize(adata.dgheigth, adata.dgwidth);
    this.dialogRef = this.dialog.open(DialogComponent, {
      panelClass: 'custom-dialog-container',
      height: dgsize.dheight,
      width: dgsize.dwidth,
      data: adata
    });
    return this.dialogRef.afterClosed();
  }

  aQuoteEdit(adata: DialogData): any {
    const dgsize = this.dialogsize(adata.dgheigth, adata.dgwidth);
    this.dialogRef = this.dialog.open(QouteEditComponent, {
      panelClass: 'custom-dialog-container',
      height: dgsize.dheight,
      width: dgsize.dwidth,
      data: adata
    });
    return this.dialogRef.afterClosed();
  }

  private dialogsize(dgheigth: number = 100000, dgwidth: number = 100000) {
    let maxheight = window.innerHeight - 20;
    dgheigth = dgheigth || maxheight;
    maxheight = maxheight > dgheigth ? dgheigth : maxheight;

    let maxwidth = (window.innerWidth - 20);
    dgwidth = dgwidth || maxwidth;
    maxwidth = maxwidth > dgwidth ? dgwidth : maxwidth;

    return { dheight: maxheight.toString() + 'px', dwidth: maxwidth.toString() + 'px' } as const
  }

}