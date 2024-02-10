import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress-legacy';
import { HttpCatalogService, PictureData } from 'src/app/catalog-service';
import { JsonFormData } from 'src/app/components/dynamic-form/dynamic-form.component';
import { Data2excelService } from 'src/app/data2excel.service';
import { Categoria, Item, Materiales, Subcategoria } from 'src/app/datatypes';
import { DialogData, DialogService } from 'src/app/dialog.service';
import { FileUploadService } from 'src/app/file-upload.service';
// import { DialogData } from 'src/app/dialog.service';
import { SelectData, SelectItem } from 'src/app/modal/select-dialog/select-dialog.component';
import { SeldialogService } from 'src/app/seldialog.service';
import { SharedVarsService } from 'src/app/shared-vars.service';



@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  itemData: JsonFormData = {
    controls: [
      {
        name: 'familia',
        label: 'Código:',
        type: 'text',
        validators: { required: true }
      },
      {
        name: 'descripcion_comercial',
        label: 'Descripción comercial:',
        type: 'text',
        // sideBtn: 'visibility',
        style: 'w-10/12',

        validators: { required: true }
      },
      {
        name: 'descripcion_larga',
        label: 'Descripción larga:',
        type: 'textarea',
        totalRows: 4,

        style: 'w-10/12',
        validators: { required: true }
      },
      {
        name: 'lista_colores',
        label: 'Lista de colores:',
        type: 'text',
        // sideBtn: 'visibility',
        // style: {'width':'100px','background-color': 'white'},
        validators: {}
      },
      {
        name: 'precio',
        label: 'Precio:',
        type: 'number',
        validators: { required: true }
      },
      /*
      {
        name: 'existencia',
        label: 'existencia:',
        type: 'number',
        validators: { required: true }
      },
      */
      {
        name: 'categ_titulo',
        label: 'Categoría:',
        type: 'text',
        sideBtn: 'list',
        sideBtn2: 'edit',
        validators: { required: true }
      },
      {
        name: 'subcateg_titulo',
        label: 'Subcategoría:',
        type: 'text',
        sideBtn: 'list',
        sideBtn2: 'edit',
        validators: { required: true }
      },
      /*
      {
        name: 'categoria',
        label: 'Categoría:',
        type: 'text',
        validators: { required: true }
      },
      {
        name: 'sub_categoria',
        label: 'Sub Categoría:',
        type: 'text',
        validators: { required: true }
      },
      */
    ]
  }

  materialData: JsonFormData = {
    controls: [
      {
        name: 'codigo',
        label: 'Código:',
        type: 'text',
        validators: { required: true }
      },
      {
        name: 'color_nombre',
        label: 'Descripción comercial:',
        type: 'text',
        // sideBtn: 'visibility',
        // style: {'width':'100px','background-color': 'white'},
        validators: { required: true }
      },
      /*
      {
        name: 'precio',
        label: 'Precio:',
        type: 'number',
        validators: { required: true }
      },
      */
      {
        name: 'inventario',
        label: 'existencia:',
        type: 'number',
        validators: { required: true }
      }
      /*
      {
        name: 'categoria',
        label: 'Categoría:',
        type: 'text',
        validators: { required: true }
      },
      {
        name: 'sub_categoria',
        label: 'Sub Categoría:',
        type: 'text',
        validators: { required: true }
      },
      */
    ]
  }

  @ViewChild('editControlTrigger') editControlTrigger!: MatMenuTrigger;
  @ViewChild('excelUpload') excelUpload!: ElementRef;
  @ViewChild('imagesUpload') imagesUpload!: ElementRef;
  // pictList: { [index: string]: any } = {};
  pictList: PictureData[] = [];
  private showAreaState = {
    item: '',
    show_item: false,
    show_materiales: false,
    show_material_item: false,
    material_item: '',
    sel_categ: '',
    sel_categ_jerarquia: '',
    sel_subcat: '',
    sel_subcateg_jerarquia: '',
  }
  loading: boolean = false;
  itemreset = 0;
  itemResult: any;
  // itemResultValues: any;
  materialResult: any;


  constructor(
    public httpCat: HttpCatalogService,
    public sharedvar: SharedVarsService,
    private sanitizer: DomSanitizer,
    private imageCompress: NgxImageCompressService,
    private ds: SeldialogService,
    private dg: DialogService,
    private snkBar: MatSnackBar,
    private filesdtb: FileUploadService,
    private data2excel: Data2excelService
  ) { }

  async ngOnInit() {

    await this.httpCat.getOMVCatsDataPromise();

    if (this.httpCat.productList.length > 0) {
      this.startItemAdditionalVals(this.httpCat.productList[0].familia);
    }

  }

  getClicked(event: any) {

    switch (event.index) {

      case 1:
        
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

  onGetData(result: any) {
    if (result['_btnclick_'] && result['_propName_'] && result['_propName_'].length > 0) {
      result['_btnclick_'] = false;
      switch (result['_propName_']) {
        case 'categ_titulo':
          result['_propName_'] = '';
          this.getCategList();
          return;
        case 'subcateg_titulo':
          result['_propName_'] = '';
          this.getSubCategList();
          return;
      }
    }
    if (result['_btnclick_2_'] && result['_propName_'] && result['_propName_'].length > 0) {
      result['_btnclick_2_'] = false;
      switch (result['_propName_']) {
        case 'categ_titulo':
          result['_propName_'] = '';
          this.editCategList(result['categ_titulo']);
          return;
        case 'subcateg_titulo':
          result['_propName_'] = '';
          this.editSubCategList(result['categ_titulo'], result['subcateg_titulo']);
          return;
      }
    }


    this.sharedvar.updatePropResult(this.itemResult, result);

  }

  addMateriales() {
    const codigo = this.itemResult.familia + '_' + (this.itemResult.materiales.length || 0).toString();
    const materialesData: JsonFormData = {
      controls: [
        {
          name: 'codigo',
          label: 'Código:',
          type: 'text',
          validators: { required: true }
        },
        {
          name: 'color_nombre',
          label: 'Color/Textura:',
          type: 'text',
          // sideBtn: 'visibility',
          style: 'w-10/12',
          validators: { required: true }
        },
        {
          name: 'precio',
          label: 'Precio:',
          type: 'number',
          validators: { required: true }
        },

        {
          name: 'inventario',
          label: 'Inventario:',
          type: 'number',
          validators: { required: true }
        },

      ]
    }

    const values: Materiales = {
      codigo,
      color_nombre: 'nombre del color o textura',
      imagenes: [],
      precio: 100,
      inventario: 1,
      descuento: 0
    }

    const ddta: DialogData = {
      title: 'Editar encabezado',
      value: values,
      schema: materialesData,
      dgheigth: 450
    }

    this.dg.aDefault(ddta).subscribe((result: any) => {
      if (result) {
        let matitem = this.itemResult.materiales.find((im: Materiales) => im.codigo === result['codigo']);
        if (matitem) {
          this.snkBar.open(`El código ya existe`, 'Ok', { duration: 3000 });
          return;
        }
        this.sharedvar.updatePropResult(result, values)
        this.itemResult.materiales.push(values);
        this.snkBar.open('Puede agregar imágenes al nuevo material', 'Ok', { duration: 3000 });
      }
    });
  }

  deleteMateriales(itemMat: Materiales) {
    const index = this.itemResult.materiales.findIndex((im: Materiales) => im.codigo === itemMat.codigo);
    if (index >= 0) {
      this.snkBar.open(`Eliminar ${itemMat.codigo}-${itemMat.color_nombre}`, 'Continuar', { duration: 3000 })
        .onAction().subscribe(async ok => {
          this.itemResult.materiales.splice(index, 1);
        });
    }
  }

  onGetMaterialData(result: any) {
    this.sharedvar.updatePropResult(this.materialResult, result);
    this.itemResult.existencia = 0;
    this.itemResult.materiales.forEach((mat: any) => {
      // this.itemResult.precio = mat.precio || this.itemResult.precio;
      this.itemResult.existencia = this.itemResult.existencia + (Number(mat.inventario) || 0);
    });

  }

  private getCategList() {
    const valuelst: SelectItem[] = [];
    // const pollSel = this.sharedvar.pollSelected as Poll;
    this.httpCat.categTree.forEach((ct) => {
      if (ct.nombre && ct.nombre.length > 0) {
        valuelst.push({ selected: ct.nombre === this.showAreaState.sel_categ, myid: ct.jerarquia, name: ct.jerarquia + ':' + ct.nombre });
      }
    });
    const adata: SelectData = {
      title: 'Seleccione Categoría',
      // dgwidth: 300,
      dgheigth: 450,
      viewfilter: false,
      viewAdd: true,
      multiSelect: false,
      valuelst
    }
    this.ds.aSelectDefault(adata).subscribe((result: any) => {
      if (result) {

        if (result['_new_'] === true) {
          this.addEditNewCategory(null);
          return;
        }
        this.showAreaState.sel_categ = result[0].name.split(':')[1];
        this.showAreaState.sel_categ_jerarquia = result[0].myid;
        this.showAreaState.sel_subcat = '-';
        this.showAreaState.sel_subcateg_jerarquia = '';
        this.setItemAdditionalVals();
      }
    });
  }
  private editCategList(catname: string) {

    const cat = this.httpCat.categTree.find(ct => ct.nombre === catname);
    if (cat) {
      this.addEditNewCategory(cat, true);
    }
  }

  private addEditNewCategory(catItem: Categoria | null, disabled = false) {
    const prevName = catItem?.nombre || '';
    const categSchema: JsonFormData = {
      controls: [
        {
          name: 'jerarquia',
          label: 'Código:',
          type: 'text',
          disabled,
          validators: { required: true }
        },
        {
          name: 'nombre',
          label: 'Nombre:',
          type: 'text',
          validators: { required: true }
        },
      ]
    }

    if (catItem === null) {
      catItem = { jerarquia: '000', nombre: '' }
    }

    const ddta: DialogData = {
      title: 'Categoría',
      schema: categSchema,
      value: catItem,
      dgheigth: 310,
      dgwidth: 300
    }

    this.dg.aDefault(ddta).subscribe((result: any) => {
      if (result) {
        // console.log(result)

        this.showAreaState.sel_categ = result.nombre;
        this.showAreaState.sel_categ_jerarquia = result.jerarquia;
        this.showAreaState.sel_subcat = '-';
        this.httpCat.categTree.push({
          jerarquia: result.jerarquia, nombre: result.nombre, subCategTree: []
        })
        this.setItemAdditionalVals();
        if (disabled) {
          this.updateItemsCat(prevName, result.nombre);
        }

      }
    });
  };

  private updateItemsCat(prevNombre: string, nombre: string) {
    this.httpCat.productList.forEach(async (item: Item) => {
      if (item.subcategoria_1.categoria.nombre === prevNombre) {
        item.subcategoria_1.categoria.nombre = nombre;
        await this.httpCat.updateItemData(item, null);
      }
    })
  }


  private getSubCategList() {
    const valuelst: SelectItem[] = [];
    const categ = this.httpCat.categTree.find(ct => ct.nombre === this.showAreaState.sel_categ);
    if (!categ) return
    // const pollSel = this.sharedvar.pollSelected as Poll;
    categ.subCategTree?.forEach((st) => {
      if (st.nombre && st.nombre.length > 0) {
        valuelst.push({ selected: st.nombre === this.showAreaState.sel_categ, myid: st.jerarquia, name: st.jerarquia + ':' + st.nombre });
      }
    });
    const adata: SelectData = {
      title: 'Seleccione Subcategoría',
      // dgwidth: 300,
      dgheigth: 450,
      viewfilter: false,
      viewAdd: true,
      multiSelect: false,
      valuelst
    }
    this.ds.aSelectDefault(adata).subscribe((result: any) => {

      if (result) {
        if (result['_new_'] === true) {
          this.addEditSubCategLis(null);
          return;
        }

        const item = this.httpCat.productList.find(pl => pl.familia === this.showAreaState.item);
        if (!item) return;

        item.subcategoria_1.jerarquia = result[0].myid;
        item.subcategoria_1.nombre = result[0].name.split(':')[1];
        item.subcategoria_1.categoria.nombre = this.showAreaState.sel_categ;
        item.subcategoria_1.categoria.jerarquia = this.showAreaState.sel_categ_jerarquia;
        this.showAreaState.sel_subcat = result[0].name.split(':')[1];
        this.setItemAdditionalVals();
      }
    });
  }

  private editSubCategList(catnombre: string, subcatname: string) {
    const cat = this.httpCat.categTree.find(ct => ct.nombre === catnombre);
    if (cat) {
      const subcat = cat.subCategTree?.find(sc => sc.nombre === subcatname);
      if (subcat) {
        this.addEditSubCategLis(subcat, true);
        // this.addEditNewCategory(cat, true);
      }
    }

  }

  private addEditSubCategLis(catItem: Categoria | null, disabled = false) {
    const prevNombre = catItem?.nombre || '';
    const categSchema: JsonFormData = {
      controls: [
        {
          name: 'jerarquia',
          label: 'Código:',
          type: 'text',
          disabled,
          validators: { required: true }
        },
        {
          name: 'nombre',
          label: 'Nombre:',
          type: 'text',
          validators: { required: true }
        },
      ]
    }

    if (catItem === null) {
      catItem = { jerarquia: '000', nombre: '' }
    }

    const ddta: DialogData = {
      title: 'Subactegoría',
      schema: categSchema,

      value: catItem,
      dgheigth: 310,
      dgwidth: 300
    }

    this.dg.aDefault(ddta).subscribe((result: any) => {
      if (result) {
        console.log(result)

        this.showAreaState.sel_subcat = result.nombre;
        this.showAreaState.sel_subcateg_jerarquia = result.jerarquia;
        // this.showAreaState.sel_categ_jerarquia = result.jerarquia;
        // this.showAreaState.sel_subcat = '-';
        const catItem = this.httpCat.categTree.find(ct => ct.nombre === this.showAreaState.sel_categ);
        if (catItem) {
          const subcatitem = catItem.subCategTree?.find(sc => sc.nombre === result.nombre);
          if (subcatitem) { subcatitem.nombre = result.nombre, subcatitem.jerarquia = result.jerarquia; } else {
            catItem.subCategTree?.push({ nombre: result.nombre, jerarquia: result.jerarquia });
          }
          this.httpCat.categTree.push({
            jerarquia: result.jerarquia, nombre: result.nombre, subCategTree: []
          })
          this.itemResult.subcategoria_1.jerarquia = result.jerarquia;
          this.itemResult.subcategoria_1.nombre = result.nombre;
          this.itemResult.subcategoria_1.categoria.nombre = this.showAreaState.sel_categ;
          this.itemResult.subcategoria_1.categoria.jerarquia = this.showAreaState.sel_categ_jerarquia;
          // this.showAreaState.sel_subcat = result[0].name.split(':')[1];

          this.setItemAdditionalVals();
          if (disabled) {
            this.updateItemsSubcat(this.showAreaState.sel_categ, prevNombre, result.nombre);
          }
        }
      }
    });
  }

  private updateItemsSubcat(catname: string, prevNombre: string, nombre: string) {
    this.httpCat.productList.forEach(async (item: Item) => {
      if (item.subcategoria_1.categoria.nombre === catname && item.subcategoria_1.nombre === prevNombre) {
        item.subcategoria_1.nombre = nombre;
        await this.httpCat.updateItemData(item, null);
      }
    })
  }

  getExpand(code: string, area: string): boolean {
    let result = false;
    switch (area) {
      case 'item':
        result = this.showAreaState.item === code && this.showAreaState.show_item;
        break;
      case 'materiales':
        result = this.showAreaState.item === code && this.showAreaState.show_materiales;
        break;
      default:
        result = this.showAreaState.material_item === code && this.showAreaState.show_material_item;
        break;
    }
    return result;
  }

  async showArea(code: string, area: string) {

    if (area === 'item' || area === 'materiales') {
      if (this.showAreaState.item !== '' && this.showAreaState.item !== code) {
        // await this.saItem();
      }
      if (this.showAreaState.item !== code) {
        this.showAreaState.item = code;
        this.startItemAdditionalVals(code);
      }
    }
    switch (area) {
      case 'item':
        this.showAreaState.show_item = !this.showAreaState.show_item;
        this.showAreaState.show_materiales = false;
        this.showAreaState.show_material_item = false;


        break;
      case 'materiales':
        this.showAreaState.show_materiales = true;
        this.showAreaState.show_material_item = false;
        this.showAreaState.show_item = false;
        break;
      default: // mat_select
        this.showAreaState.show_material_item = !this.showAreaState.show_material_item;
        if (this.showAreaState.material_item !== code) {
          this.showAreaState.material_item = code
          this.startMaterialData(code);
        }
        break;
    }
  }

  private startMaterialData(code: string): void {
    const material = this.itemResult.materiales.find((m: Materiales) => m.codigo === code);
    if (material) {
      this.materialResult = material;
    }
  }

  /*
  private UpdateMaterialData(code: string): void {
    const index = this.itemResult.materiales.findIndex((m: Materiales) => m.codigo === code);
    if (index >= 0) {
      this.itemResult.materiales[index] = this.materialResult;
    }
  }
  */

  async ask2Save() {
    this.snkBar.open(`Salvar datos?"`, 'Continuar', { duration: 3000 })
      .onAction().subscribe(async ok => {
        await this.saveItem();
      });
  }

  private async saveItem() {
    this.showArea(this.itemResult.familia, 'item');

    console.log(this.itemResult);
    const index = this.httpCat.productList.findIndex(pl => pl.familia === this.itemResult.familia);
    if (index < 0) return;

    let name = `${this.itemResult.familia}__0`;
    let pict = this.findPictElement(name);
    if (pict) {
      const filename = `${this.sharedvar.OMV_SERVER}catalog/${pict.file_name_}.JPEG`;
      pict.file_name_ = filename;
      this.itemResult.imagen.imagen.file_md = filename;
      this.itemResult.imagen.imagen.file_sm = filename;
      pict.data = this.httpCat.b64toBlob(pict.data, 'image/JPEG');
    }

    this.itemResult.materiales.forEach((mt: Materiales) => {
      for (let suf = 0; suf < 6; suf++) {
        name = `${this.itemResult.familia}_${mt.codigo || ''}_${suf}`
        pict = this.findPictElement(name);
        if (pict) {
          const filename = `${this.sharedvar.OMV_SERVER}catalog/${pict.file_name_}.JPEG`;
          pict.file_name_ = filename;
          
          if (suf >= mt.imagenes.length) {
            const imagen = { file: '', file_sm: filename, file_md: filename }
            const imagenes = {
              id: suf, imagen, orden: suf, nombre_original: mt.color_nombre
            }
            mt.imagenes.push(imagenes);
          } else {
            mt.imagenes[suf].imagen.file_md = filename;
            mt.imagenes[suf].imagen.file_sm = filename;
          }
          pict.data = this.httpCat.b64toBlob(pict.data, 'image/jpeg');
        }
      }
    });
    this.httpCat.productList[index] = { ...this.itemResult };
    await this.httpCat.updateItemData(this.itemResult, this.pictList);
    this.pictList = [];
  }

  private startItemAdditionalVals(familia: string) {

    const item = this.httpCat.productList.find(pl => pl.familia === familia);
    if (!item) return;
    this.itemResult = item;
    this.showAreaState.sel_categ = item.subcategoria_1.categoria.nombre;
    this.showAreaState.sel_subcat = item.subcategoria_1.nombre;
    this.setItemAdditionalVals();
    this.pictList = [];
  }

  private setItemAdditionalVals() {
    this.itemResult['existencia'] = Number(this.itemResult['existencia']);
    this.itemResult['precio'] = Number(this.itemResult['precio']);
    this.itemResult['categ_titulo'] = this.showAreaState.sel_categ;
    this.itemResult['subcateg_titulo'] = this.showAreaState.sel_subcat || '-';
    this.itemResult = { ...this.itemResult };
    this.itemreset++;
  }

  getComImage(item: Item, material: Materiales | null, index: number = 0): any {

    const name = `${item.familia}_${material?.codigo || ''}_${index}`;
    const localRoute = this.findPictElement(name);
    if (localRoute) { return this.sanitizer.bypassSecurityTrustUrl(localRoute.data); }
    if (material) {
      if (material.imagenes && material.imagenes[index]) {
        return material.imagenes[index].imagen.file_md;
      }
      return '';
    }
    return item.imagen.imagen.file_md;
  }

  fileChangeEvent(item: Item, material: Materiales | null, index: number = 0, $event: any = null) {


    const name = `${item.familia}_${material?.codigo || ''}_${index}`;
    this.imageCompress.uploadFile().then(
      ({ image, orientation, fileName }) => {
        // console.log(fileName);
        fileName = fileName.split('.').at(-2) || '';
        // this.imgResult = image;
        console.log("Size in bytes of the uploaded image was:", this.imageCompress.byteCount(image));
        // this.link = image; // TRATAR ESTE TEMA DEL LINK
        this.imageCompress
          .compressFile(image, orientation, 100, 100, 550, 550) // 50% ratio, 50% quality
          .then(
            (compressedImage) => {
              // this.imgResult = compressedImage;
              const localRoute = this.findPictElement(name);
              if (localRoute) { localRoute.data = compressedImage; } else {
                this.pictList.push({ name: name, file_name_: fileName.toUpperCase(), data: compressedImage });
              }
              // this.pictList[name] = compressedImage;
              // console.log("Size in bytes after compression is now:", this.imageCompress.byteCount(compressedImage));
            }
          );
      }
    );
  }

  private findPictElement(name: string): PictureData | undefined {
    return this.pictList.find(pl => pl.name === name);
  }

  // ..................................................................................................

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
}
