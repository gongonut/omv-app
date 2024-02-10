import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Item } from '../../datatypes';
// import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-detail-long',
  templateUrl: './detail-long.component.html',
  styleUrls: ['./detail-long.component.scss']
})
export class DetailLongComponent implements OnChanges {
  
  @Input() qitem!: Item;
  @Output() onChange = new EventEmitter<Item>();
  prettl = 0;
  ttl = 0;
  // p_iva = 0;

  constructor(
    // private snkBar: MatSnackBar
    ) { }

    /*
  ngOnInit(): void {
    
    this.updateValues();
  }
  */

  ngOnChanges(changes: SimpleChanges) {
    
    this.updateValues();
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
    this.qitem.itemTag.precio = Number(e.target.value);
    // get porcent from number
    this.qitem.itemTag.p_increment = (this.qitem.itemTag.precio * 100 / Number(this.qitem.precio)) - 100;
  

    this.updateValues();
  }

  onP_Increment(e: any) {
    if (Number(e.target.value) < 0) { e.target.value = 0 }
    this.qitem.itemTag.p_increment = Number(e.target.value);
    if (!this.qitem.itemTag.p_increment) this.qitem.itemTag.p_increment = 0;
    this.qitem.itemTag.precio = Number(this.qitem.precio) + (Number(this.qitem.precio) * this.qitem.itemTag.p_increment /100);
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
    this.prettl = ((this.qitem.itemTag.precio) * this.qitem.itemTag.cantidad) - this.getDescuento();
    this.ttl = this.prettl + (this.prettl * this.qitem.itemTag.p_iva / 100);
    this.onChange.emit(this.qitem);
  }

  percentVal(p: number) {
    
  }

  changeExpand() {
    this.qitem.itemTag.expand = false;
    this.updateValues();
  }

}
