import { Component, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { JsonFormData } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DialogData } from '../../dialog.service';
import { Item } from 'src/app/datatypes';


@Component({
  selector: 'app-qoute-edit',
  templateUrl: './qoute-edit.component.html',
  styleUrls: ['./qoute-edit.component.scss']
})
export class QouteEditComponent {

  // schema!: JsonFormData;
  // result!: any;
  qitem!: Item;
  ttlIva = 0;
  total = 0;

  constructor(
    public dialogRef: MatDialogRef<QouteEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    dialogRef.disableClose = true;
    this.qitem = data.value as Item;
    
    // this.schema = this.data.schema || {};
  }

  getImage(): string {

    return this.qitem.materiales[0].imagenes[0].imagen.file_sm;
  }

  getExist() {
    return this.qitem.materiales[0].inventario || 0;
  }

  getPrecio(): number {
    return Number(this.qitem.materiales[0].precio) || 0;
  }

  onPrecioCotizaVal(e: any) {
    if (Number(e.target.value) < 0) { e.target.value = 0 }
    this.qitem.itemTag.precio = e.target.value;
    this.updateValues();
  }

  getDescuento(): number {
    return this.qitem.itemTag.descuento || 0;
    this.updateValues();
  }

  onDescuentoVal(e: any) {
    if (Number(e.target.value) < 0) { e.target.value = 0 }
    this.qitem.itemTag.descuento = e.target.value;
    this.updateValues();
  }

  onPIvaVal(e: any) {
    if (Number(e.target.value) < 0) { e.target.value = 0 }
    this.qitem.itemTag.p_iva = e.target.value;
    this.updateValues();

  }

  getNotas(): string {
    return this.qitem.itemTag.notas || '';
  }

  onNotasVal(e: any) {
    // if (e.target.value) < 0) { e.target.value = 0 }
    this.qitem.itemTag.notas = e.target.value;
    this.updateValues();

  }

  /*
  onChangeVal(e: any) {
    if (Number(e.target.value) < 0) { e.target.value = 0 }
    this.qitem.cantidad_cotiza = e.target.value;
    this.updateValues();
    
  }
  */

  private updateValues() {
    
    this.ttlIva = (this.qitem.itemTag.precio * this.qitem.itemTag.cantidad) - this.getDescuento();
    this.total = this.ttlIva + (this.ttlIva * this.qitem.itemTag.p_iva / 100);
    // this.onChange.emit(this.qitem);
  }

  percentVal(p: number) {
    
  }

  changeExpand() {
    this.qitem.itemTag.expand = false;
    this.updateValues();
  }

  onQitemChange(qItem: Item) {
    this.qitem = qItem;
    /*
    
    this.total = 0; this.ttlIva = 0;
    this.mngdb.selQuote.itemList.forEach(qi => {
      const ttl = (qi.itemTag.cantidad * qi.itemTag.precio) - qi.itemTag.descuento;
      this.ttlIva += qi.itemTag.p_iva * ttl / 100;
      this.total += ttl + this.ttlIva;
    });
    */
  }

  onDismiss(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.qitem);
  }

}
