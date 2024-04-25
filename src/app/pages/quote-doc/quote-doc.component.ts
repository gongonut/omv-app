import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JsonFormData } from 'src/app/components/dynamic-form/dynamic-form.component';
import { Condition } from 'src/app/datatypes';
import { DialogData, DialogService } from 'src/app/dialog.service';
import { HttpGeneralService } from 'src/app/http-general.service';
import { HttpQuoteService } from 'src/app/http-quote.service';
// import { MongoBaseService } from 'src/app/mongo-base.service';
import { SharedVarsService } from 'src/app/shared-vars.service';

@Component({
  selector: 'app-quote-doc',
  templateUrl: './quote-doc.component.html',
  styleUrls: ['./quote-doc.component.scss']
})
export class QuoteDocComponent implements OnInit {

  quote_cond_list: Condition[] = [];

  readonly settings: JsonFormData = {
    controls: [
      {
        name: 'name',
        label: 'Nombre de la empresa:',
        type: 'text',
        style: 'w-full',
        validators: { required: true }
      },
      {
        name: 'site',
        label: 'Vinculo a la página:',
        type: 'text',
        style: 'w-full',
        validators: { required: true }
      },
      {
        name: 'phone',
        label: 'Teléfono:',
        type: 'text',
        validators: { required: true }
      },
      {
        name: 'address',
        label: 'Dirección corta:',
        type: 'text',
        validators: { required: true }
      },
      {
        name: 'consecutive',
        label: 'Consecutivo:',
        type: 'number',
        validators: { required: true }
      },
      {
        name: 'p_iva',
        label: 'Porcentaje de iva:',
        type: 'number',
        validators: { required: true }
      },
      {
        name: 'notifMails',
        label: 'Correos para notificar (separados por punto y coma ;):',
        type: 'textarea',
        totalRows: 2,
        style: 'w-full',
        validators: {}
      },

      /*
      {
        name: 'newUsr',
        label: 'Nuevo usuario',
        type: 'checkbox',
        validators: { }
      }
      */
    ]
  }

  constructor(
    private dg: DialogService,
    // private mongodb: MongoBaseService,
    private httpGen: HttpGeneralService,
    private httpq: HttpQuoteService,
    public sharedvar: SharedVarsService,
    private snkBar: MatSnackBar
  ) { }

  ngOnInit() {

    if (this.sharedvar.general.quote_condition.length > 0)
      this.quote_cond_list = JSON.parse(this.sharedvar.general.quote_condition) as Condition[];
  }

  getClicked(event: any) {
    switch (event.index) {

      case 2:
        // Actualizo desde Marpico
        this.httpq.updateFromMarpico().subscribe((res: Response) => {
          console.log('Actualizado con exito');
          this.snkBar.open('Actualizado con exito', 'Ok', { duration: 6000 });

        });
        break;
    }
  }
  /*
  getClicked(event: any) {
 
    switch (event.index) {
 
      case 2:
        const cond = this.newCondition('Título');
        this.editAddCondition(cond);
        break;
    }
  }
  */

  addEditItemMPCO() {
    // const anew = MPCOitem? false : true;
    const condData: JsonFormData = {
      controls: [
        {
          name: 'key',
          label: 'Código MARPICO:',
          type: 'text',
          // style: { 'width': '150px' },
          validators: { required: true }
        },
        {
          name: 'value',
          label: 'Título:',
          type: 'text',
          style: 'w-full',
          validators: { required: true }
        }
      ]
    }


    const MPCOitem = { key: 'CODIGO', value: 'TITULO' }

    // const condName = cond.name || '';

    const ddta: DialogData = {
      title: 'Código - Título',
      value: MPCOitem,
      schema: condData,
      dgheigth: 315,
      dgwidth: 600
    }

    this.dg.aDefault(ddta).subscribe((result: any) => {

      if (result) {
        // this.dg.updatePropResult(user, result);
        debugger;
        delete (result._valid_);
        delete (result._propName_);


        this.sharedvar.general.catagMARPICO.push(result)


        this.httpGen.updateGeneral(this.sharedvar.general).subscribe(data => {

          if (data) { }
        })
      }
    });
  }

  deleteMPCOitem(index: number) {
    this.snkBar.open(`Eliminar ${this.sharedvar.general.catagMARPICO[index].key}-${this.sharedvar.general.catagMARPICO[index].value}`, 'Continuar', { duration: 3000 })
      .onAction().subscribe(async ok => {
        this.sharedvar.general.catagMARPICO.splice(index, 1);
        this.httpGen.updateGeneral(this.sharedvar.general).subscribe(data => {

          if (data) { }
        })

      });

  }

  addCondition() {
    const cond = this.newCondition('Título');
    this.editAddCondition(cond);
  }

  private editAddCondition(cond: Condition) {

    const condData: JsonFormData = {
      controls: [
        {
          name: 'name',
          label: 'Título:',
          type: 'text',
          style: { 'width': '150px' },
          validators: { required: true }
        },
        {
          name: 'detail',
          label: 'Descripción:',
          type: 'textarea',
          style: 'w-full',
          totalRows: 6,
          validators: {}
        }
      ]
    }

    const condName = cond.name || '';

    const ddta: DialogData = {
      title: 'Condiciones Comerciales',
      value: cond,
      schema: condData,
      dgheigth: 600,
    }

    this.dg.aDefault(ddta).subscribe((result: any) => {

      if (result) {
        // this.dg.updatePropResult(user, result);
        const cndf = this.quote_cond_list.find(cnd => cnd.name === condName);
        if (cndf) {
          cndf.name = result.name;
          cndf.detail = result.detail;
        } else {
          this.quote_cond_list.push({ name: result.name, detail: result.detail })
        }
        this.sharedvar.general.quote_condition = JSON.stringify(this.quote_cond_list);
        this.httpGen.updateGeneral(this.sharedvar.general).subscribe(data => {

          if (data) { }
        })
      }
    });
  }

  onStatus(event: any) {

    switch (event.tag) {
      case 'edit':
        this.editAddCondition(event);
        break;
      case 'delete':
        const i = this.quote_cond_list.findIndex(cnd => cnd.name === event.name);
        if (i >= 0) {
          this.quote_cond_list.splice(i, 1);
          this.sharedvar.general.quote_condition = JSON.stringify(this.quote_cond_list);
          this.httpGen.updateGeneral(this.sharedvar.general).subscribe(data => {
            if (data) { }
          })
        }
        break;
    }
  }

  private newCondition(title: string): Condition {
    return { name: title } as Condition;
  }

  onGetData(result: any) {

    result.name = result.name?.toUpperCase() || '';
    this.sharedvar.updatePropResult(this.sharedvar.general, result);
    if (result['_valid_'] === false) {
      this.snkBar.open('Debe proporcionar la información solicitada', 'Ok', { duration: 3000 })
      return;
    }

    this.httpGen.updateGeneral(this.sharedvar.general).subscribe(data => {
      if (data) {

      }
    })
  }

}
