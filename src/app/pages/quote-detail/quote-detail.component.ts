import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CotizaWish, Item } from 'src/app/datatypes';
import { HttpQuoteService } from 'src/app/http-quote.service';
import { MongoBaseService } from 'src/app/mongo-base.service';
import { MatMenuTrigger } from '@angular/material/menu';
// import { NavObserverService } from 'src/app/nav-observer.service';
import { SharedVarsService } from 'src/app/shared-vars.service';
import { JsonFormData } from 'src/app/components/dynamic-form/dynamic-form.component';
import { DialogData, DialogService } from 'src/app/dialog.service';
import { DomSanitizer } from '@angular/platform-browser';
// import * as puppeteer from 'puppeteer';
// https://pdfmake.github.io/docs/0.1/getting-started/client-side/
// https://github.com/bpampuch/pdfmake/issues/1030
// import * as pdfMake from "pdfmake/build/pdfmake";
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.component.html',
  styleUrls: ['./quote-detail.component.scss']
})
export class QuoteDetailComponent implements OnInit {

  @ViewChild('editControlTrigger') editControlTrigger!: MatMenuTrigger;
  @ViewChild('printcontent', { static: true }) printcontent!: ElementRef<HTMLImageElement>;

  total = 0;
  ttlIva = 0;
  doccss = '';
  // headcss = '';
  edit = false;
  viewNote = false;

  constructor(
    // private nvg: NavObserverService,
    private httpq: HttpQuoteService,
    private snkBar: MatSnackBar,
    public mngdb: MongoBaseService,
    public sharedvar: SharedVarsService,
    private dg: DialogService,
    private sanitizer: DomSanitizer
    // private nvg: NavObserverService
  ) { }

  ngOnInit() {
    this.httpq.getCssData('assets/quote.txt').subscribe(data => {
      this.doccss = data as string;
    })

  }

  getClicked(event: any) {

    switch (event.index) {

      case 4:
        // if (this.mngdb.selQuote.status === 4) return;
        let menu = document.getElementById('spanTrigger');
        if (menu) {
          menu.style.display = '';
          menu.style.position = 'absolute';
          menu.style.left = event.pageX + 5 + 'px';
          menu.style.top = event.pageY + 5 + 'px';
          this.editControlTrigger.openMenu();
        }
        break;
    }
  }

  onQitemChange(qItem: Item) {
    this.total = 0; this.ttlIva = 0;
    this.sharedvar.selQuote.itemList.forEach(qi => {
      const ttl = (qi.itemTag.cantidad * qi.itemTag.precio) - qi.itemTag.descuento;
      this.ttlIva += qi.itemTag.p_iva * ttl / 100;
      this.total += ttl + this.ttlIva;
    });
  }

  onCotizaWishChange(quoteW: CotizaWish) {
    this.setQuote(2);
  }

  setDelete() {

    if (!this.editable()) return;
    this.snkBar.open(`Eliminar: "${this.sharedvar.selQuote.client_name} de la Lista?"`, 'Eliminar', { duration: 3000 })
      .onAction().subscribe(ok => {
        if (this.sharedvar.selQuote._id) {
          this.httpq.deleteQuote(this.sharedvar.selQuote._id).subscribe({
            error: (e) => console.log(e)
          })
        }

      });
  }

  setSend() {
    if (this.edit) {
      return this.snkBar.open(`El documento está en modo edición`, 'Listo', { duration: 10000 })
      
    }
    if (!this.editable()) return;
    return this.snkBar.open(`¿Enviar respuesta al correo: ${this.sharedvar.selQuote.client_email}?`, 'Si', { duration: 10000 })
      .onAction().subscribe(ok => {
        this.sharedvar.selQuote.htmlQuote = this.getSnapshot();
        this.setQuote(4);
        // this.storage.saveactualQuote();
      });
  }

  setQuote(status: number) {
    
    // if (status === 2) { this.quoteTaker(this.sharedvar.selQuote); }
    if (this.sharedvar.selQuote.status < 2) { this.quoteTaker(this.sharedvar.selQuote); }
    if (!this.editable()) return;
    this.sharedvar.selQuote.date = new Date().getTime();
    this.sharedvar.selQuote.status = status;
    if (this.sharedvar.selQuote._id) {
    
      this.sharedvar.selQuote.client_email = this.sharedvar.selQuote.client_email?.trim();
      this.httpq.updateQuote(this.sharedvar.selQuote._id, this.sharedvar.selQuote).subscribe({
        error: (e) => console.log(e),
        complete: () => {
          let task = 'Datos actualizados'
          switch (status) {
            case 1: task = 'Creado'; break;
            case 2: task = 'Actualizado'; break;
            case 4: task = `Enviado a: ${this.sharedvar.selQuote.client_email}`; break;
          }
          // this.storage.actualQuote = {itemList: []};
          this.snkBar.open(task, 'Ok', { duration: 10000 })
        }
      });
    }
  }

  private quoteTaker(quote: CotizaWish) {
    quote.agent_id = this.sharedvar.user._id;
    quote.agent_name = this.sharedvar.user.name;
    quote.agent_phone = this.sharedvar.user.phone;
    quote.agent_city = this.sharedvar.user.city;
    quote.agent_email = this.sharedvar.user.email;
  }

  onEditState(edit: boolean) {
    this.edit = edit;
  }

  onReSendEmail() {
    if (this.sharedvar.selQuote._id) {
      const emailJsonData: JsonFormData = {
        controls: [
          {
            name: 'client_email',
            label: 'Lista de correos',
            //"value": "",
            type: 'textarea',
            totalRows: 5,
            style: 'w-full',
            validators: { required: true }
          }
        ]
      }
  
      const ddta: DialogData = {
        title: 'Lista de correos destino',
        value: this.sharedvar.selQuote,
        schema: emailJsonData,
        dgwidth: 400,
        dgheigth: 350
      }
  
      this.dg.aDefault(ddta).subscribe((result: any) => {
        
        if (result && this.sharedvar.selQuote._id) {
          this.sharedvar.selQuote.htmlQuote = this.getSnapshot();
          const resultMails = this.sharedvar.removeAccents(result['client_email']);
          this.sharedvar.selQuote.client_email = resultMails.replaceAll('\n', ';');
          
          this.httpq.resendMailQuote(this.sharedvar.selQuote._id, this.sharedvar.selQuote).subscribe({
            next(value) {
              // console.log(value);
              const json = JSON.stringify(value);
              alert(json);
            },
            error(err) {
              alert('Por favor reportar este error al desarrollador del programa:' + err);
            },
          })
        }
      });    
    }
  }

  private getSnapshot(): string {
    // let bananaSnapshotHtml = this.myBanana.elementRef.nativeElement.outerHTML;
    let element = document.getElementById('printsection');
    if (element) {
      // doccss
      let htmltosend = `<!DOCTYPE html><html><head><style>
      ${this.doccss}
      </style></head></style></head><body>
      ${element.outerHTML}
      </body></html>`;
      return htmltosend;
    }
    return '';

  }

  onNote() {
    this.viewNote = !this.viewNote;
  }

  getNoteIcon(): string {
    return this.viewNote ? 'visibility_off' : 'visibility';
  }

  updateImgDoc() {
    debugger;
    let newQuote = { ...this.sharedvar.selQuote } as any;
    // delete(newQuote.condList.)
    newQuote.itemList.forEach((il: any) => {
      if (il.imagen && il.imagen.imagen && il.imagen.imagen.file_md) {il.imagen = il.imagen.imagen.file_md}
      if (il.materiales && il.materiales[0] && il.materiales[0].imagenes && il.materiales[0].imagenes[0] &&
        il.materiales[0].imagenes[0].imagen && il.materiales[0].imagenes[0].imagen.file_md) {
        il.materiales[0].imagenes[0] = il.materiales[0].imagenes[0].imagen.file_md;
      }
    })
    // console.log(this.sharedvar.selQuote);
    this.sharedvar.selQuote = newQuote;
    this.setQuote(this.sharedvar.selQuote.status);
    
  }

  getNoteText() {
    return this.viewNote ? 'Ocultar nota del cliente' : 'Ver nota del cliente';
  }

  editable(): boolean {

    const b = this.sharedvar.selQuote.agent_id == this.sharedvar.user._id && this.sharedvar.selQuote.status < 4;
    // b = b || this.forceEdit;
    if (!b) {
      this.snkBar.open(`No es posible ejecutar la acción: Asegurese de que la cotización esté en trámite y que usted sea el "Tomador"`, 'Ok', { duration: 3000 })
    }
    return b;
  }

  getComImage(): any {
    if (this.sharedvar.selQuote.crome_image) return this.sanitizer.bypassSecurityTrustUrl(this.sharedvar.selQuote.crome_image);
  }

  onDuplicate() {


    const dupData: JsonFormData = {
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
          name: 'client_email',
          label: 'Correo destino:',
          //"value": "",
          type: 'text',
          style: 'w-full',
          validators: { required: true }
        },
        {
          name: 'client_phone',
          label: 'Teléfono:',
          //"value": "",
          type: 'text',
          // style: 'w-full',
          validators: {}
        },
      ]
    }

    let newQuote = { ...this.sharedvar.selQuote };
    const ddta: DialogData = {
      title: 'Duplicar cotización',
      value: newQuote,
      schema: dupData,
      dgheigth: 475
    }

    this.dg.aDefault(ddta).subscribe((result: any) => {
      if (result) {

        this.sharedvar.updatePropResult(newQuote, result);
        // console.log(newQuote);
        // this.quoteTaker(newQuote);
        newQuote.date = new Date().getMilliseconds();
        newQuote.status = 2;
        delete newQuote._id;
        this.httpq.createQuote(newQuote).subscribe({
          next: (value: CotizaWish) => {
            // console.log(value);

            // this.sharedvar.selQuote = value;
            this.snkBar.open(`Cotización duplicada, nuevo consecutivo: "${value.consecutive}"`, 'Ok', { duration: 10000 })
          },
          //next(value: CotizaWish) {console.log(value); this.sharedvar.selQuote = value; },
          error(err) {
            console.log(err);
          },
        })
      }
    });
  }

  async printAsPdf() {
    
    // console.log(this.getSnapshot())
    this.generatePdf();
    /*
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(this.getSnapshot());
    await page.screenshot({ path: 'example.png' });

    const buffer = await page.pdf({
      // path: 'output-abc.pdf',
      format: 'a4',
      printBackground: true,
      margin: {
        left: '10mm',
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
      },
    });
    console.log(buffer);

    await browser.close();
    */
  }

  // https://stackblitz.com/edit/angular-html-to-pdf-example-answer?file=src%2Fapp%2Fapp.component.ts
  // https://stackoverflow.com/questions/56961732/how-do-i-convert-with-angular-html-into-pdf
  // https://www.npmjs.com/package/html2canvas

  /*
  private export2Pdf() {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter'
    });
    
    doc.html(this.printcontent.nativeElement, {
      callback: (doc: jsPDF) => {
        doc.deletePage(doc.getNumberOfPages());
        doc.save('pdf-export');
      }
    });
  }
*/

  /*
  generatePdf() {
    const pdfTable = this.printcontent.nativeElement;
    //html to pdf format
    var htmlToPdfmake = require("html-to-pdfmake");
    var html = htmlToPdfmake(this.getSnapshot());
    const docDefinition = {
      content: [
        html
      ]
    };
    pdfMake.createPdf(docDefinition).open();
  }
  */

  generatePdf() {
    const pdfTable = this.printcontent.nativeElement;
    


    html2canvas(pdfTable, { useCORS: true, scale: 2 }).then((canvas: any) => {
      const imgWidth = 208;
      // const imgWidth = 416;
      const pageHeight = 295;
      // const pageHeight = 590;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      heightLeft -= pageHeight;
      const doc = new jsPDF('p', 'mm', 'letter');
      doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= pageHeight;
      }
      doc.save('Downld.pdf');
    });

    return;

    html2canvas(pdfTable, { useCORS: true }).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')

      let pdf = new jsPDF('p', 'mm', 'letter'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('new-file.pdf'); // Generated PDF
      pdf.output('blob');
    });
  }
}


