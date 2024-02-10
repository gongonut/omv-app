import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface SelectItem {
  selected?: boolean;
  myid?: string;
  name?: string;
  hide1?: string; // Información adicional si necesitamos
  hide2?: string; // Información adicional si necesitamos
  hide3?: string; // Información adicional si necesitamos
}

export interface SelectData {
  title?: string;
  valuelst?: SelectItem[];
  dgheigth?: number;
  viewfilter: boolean;
  viewAdd?: boolean;
  // viewedit?: boolean;
  multiSelect: boolean;
}

@Component({
  selector: 'app-select-dialog',
  templateUrl: './select-dialog.component.html',
  styleUrls: ['./select-dialog.component.scss']
})
export class SelectDialogComponent {
  // private fullvaluelst: SelectItem[] = [];
  // filterlst: SelectItem[] = [];
  // private fullValueLst: SelectItem[] = [];
  filtertext = '';
  private selectedOptions: SelectItem[] = []
  chekAll = false;
  private viewSelected = false;
  multiSelect = false;

  constructor(
    public dialogRef: MatDialogRef<SelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectData) {
    dialogRef.disableClose = true;
    this.multiSelect = data.multiSelect || false;
  }

  onNew(): void{
    this.dialogRef.close({_new_: true});
  }

  /*
  onEdit(): void{
    this.selectedOptions = [];
    this.data.valuelst?.forEach(item => {
      if (item.selected) {this.selectedOptions.push(item)}
    })
    if (this.selectedOptions.length > 0) {this.dialogRef.close({_edit_: this.selectedOptions[0]});}
    
  }
  */

  onChekAll() {
    this.chekAll = !this.chekAll;
    this.data.valuelst?.forEach(vl => {vl.selected = this.chekAll})
  }

  getViewFilter(item: SelectItem): boolean {
    if (this.viewSelected) {return item.selected || false}
    const txt = this.filtertext.toUpperCase();
    if (txt.length === 0 || (item && item.name && (item.name.toUpperCase().includes(txt)))) return true;
    return false;
  }

  onSelected(item: SelectItem) {
    if (this.multiSelect) return;
    this.selectedOptions = [item];
    this.dialogRef.close(this.selectedOptions);
  }

  onSave(): void {
    this.selectedOptions = [];
    this.data.valuelst?.forEach(item => {
      if (item.selected) {this.selectedOptions.push(item)}
    })
    this.dialogRef.close(this.selectedOptions);
  }

  onDismiss(): void {
    this.dialogRef.close();
  }

  getView(): string {
    return this.viewSelected? 'done' : 'visibility';
  }

  onViewSelected(view: boolean) {
    
    this.viewSelected = view;
  }

}
