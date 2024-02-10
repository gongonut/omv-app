import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MongoBaseService } from './mongo-base.service';
// import { Item } from './datatypes';

@Injectable({
  providedIn: 'root'
})


// implements HttpInterceptor
export class HttpMapicoService implements HttpInterceptor {
  private api_key = 'KlRAzNmCqZFnJTEnOPmyRC2t2WLs8xylfGMbogjGnfcb02wlvaUYXIeiNaLAQKAI';
  private url = 'https://marpicoprod.azurewebsites.net/api/inventarios';

  force = false;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log("intercepted request ... ");

    return next.handle(
      req.clone({
        setHeaders: {
          'Content-Type': 'application/json',
          'Authorization': 'Api-Key ' + this.api_key
        }
      }));
  }

  constructor(private http: HttpClient, private mongodb: MongoBaseService) { }

  getFullData() {
    const aheaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Api-Key ' + this.api_key
    });

    const requestOptions = {
      headers: aheaders,
      // withCredentials: true
    };
    const suburl = '/materialesAPI';
    return this.http.get<any[]>(`${this.url}${suburl}`, requestOptions)
  }


  /*
  getDataPrueba() {
    const URL = '../assets/articulos.json';
    this.http.get(URL).subscribe(data => {
      const dataArray = data as [];
      if (dataArray.length > 0) {
        this.mongodb.marpicoItems = dataArray;
      }
    })
  }
  */

  // https://contactmentor.com/javascript-map-array-of-objects/
  getData() {
    const sub = this.getFullData()
      .subscribe(data => {
        //TODO: OJO THIS.getDataPrueba() LO DEMAS DESAPARECE
        
        if (sub) { sub.unsubscribe(); }
        // console.log(data);
        
        const dataArray = data as [];
        if (dataArray.length > 0) {

        }

      },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            
            //A client-side or network error occurred.
            console.log('An error occurred:', err.error.message);
          } else {
            //Backend returns unsuccessful response codes such as 404, 500 etc.
            
            console.log('Backend returned status code: ', err.status);
            console.log('Response body:', err.error);
          }
        });
  }

  
}

/*
getDataPrueba() {
    const URL = '../assets/articulos.json';
    this.http.get(URL).subscribe(data => {

      const dataArray = data as [];

      if (dataArray.length > 0) {
        const marpicoList = dataArray.map(({
          familia, descripcion_comercial, descripcion_larga, imagenes, material, materiales,
          etiquetas, temas, medidas_diametro, area_impresion, subcategoria_1, subcategoria_2
        }) => {
          const imgs = imagenes as [];
          const imagenList: ImagenList[] = [];
          imgs.forEach((itm: any) => {
            imagenList.push({ file_md: itm.imagen.file_md, file_sm: itm.imagen.file_sm })
          });
          let value = 0;
          let invent = 0;
          const matls = materiales as [];
          const materialList: Materiales[] = [];
          matls.forEach((itm: any) => {

            const imgMatList: ImagenList[] = [];

            itm.imagenes.forEach((itm: any) => {
              imgMatList.push({ file_md: itm.imagen.file_md, file_sm: itm.imagen.file_sm })
            });
            value = itm.precio || 0;
            invent = invent + (itm.inventario || 0);
            materialList.push({
              codigo: itm.codigo, nombre: itm.color_nombre,
              inventario: itm.inventario || 0,
              precio: itm.precio || 0,
              descuento: itm.descuento || 0,
              imagenes: imgMatList
            })
          });
          const etiqCopy = etiquetas as [];
          const etiqList: string[] = [];
          etiqCopy.forEach(element => {etiqList.push(element['nombre'])});


          let catList = subcategoria_1 as { nombre: string, categoria: { nombre: string } };
          const subcateg_1 = catList.nombre || '';
          const categ = catList.categoria.nombre;
          catList = subcategoria_2 as { nombre: string, categoria: { nombre: string } };
          let subcateg_2 = '';
          if (catList) { subcateg_2 = catList.nombre || '' }

          this.storage.addToCatTree(categ, subcateg_1, subcateg_2);
          return {
            familia, descripcion_comercial, descripcion_larga, imagenList, material,
            medidas: medidas_diametro, area_imp: area_impresion, etiqList, temasList: temas,
            materialList, categ, subcateg_1, subcateg_2, precio: value, inventario: invent
          }
        });
        
        this.storage.itemList2Show = marpicoList;
        this.storage.addUpdateLocalItemList(marpicoList,'MARPICO');
      }

      // console.log(this.storage.itemList2Show);
    });

  }
  */