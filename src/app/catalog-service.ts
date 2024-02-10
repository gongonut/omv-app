import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { CotizaWish, Etiqueta, Item, Subcategoria } from './datatypes';
// import { MongoBaseService } from './mongo-base.service';
import { SharedVarsService } from './shared-vars.service';
// import { env } from './environmets';
// import * as txt from './../assets/';

interface CategTree {
  jerarquia: string
  nombre: string
  subCategTree?: CategTree[];
}

export interface PictureData {
  // folder?: string; //El servidor de chat. Por ahora firebase
  name: string;
  file_name_: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class HttpCatalogService {

  // https://www.youtube.com/watch?v=AmF_BTzJdFY

  categTree: CategTree[] = [];
  productList: Item[] = [];

  constructor(
    private httpq: HttpClient,
    // private mongodb: MongoBaseService,
    private sharedvar: SharedVarsService
  ) { }


  getOMVCats(): Observable<Item[]> {
    return this.httpq.get<Item[]>(`${this.sharedvar.OMV_SERVER}catalog`);
  }

  getOMVCatsFromTxt(): Observable<Item[]> {
    return this.httpq.get<Item[]>(`${this.sharedvar.OMV_SERVER}catalog/txtdatabs`);
  }

  async updateItemDataAsync(item: Item): Promise<Item> {

    const pg = await firstValueFrom(
      this.httpq.put<Item>(`${this.sharedvar.OMV_SERVER}catalog/${item._id}`, item)
    );
    return pg;
  }

  async uploadImagesAsync(formData: any): Promise<any> {

    const pict = await firstValueFrom(
      this.httpq.post(this.sharedvar.OMV_SERVER + 'catalog/images2dtbase_', formData)
    )
    return pict;
  }

  // ......................................................................................

  async getOMVCatsDataPromise() {
    return new Promise(async resolve => {

      const sub = this.getOMVCats()
        // TODO: Habilitar el vínculo para economizar a omv
        // const sub = this.getOMVCatsFromTxt()
        .subscribe({
          next: (data) => {

            if (sub) { sub.unsubscribe(); }
            // console.log(data);
            // this.storage.itemList2Show = (data as { [key: string]: any })['results'] as Item[];
            this.productList = data as Item[];
            this.productList.sort((a, b) => { return a.descripcion_comercial.localeCompare(b.descripcion_comercial) });
            if (this.productList.length > 0) { this.resolveData(this.productList); }
            // this.storage.selCatalogTitle = catName;
            resolve(true);
          },
          error: (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log('An error occurred:', err.error.message);
            } else {
              console.log('Backend returned status code: ', err.status);
              console.log('Response body:', err.error);
            }
          },
          complete: () => { if (sub) { sub.unsubscribe(); } }
        });
    })
  }

  private resolveData(data: Item[]) {

    this.categTree = [];
    data.forEach((item: Item) => {

      item.existencia = 0;
      item.materiales.forEach((mat: any) => {
        item.precio = item.precio || mat.precio;
        item.existencia = item.existencia + (Number(mat.inventario) || 0);
      });
      if (item.etiquetas) {
        const etiqList: string[] = [];
        item.etiquetas.forEach((etiq: Etiqueta) => {
          if (etiq && etiq.nombre) { etiqList.push(etiq['nombre']) }
        });
      }


      // let catList = item.subcategoria_1;
      this.addToCatTreeSimple(item.subcategoria_1);
    });
    this.sortCat();

  }

  private sortCat() {

    this.categTree.sort((a, b) => { return a.nombre.localeCompare(b.nombre) });
    this.categTree.forEach(ct => {
      ct.subCategTree?.sort((a, b) => { return a.nombre.localeCompare(b.nombre) });
    })
  }

  addToCatTreeSimple(catItem: Subcategoria) {
    let categoria = this.categTree.find(cat => cat.nombre === catItem.categoria.nombre);
    if (!categoria) {
      categoria = {
        jerarquia: catItem.categoria.jerarquia,
        nombre: catItem.categoria.nombre,
        subCategTree: []
      };
      this.categTree.push(categoria);
    }
    let subCat = categoria.subCategTree?.find(sc => sc.nombre === catItem.nombre);
    if (!subCat) {
      categoria.subCategTree?.push({ jerarquia: catItem.jerarquia, nombre: catItem.nombre })
    }

    /*
    if (subcat2 && subcat2.length > 0) {
      let subcat = categoria.subcateg?.find(subcat => subcat === subcat2);
      if (!subcat) categoria.subcateg?.push(subcat2);
    }
    */
  }


  private getCatalogs(): Observable<CotizaWish[]> {
    return this.httpq.get<CotizaWish[]>(`${this.sharedvar.OMV_SERVER}Catalog`);
  }

  private getCatalog(id: string): Observable<CotizaWish> {
    return this.httpq.get<CotizaWish>(`${this.sharedvar.OMV_SERVER}Catalog/findOne/${id}`);
  }

  getCatalogByFilter(status: number, agent_id: string): Observable<CotizaWish[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('status', status);
    queryParams = queryParams.append('agent_id', agent_id);
    // const filter = {status, agent_id: this.sharedvar.user._id}
    return this.httpq.get<CotizaWish[]>(`${this.sharedvar.OMV_SERVER}Catalog/filter/data`, { params: queryParams });
  }

  getCatalogByDates(date_in: number, date_out: number): Observable<CotizaWish[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('date_in', date_in);
    queryParams = queryParams.append('date_out', date_out);
    // const filter = {status, agent_id: this.sharedvar.user._id}
    return this.httpq.get<CotizaWish[]>(`${this.sharedvar.OMV_SERVER}Catalog/filter/datebetween`, { params: queryParams });
  }

  createCatalog(Catalog: CotizaWish): Observable<CotizaWish> {
    return this.httpq.post<CotizaWish>(`${this.sharedvar.OMV_SERVER}Catalog`, Catalog);
  }

  deleteCatalog(id: string): Observable<CotizaWish> {
    return this.httpq.delete<CotizaWish>(`${this.sharedvar.OMV_SERVER}Catalog/${id}`);
  }

  resendMailCatalog(id: string, Catalog: CotizaWish): Observable<CotizaWish> {

    return this.httpq.put<CotizaWish>(`${this.sharedvar.OMV_SERVER}Catalog/resend/${id}`, Catalog);
  }

  updateCatalog(id: string, Catalog: CotizaWish): Observable<CotizaWish> {
    return this.httpq.put<CotizaWish>(`${this.sharedvar.OMV_SERVER}Catalog/${id}`, Catalog);
  }

  getCssData(idcss: string) {
    // const URL = '../assets/Catalog.txt';
    return this.httpq.get(idcss, { responseType: 'text' });
    /*
    subscribe(data => {
      const dataArray = data as [];
      if (dataArray.length > 0) {
        this.mongodb.marpicoItems = dataArray;
      }
    })
    */
  }

  b64toBlob(data: any, contentType = '', sliceSize = 512) {

    // const b64Data = data.substr('data:image/jpeg;base64,'.length, data.length);
    // const byteCharacters = b64Data.toString('base64');

    const byteCharacters = atob(data.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    // const byteCharacters = atob(b64Data);

    // const byteCharacters = data.toString('base64');
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  async updateItemData(item: Item, pictList: PictureData[] | null) {
    
    if (pictList) {
      const formData = new FormData();
      for (let i = 0; i < pictList.length; i++) {
        formData.append("files", pictList[i].data, pictList[i].file_name_);
      }
      if (pictList.length > 0)  await this.uploadImagesAsync(formData);
    }
    await this.updateItemDataAsync(item);
  }

}
