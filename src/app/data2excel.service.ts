import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Materiales } from './datatypes';
// import { FileSaverService } from 'ngx-filesaver';

interface SheetsInfo {
  name: string;
  header: any;
  rows: [{}];
}

@Injectable({
  providedIn: 'root'
})
export class Data2excelService {

  otherSheets: SheetsInfo[] = [];

  constructor() { }

  private getMateriales2Sheet(familia: string, matList: Materiales[]): any[] {
    console.log(matList);
    const  sheetData: any[] = [];
    matList.forEach((mt: Materiales) => {
      const row = {
        codigo: familia,
        codigo_mat: mt.codigo,
        color_nombre: mt.color_nombre,
        inventario: mt.inventario,
        precio: mt.precio,
        imagen_md_1: mt.imagenes && mt.imagenes[0]? this.getFlName(mt.imagenes[0].imagen.file_md)  : '',
        imagen_md_2: mt.imagenes && mt.imagenes[1]? this.getFlName(mt.imagenes[1].imagen.file_md)  : '',
        imagen_md_3: mt.imagenes && mt.imagenes[2]? this.getFlName(mt.imagenes[2].imagen.file_md)  : '',
        imagen_md_4: mt.imagenes && mt.imagenes[3]? this.getFlName(mt.imagenes[3].imagen.file_md)  : '',
        imagen_md_5: mt.imagenes && mt.imagenes[4]? this.getFlName(mt.imagenes[4].imagen.file_md)  : '',
      }
      sheetData.push(row);
    });
    return sheetData;
  }

  jsonProd2Excel(adata: any, filename: string, aheaders: any = []) {
    /*
    for (let i = 0; i < adata.length; i++) {
      delete (adata[i]['_id']);
      delete (adata[i]['__v']);
    }
    */
    
    if (aheaders.length === 0) {
      aheaders = Object.keys(adata[0]);
    }
    
    let listaMatSheet: Materiales[] = [];
    adata.forEach((itm: any) => {
      itm.imagen_sm = this.getFlName(itm.imagen_sm);
      itm.imagen_md = this.getFlName(itm.imagen_md);
      listaMatSheet = [...listaMatSheet, ...this.getMateriales2Sheet(itm.codigo, itm['materiales'])];
      delete (itm.materiales);
    });

    

    let ws = XLSX.utils.json_to_sheet(adata, { header: aheaders });
    let wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'producto');

    const listaMatSheetHeader = [
      'codigo',
      'codigo_mat',
      'color_nombre',
      'inventario',
      'precio',
      'imagen_md_1', 'imagen_md_2', 'imagen_md_3','imagen_md_4',	'imagen_md_5'
    ];
    ws = XLSX.utils.json_to_sheet(listaMatSheet, { header: listaMatSheetHeader });
    // const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'materiales');

    let exportFileName = `${filename}.xlsx`;
    XLSX.writeFile(wb, exportFileName)

  }

  private getFlName(name: string): string {
    return name.split('/').at(-1) || '';
  }

  jsonImage2Excel(adata: any, filename: string, aheaders: any = []) {
   
    if (aheaders.length === 0) {
      aheaders = Object.keys(adata[0]);
    }

    let ws = XLSX.utils.json_to_sheet(adata, { header: aheaders });
    let wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'imágenes');
    let exportFileName = `${filename}.xlsx`;
    XLSX.writeFile(wb, exportFileName)

  }

}



/*
let finalHeaders = ['colA', 'colB', 'colC'];
let data = [
  [ { colA: 1, colB: 2, colC: 3 }, { colA: 4, colB: 5, colC: 6 }, { colA: 7, colB: 8, colC: 9 } ],
  [ { colA:11, colB:12, colC:13 }, { colA:14, colB:15, colC:16 }, { colA:17, colB:18, colC:19 } ],
  [ { colA:21, colB:22, colC:23 }, { colA:24, colB:25, colC:26 }, { colA:27, colB:28, colC:29 } ]
];

data.forEach((array, i) => {
  let ws = XLSX.utils.json_to_sheet(array, {header: finalHeaders});
  let wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "SheetJS")
  let exportFileName = `workbook_${i}.xls`;
  XLSX.writeFile(wb, exportFileName)
})
*/
