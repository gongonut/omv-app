import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectData, SelectDialogComponent } from './modal/select-dialog/select-dialog.component';
// import { SelectData, SelectdialogComponent } from './modal/selectdialog/selectdialog.component';

@Injectable({
  providedIn: 'root'
})
export class SeldialogService {

  public dialogRef: any;

  constructor(public dialog: MatDialog) { }

  aSelectDefault(adata: SelectData): any {

    
    let maxheight = window.innerHeight - 20;
    adata.dgheigth = adata.dgheigth || maxheight;
    maxheight = maxheight > adata.dgheigth ? adata.dgheigth : maxheight;

    /*
    let minwidth = (window.innerWidth - 20);
    adata.dgwidth = adata.dgwidth || minwidth;
    minwidth = minwidth > adata.dgwidth ? adata.dgwidth : minwidth;
    */

    this.dialogRef = this.dialog.open(SelectDialogComponent, {
      panelClass: 'custom-dialog-container',
      height: maxheight.toString() + 'px',
      width: '350px',
      //height: 200,
      data: adata
    });

    return this.dialogRef.afterClosed();
  }


}
