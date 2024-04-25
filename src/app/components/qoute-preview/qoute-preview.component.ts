import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { Condition, CotizaWish, Item } from 'src/app/datatypes';
import { DialogData, DialogService } from 'src/app/dialog.service';
import { MongoBaseService } from 'src/app/mongo-base.service';
import { JsonFormData } from '../dynamic-form/dynamic-form.component';
import { NavObserverService } from 'src/app/nav-observer.service';
import { SharedVarsService } from 'src/app/shared-vars.service';

@Component({
  selector: 'app-qoute-preview',
  templateUrl: './qoute-preview.component.html',
  styleUrls: ['./qoute-preview.component.scss']
})
export class QoutePreviewComponent implements OnInit {

  @Input() edit = false;
  @Output() onChange = new EventEmitter<CotizaWish>();
  ttlBruto = 0;
  ttlIva = 0;
  total = 0;
  // itemTtl: {familia: string, } = [];
  quote_cond_list: Condition[] = [];

  constructor(
    private mngodb: MongoBaseService,
    private dg: DialogService,
    private nvg: NavObserverService,
    public sharedvar: SharedVarsService
  ) { }

  ngOnInit() {
    if (this.sharedvar.selQuote.status < 2) {
      this.sharedvar.updatePropResult(this.sharedvar.selQuote, this.sharedvar.defaWishData);
      this.updateDefault();
      this.uppecase();
    }
    if (this.sharedvar.general.quote_condition.length > 0)
      this.quote_cond_list = JSON.parse(this.sharedvar.general.quote_condition) as Condition[];
    if (!this.sharedvar.selQuote.condList || this.sharedvar.selQuote.condList.length === 0) {
      this.fillCondition();
    }
    this.onQitemChange();
  }

  private updateDefault() {
    this.sharedvar.selQuote.itemList.forEach(itm => {
      if (!itm.itemTag.p_iva || itm.itemTag.p_iva === 0) {
        itm.itemTag.p_iva = this.sharedvar.general.p_iva;
      }
    })
  };

  private uppecase() {
    this.sharedvar.selQuote.agent_name = this.sharedvar.selQuote.agent_name?.toUpperCase();
    this.sharedvar.selQuote.agent_city = this.sharedvar.selQuote.agent_city?.toUpperCase();
    this.sharedvar.selQuote.client_contact = this.sharedvar.selQuote.client_contact?.toUpperCase();
    this.sharedvar.selQuote.client_contact_position = this.sharedvar.selQuote.client_contact_position?.toUpperCase();
    this.sharedvar.selQuote.client_contact_city = this.sharedvar.selQuote.client_contact_city?.toUpperCase();
    this.sharedvar.selQuote.client_name = this.sharedvar.selQuote.client_name?.toUpperCase();
    
  }

  private fillCondition() {
    this.quote_cond_list.forEach(cdl => { this.sharedvar.selQuote.condList?.push(cdl.name) })
  }

  onHideTotal(e: any) {
    this.sharedvar.selQuote.hideTotal = e.target.checked;
  }

  onStatus(event: any) {

    switch (event.tag) {
      case 'visible':
        if (!this.sharedvar.selQuote.condList) { this.sharedvar.selQuote.condList = []; }
        if (!this.sharedvar.selQuote.condList.includes(event.name)) {
          this.sharedvar.selQuote.condList.push(event.name);
        }
        break;
      case 'invisible':
        if (!this.sharedvar.selQuote.condList) return;
        const i = this.sharedvar.selQuote.condList.findIndex(cdl => cdl === event.name);
        if (i > -1) { this.sharedvar.selQuote.condList?.splice(i, 1) }
        break;
    }
  }

  getCondVisible(cond_quote: Condition): boolean {
    
    if (!this.sharedvar.selQuote.condList || this.sharedvar.selQuote.condList.length === 0) return true;
    return this.sharedvar.selQuote.condList.findIndex(cdl => cdl === cond_quote.name) > -1;
  }

  getImage(qitem: any): string {
    
    if (qitem.materiales[0].imagenes.length > 0 && qitem.materiales[0].imagenes[0].length > 0) return qitem.materiales[0].imagenes[0];
    return qitem.imagen;
  
  }

  /*

  getImage(qitem: Item): string {
    debugger;
    if (qitem.materiales[0].imagenes.length > 0 && qitem.materiales[0].imagenes[0].imagen.file_sm) return qitem.materiales[0].imagenes[0].imagen.file_sm;
    return qitem.imagen.imagen.file_sm;
  
  }
  */

  getSubTtlXItem(qitem: Item): number {
    return qitem.itemTag.cantidad * qitem.itemTag.precio;
  }

  getTtlXItem(qitem: Item): number {
    const iva = qitem.itemTag.cantidad * qitem.itemTag.precio * qitem.itemTag.p_iva / 100;
    return qitem.itemTag.cantidad * qitem.itemTag.precio + iva;
  }

  onEditHeader() {
    const headerData: JsonFormData = {
      controls: [
        {
          name: 'client_name',
          label: 'Nombre de la empresa:',
          //"value": "",
          type: 'text',
          style: 'w-full',
          validators: { required: true }
        },
        {
          name: 'client_contact',
          label: 'Dirigido a:',
          //"value": "",
          type: 'text',
          style: 'w-full',
          validators: {}
        },
        {
          name: 'client_contact_position',
          label: 'Cargo:',
          //"value": "",
          type: 'text',
          style: 'w-full',
          validators: {}
        },
        {
          name: 'client_contact_city',
          label: 'Ciudad:',
          //"value": "",
          type: 'text',
          style: 'w-full',
          validators: {}
        },
        {
          name: 'client_email',
          label: 'Correo destino:',
          //"value": "",
          type: 'text',
          style: 'w-full',
          validators: { required: true }
        },
      ]
    }

    const ddta: DialogData = {
      title: 'Editar encabezado',
      value: this.sharedvar.selQuote,
      schema: headerData
    }

    this.dg.aDefault(ddta).subscribe((result: any) => {
      if (result) {
        this.sharedvar.selQuote.date = new Date().getTime();
        this.sharedvar.updatePropResult(this.sharedvar.selQuote, result);
        this.onChange.emit(this.sharedvar.selQuote);
      }
    });

  }

  onEditItem(qitem: Item) {
    const ddta: DialogData = {
      title: 'Editar item',
      dgheigth: 475,
      value: qitem,
    }

    this.dg.aQuoteEdit(ddta).subscribe((result: any) => {
      if (result) {

        // this.mngdb.selQuote.date = new Date(result.strdate).getTime();
        this.sharedvar.updatePropResult(qitem, result);
        this.onQitemChange();
        this.onChange.emit(this.sharedvar.selQuote);
      }
    });
  }

  onEditFooter() {

    const footerData: JsonFormData = {
      controls: [
        {
          name: 'agent_name',
          label: 'Nombre del agente:',
          //"value": "",
          type: 'text',
          style: 'w-full',
          validators: { required: true }
        },
        {
          name: 'agent_phone',
          label: 'Teléfono:',
          //"value": "",
          type: 'text',
          style: 'w-full',
          validators: {}
        },
        {
          name: 'agent_email',
          label: 'Email:',
          //"value": "",
          type: 'text',
          validators: {}
        },
        {
          name: 'agent_city',
          label: 'Ciudad:',
          //"value": "",
          type: 'text',
          validators: {}
        }
        /*
        {
          name: 'agent_observations',
          label: 'Observaciones:',
          //"value": "",
          type: 'textarea',
          style: 'w-full',
          totalRows: 5,
          validators: {}
        },
        */
      ]
    }

    const ddta: DialogData = {
      title: 'Editar agente',
      value: this.sharedvar.selQuote,
      schema: footerData
    }

    this.dg.aDefault(ddta).subscribe((result: any) => {
      if (result) {

        this.sharedvar.selQuote.date = new Date().getTime();
        this.sharedvar.updatePropResult(this.sharedvar.selQuote, result);
        this.onChange.emit(this.sharedvar.selQuote);

        /*
        this.dg.updatePropResult(this.sharedvar.defaWishData, result);
        this.mngodb.updateDefaData()
        this.sharedvar.selQuote.date = new Date(result.strdate).getTime();
        this.dg.updatePropResult(this.sharedvar.selQuote, result);
        this.onChange.emit(this.sharedvar.selQuote);
        /*/
      }
    });

  }

  onDelItem(qitem: Item) {
    this.onQitemChange();
  }

  onQitemChange() {
    this.ttlBruto = 0; this.total = 0; this.ttlIva = 0;
    this.sharedvar.selQuote.itemList.forEach(qi => {
      
      this.ttlBruto += (qi.itemTag.cantidad * qi.itemTag.precio) - qi.itemTag.descuento;
      this.ttlIva += qi.itemTag.p_iva * this.ttlBruto / 100;
    });
    this.total += this.ttlBruto + this.ttlIva;
    this.sharedvar.selQuote.total = this.total;
  }

  onEditCondition() {
    this.nvg.onRouteDetail('Editar: condiciones Comerciales', '', 'quotedoc', true);
  }

}
