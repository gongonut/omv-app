import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JsonFormData } from 'src/app/components/dynamic-form/dynamic-form.component';
import { Data2excelService } from 'src/app/data2excel.service';
import { CotizaWish } from 'src/app/datatypes';
import { DialogData, DialogService } from 'src/app/dialog.service';
import { FileUploadService } from 'src/app/file-upload.service';
import { HttpQuoteService } from 'src/app/http-quote.service';
import { NavObserverService } from 'src/app/nav-observer.service';
import { SharedVarsService } from 'src/app/shared-vars.service';

@Component({
  selector: 'app-quote-list',
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.scss']
})
export class QuoteListComponent implements OnInit {

  @ViewChild('editControlTrigger') editControlTrigger!: MatMenuTrigger;
  @ViewChild('excelUpload') excelUpload!: ElementRef;
  @ViewChild('imagesUpload') imagesUpload!: ElementRef;
  // cotizaWishList: CotizaWish[] = [];
  filter = -1;
  loading: boolean = false;
  // private sub!: Subscription;

  constructor(
    private httpq: HttpQuoteService,
    //public mongodb: MongoBaseService,
    private nvg: NavObserverService,
    private dg: DialogService,
    private filesdtb: FileUploadService,
    private snkBar: MatSnackBar,
    public sharedvar: SharedVarsService,
    private data2excel: Data2excelService
    // private imageCompress: NgxImageCompressService
  ) { }

  ngOnInit() {
    this.sharedvar.getLoggedReady().subscribe(logged => {
      
      if (logged && this.sharedvar.user &&
        this.sharedvar.user.rol?.find(r => r === 'Q') && this.sharedvar.cotizaWishList.length === 0) {
          this.getHttpList(2);
        }
    });

  }

  private getHttpList(status: number) {
    // let agent_id = '';
    
    let agent_id = this.sharedvar.user._id || '';
    const sub = this.httpq.getQuoteByFilter(status, agent_id).subscribe((value: CotizaWish[]) => {
      // console.log(value);
      if (sub) sub.unsubscribe();
      if (value.length === 0 && status === 2) { return this.getHttpList(1); }
      this.sharedvar.cotizaWishList = value;
    });

  }

  getMenuVisible(rol: string): boolean {

    if (!this.sharedvar.user || !this.sharedvar.user.rol) return false;
    if (this.sharedvar.user.rol.find(ur => ur === rol)) return true;
    return false;
  }

  status2str(status: number): string {
    switch (status) {
      case -1: return 'ELIMINADAS'; break;
      case 1: return 'DISPONIBLES'; break;
      case 2: return 'TOMADAS'; break;
      case 4: return 'ENVIADAS-FINALIZADAS'; break;
    }
    return 'DESCONOCIDO';
  }

  onDetail(quote: CotizaWish) {

    if (!quote) return;
    this.sharedvar.selQuote = quote;
    this.nvg.onRouteDetail(`Editando: ${quote.client_name || 'Unknown'}`, '', 'quotedeta', true);

  }

  getClicked(event: any) {

    switch (event.index) {

      case 1:
        this.onFilter();
        break;

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

  onFilter() {
    const filterData: JsonFormData = {
      controls: [
        {
          name: 'filter',
          label: 'Filtrar por:',
          type: 'select',
          validators: {},
          style: 'w-full',
          selectOptions: [
            { key: '-1', value: 'ELIMINADAS' },
            { key: '1', value: 'DISPONIBLES' },
            { key: '2', value: 'TOMADAS' },
            { key: '4', value: 'ENVIADAS-FINALIZADAS' },
          ]
        },
        {
          name: 'consecutive',
          label: 'Documento:',
          type: 'text',
          validators: {},
        }
      ]
    }

    const ddta: DialogData = {
      title: 'Seleccionar Estado/Consecutivo',
      dgwidth: 300,
      dgheigth: 315,
      value: { filter: this.filter },
      schema: filterData
    }

    this.dg.aDefault(ddta).subscribe((result: any) => {

      if (result) {
        this.sharedvar.cotizaWishList = [];
        if (result.consecutive && result.consecutive.length > 0) {
          const sub = this.httpq.getQuote(result.consecutive).subscribe()
        } else { this.getHttpList(Number(result.filter)) }
        this.filter = Number(result.filter);
      }
    });

  }

  /*
  onVisible(status: number): boolean {
    if (this.filter < 0) return true;
    return status === this.filter;
  }
  */

  onExcel2Dtb(event: any) {
    
    if (this.excelUpload)
      this.excelUpload.nativeElement.click()
  }

  onDtb2Excel() {
    const sub = this.filesdtb.download2Excel().subscribe({
      next: (value) => {
        sub.unsubscribe();
        
        this.data2excel.jsonProd2Excel(value, 'Plantilla')
      },
    })
  }

  async onAllImgs() {
    const list =  await this.filesdtb.donwnloadallimgs();
    
    this.data2excel.jsonImage2Excel(list, 'listado de imágenes')
  }

  onFolder2Dtb(event: any) {
    if (this.excelUpload)
      this.excelUpload.nativeElement.click()
  }

  fileChangeEvent($event: any) {

    //console.log($event.target.files[0]);
  }

  /*
  onFileSelected(event: any) {
    console.log(event);
  }
  */

  onExcelFileSelected(fileEvent: any) {

    const file = fileEvent.target.files[0];
    this.loading = !this.loading;
    // console.log(file);

    this.filesdtb.upload2Excel(file)
    .subscribe({
      next: (value: any) => {
        
        // console.log(value);
        this.loading = false; // Flag variable 
        this.snkBar.open('Base de datos actualizada', 'Ok', { duration: 1000000 })
          .onAction().subscribe(ok => { location.reload(); });
      }
    })
    
    
    /*
    .subscribe(
      (event: any) => {
        
        console.log(event);
        // localStorage.setItem('user', JSON.stringify(this.mongodb.user));
        this.loading = false; // Flag variable 
        this.snkBar.open('Base de datos actualizada', 'Ok', { duration: 1000000 })
          .onAction().subscribe(ok => { location.reload(); });
      }
    );
    */
  }

  fileImagesChangeEvent(fileEvent: any) {
    //const file = fileEvent.target.files[0];
    this.loading = !this.loading;
    // console.log(file);

    this.filesdtb.uploadImages(fileEvent.target.files).subscribe(
      (event: any) => {

        // console.log(event);
        // localStorage.setItem('user', JSON.stringify(this.mongodb.user));
        this.loading = false; // Flag variable 
        this.snkBar.open('Base de datos actualizada', 'Ok', { duration: 1000000 })
          .onAction().subscribe(ok => { location.reload(); });
      }
    );
  }


  /*


  uploadAndcompressFiles() {
    const fileEvent: any
    return this.imageCompress
    .uploadMultipleFiles()
      .then((multipleOrientedFiles: UploadResponse[]) => {
        multipleOrientedFiles.forEach(imgcompress => {
          if (this.imageCompress.byteCount(imgcompress.image) > 1100) {
            this.imageCompress
            .compressFile(imgcompress.image, orientation, 100, 100, 1024, 1024)
            .then((result: DataUrl) => {
              this.imgResultAfterResize = result;
              console.warn(
                'Size in bytes is now:',
                this.imageCompress.byteCount(result)
              );
            });
          }
          
        });
      });
  }
  */

  /*
  uploadMultipleFiles() {
    return this.imageCompress
      .uploadMultipleFiles()
      .then((multipleOrientedFiles: UploadResponse[]) => {
        this.imgResultMultiple = multipleOrientedFiles;
        console.warn(`${multipleOrientedFiles.length} files selected`);
      });
  }
  */




  onUsers() {
    this.nvg.onRouteDetail('Usuarios', '', 'users', true);
  }

  onDelUsr() { }

  gotoCondicComer() {
    this.nvg.onRouteDetail('Configuración', '', 'quotedoc', true);
  }

  onFilterDate() {

    const filterData: JsonFormData = {
      controls: [
        {
          name: 'date_in',
          label: 'Fecha desde:',
          type: 'date',
          validators: { required: true },
        },
        {
          name: 'date_out',
          label: 'Fecha hasta:',
          type: 'date',
          validators: { required: true },
        },
      ]
    }

    const ddta: DialogData = {
      title: 'Informe',
      dgwidth: 300,
      dgheigth: 300,
      // value: { filter: this.filter },
      schema: filterData
    }

    this.dg.aDefault(ddta).subscribe((result: any) => {
      
      if (result && result.date_in && result.date_out) {
        const d1 = Date.parse(result.date_in);
        const d2 = Date.parse(result.date_out);
        this.sharedvar.cotizaWishList = [];
        const sub = this.httpq.getQuoteByDates(d1, d2).subscribe((list: CotizaWish[]) => {
          this.sharedvar.cotizaWishList = list;
        });
      }
    });

  }

  downloadTable2Excel() {
    const blob = new Blob([this.csvStream(this.sharedvar.cotizaWishList)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
    })
    var url = URL.createObjectURL(blob);
    window.open(url);
  }

  private csvStream(resultList: CotizaWish[]): string {
    const headerList = [
      'consecutivo',
      'Fecha',
      'Nombre del cliente',
      'Nombre del contacto',
      'Teléfono del cliente',
      'Correo del cliente',
      'Id Agente',
      'Nombre agente',
      'Estado'
    ]

    let csvString = '';
    
    headerList.forEach(h => csvString += `${h}\t`);
    csvString += '\n';
    resultList.forEach(pr => {
      csvString += '\n';
      csvString += pr.consecutive + '\t'
      csvString += new Date(pr.date || 0) + '\t'
      csvString += pr.client_name + '\t'
      csvString += pr.client_contact + '\t'
      csvString += pr.client_email + '\t'
      csvString += pr.client_phone + '\t'
      csvString += pr.agent_id + '\t'
      csvString += pr.agent_name + '\t'
      csvString += this.status2str(pr.status) + '\t'
      csvString += '\n';
    });
    return csvString;
    // this.htmlString += '</tbody></table>';
    // console.log(this.htmlString);

  }

  onEditList() {
    this.nvg.onRouteDetail('Editar Productos', '', 'catalog', true);
  }

}


