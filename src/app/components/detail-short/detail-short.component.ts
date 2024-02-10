import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Item } from '../../datatypes';
// import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-detail-short',
  templateUrl: './detail-short.component.html',
  styleUrls: ['./detail-short.component.scss']
})
export class DetailShortComponent implements OnChanges {

  @Input() qitem!: Item;
  @Output() onChange = new EventEmitter<Item>();
  prettl = 0;
  ttl = 0;

  constructor(
    // private snkBar: MatSnackBar
    ) { }

    /*
  ngOnInit(): void {
    
    this.updateValues();
  }
  */

  ngOnChanges(changes: SimpleChanges) {
    
    // if (!this.qitem.itemTag.precio) { this.qitem.itemTag.precio = this.getPrecioCotiza(); }
    // if (!this.qitem.itemTag.cantidad) { this.qitem.itemTag.cantidad = this.getPrecioCotiza(); }
    this.updateValues();
  }

  getImage(): string {
    return this.qitem.materiales[0].imagenes[0].imagen.file_sm;
  }

  getExist() {
    return this.qitem.materiales[0].inventario || 0;
  }

  /*
  getPrecio(): number {
    return Number(this.qitem.materiales[0].precio) || 0;
  }
  */

  /*
  onPrecioCotizaVal(e: any) {
    if (Number(e.target.value) < 0) { e.target.value = 0 }
    this.qitem.itemTag.precio_cotiza = e.target.value;
    this.updateValues();
  }
  */

  /*
  getDescuento(): number {
    this.qitem.itemTag.Descuento = this.qitem.itemTag.Descuento? this.qitem.itemTag.Descuento : 0;
    this.updateValues();
    return this.qitem.itemTag.Descuento;
  }
  */

  /*
  onDescuentoVal(e: any) {
    
    if (Number(e.target.value) < 0) { e.target.value = 0 }
    this.qitem.itemTag.Descuento = e.target.value;
    this.updateValues();
  }
  */



  /*
  onPIvaVal(e: any) {
    
    if (Number(e.target.value) < 0) { e.target.value = 0 }
    this.qitem.itemTag.p_iva = e.target.value;
    this.updateValues();

  }
  */

  getNotas(): string {
    return this.qitem.itemTag.notas || '';
  }

  /*
  onNotasVal(e: any) {
    
    // if (e.target.value) < 0) { e.target.value = 0 }
    this.qitem.itemTag.notas = e.target.value;
    this.updateValues();

  }
  */

  /*
  onChangeVal(e: any) {
    if (Number(e.target.value) < 0) { e.target.value = 0 }
    this.qitem.cantidad_cotiza = e.target.value;
    this.updateValues();
    
  }
  */

  private updateValues() {
      this.prettl = (this.qitem.itemTag.precio * this.qitem.itemTag.cantidad) - this.qitem.itemTag.descuento;
      this.ttl = this.prettl + (this.prettl * this.qitem.itemTag.p_iva / 100);
    this.onChange.emit(this.qitem);
  }

  percentVal(p: number) {
    
  }

  changeExpand() {
    
    this.qitem.itemTag.expand = true;
    this.updateValues();
  }

  /*
  getValidCotiza() {
    let b = true;
    if (this.qitem.cantidad_cotiza) {
      b = (b && this.qitem.cantidad_cotiza > 0);
      if (this.qitem.cantidad_cotiza > this.qitem.cantidad) {
        b = false;
        this.snkBar.open(`La cantidad solicitada de ${this.qitem.descripcion_comercial} es superior a la existencia`, 'List', { duration: 3000 })
      }
    } else { b = false; }
    return b;
  }
  */

}
