import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  // ChangeDetectionStrategy,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

interface JsonFormValidators {
  min?: number;
  max?: number;
  required?: boolean;
  email?: boolean;
  pattern?: string;
  nullValidator?: boolean;
}

export interface SelOptions {
  key: string,
  value?: any;
}

export interface JsonFormControl {
  avalue?: string;
  default?: any;
  description?: string;
  disabled?: boolean;
  label: string;
  name: string;
  selectOptions?: SelOptions[];
  sideBtn?: string; // si type Link, ruta
  sideBtn2?: string; // si type Link, ruta
  placeholder?: string;
  style?: {};
  totalRows?: number;
  type: string;
  validators: JsonFormValidators;
  tags?: { [index: string]: any }; // Información adicional
}
export interface JsonFormData {
  controls?: JsonFormControl[];
}
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnChanges {
  @Input() jsonFormData!: JsonFormData;
  @Input() values: any = {};
  @Input() editBtn: string = '';
  @Input() reset: number = 0;
  // @Input() changeCtrl: any = {};
  @Output() result = new EventEmitter<{ key: string, value: string }[]>();
  @Output() valid = new EventEmitter<boolean>();
  // @Output() valid = new EventEmitter<boolean>();
  checBoxLists: { [key: string]: boolean } = {}
  public dynaForm: FormGroup = this.fb.group({});
  // private bckjsonFormData: JsonFormData = {};
  // private resultList!: any;
  // private keyValues!: SelOptions[];
  private resetstate = false;

  constructor(private fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['reset'] && !changes['reset'].firstChange
      && this.jsonFormData && this.jsonFormData.controls
      && '_valid_' in this.values) {
      this.createForm(this.jsonFormData.controls, this.values);
      this.resetstate = true;
    } else if (changes['jsonFormData'] && !changes['jsonFormData'].firstChange
      && this.jsonFormData && this.jsonFormData.controls
      && changes['values'] && !changes['values'].firstChange) {
      this.createForm(this.jsonFormData.controls, changes['values'].currentValue);
    } else if (changes['values'] && !changes['values'].firstChange) {
      this.editValues(changes['values'].currentValue);
    } else {
      if (this.jsonFormData && this.jsonFormData.controls) { this.createForm(this.jsonFormData.controls, null); }
    }
    this.onSetData('');
  }

  private editValues(values: any) {
    Object.keys(values).forEach(key => {
      this.dynaForm.patchValue({ [key]: values[key] });
    });

  }

  private createForm(controls: JsonFormControl[], reset: any = null) {

    const deleteList = { ...this.dynaForm.value };
    const resultList = reset ? reset : JSON.parse(JSON.stringify(this.dynaForm.value));
    // const resultList = JSON.parse(JSON.stringify(this.dynaForm.value));
    for (const key in deleteList) { this.dynaForm.removeControl(key); }
    for (const control of controls) {
      const validatorsToAdd = [];
      for (const [key, value] of Object.entries(control.validators)) {
        switch (key) {
          case 'min':
            validatorsToAdd.push(Validators.min(value));
            break;
          case 'max':
            validatorsToAdd.push(Validators.max(value));
            break;
          case 'required':
            if (value) {
              validatorsToAdd.push(Validators.required);
            }
            break;
          case 'email':
            if (value) {
              validatorsToAdd.push(Validators.email);
            }
            break;
          case 'pattern':
            validatorsToAdd.push(Validators.pattern(value));
            break;
          case 'nullValidator':
            if (value) {
              validatorsToAdd.push(Validators.nullValidator);
            }
            break;
          default:
            break;
        }
      }


      if (resultList[control.name] && resultList[control.name].length > 0) {
        control.avalue = resultList[control.name];
      } else {
        if (this.values && this.values[control.name] !== undefined) {
          control.avalue = this.values[control.name]
        } else if (control.default) {
          control.avalue = control.default
        } else { control.avalue = '' }
      }
      if (!this.dynaForm.contains(control.name)) {

        if ('datetime-local'.includes(control.type) && control.avalue) {
          let adate = new Date(control.avalue);
          adate.setMinutes(adate.getMinutes() - adate.getTimezoneOffset());
          switch (control.type) {
            case 'date':
              control.avalue = adate.toISOString().slice(0, 10);
              break;
            case 'datetime-local':
              control.avalue = adate.toISOString().slice(0, -1);
              break;
          }
        }
        this.dynaForm.addControl(control.name, this.fb.control(control.avalue, validatorsToAdd));
        // if (control.disabled === true) { this.dynaForm.controls[control.name].disable(); }
      }
    }
  }

  ongetStyleClass(control: JsonFormControl): any {
    if (control.style) return control.style;
    return {};
  }

  onGetRouterLink(control: JsonFormControl) {
    this.dynaForm.value[control.name] = true;
  }

  onSetData(ctrlName: string) {

    // console.log(this.dynaForm.getRawValue());
    const ctr = this.jsonFormData?.controls?.find(c => c.name === ctrlName);
    this.jsonFormData?.controls?.forEach(ctr => {
      
      if (ctr && this.dynaForm.value[ctr.name] && 'datetime-local'.includes(ctr.type)) {
        
        let date = new Date(this.dynaForm.value[ctr.name]);
        if (ctr.type === 'date' && date.getTime() > 0 && this.dynaForm.value[ctr.name].toString().includes('-')) {
          const dateparts = this.dynaForm.value[ctr.name].split('-');  
          date = new Date(dateparts[0], dateparts[1] - 1, dateparts[2]);
        }
        this.dynaForm.value[ctr.name] = date.getTime();

      }
    });
    this.dynaForm.value['_valid_'] = this.dynaForm.valid;
    this.dynaForm.value['_propName_'] = ctrlName;
    if (this.resetstate) { this.resetstate = false; } else { this.result.emit(this.dynaForm.value); }
    this.valid.emit(this.dynaForm.valid);
  }

  onSubmit() {
    // console.log('Form valid: ', this.dynaForm.valid);
    // console.log('Form values: ', this.dynaForm.value);
  }

  getBoolState(name: string): boolean {
    return this.checBoxLists[name] || false;
  }

  setBoolState(event: any, name: string) {
    this.checBoxLists[name] = event.checked;
    this.onSetData(name);
  }

  onBtnClick(event: any, control: JsonFormControl, btnPos: string = '') {
    const btnclick = '_btnclick_' + btnPos;
    this.dynaForm.value[btnclick] = true;
    this.dynaForm.value['_btnEvent_'] = event;
    /*
    if (btnclick === '_btnclick_' && control.tags && control.tags['sideBtn']) {
      
    }
    if (btnclick === '_btnclick_2_' && control.tags && control.tags['sideBtn2']) {
      
    }
    */
    this.onSetData(control.name);
  }

  getIcon(control: JsonFormControl): string {
    let icon = '';
    if (control.sideBtn && control.sideBtn.length > 0) { icon = control.sideBtn }
    else if (this.editBtn && this.editBtn.length > 0) { icon = this.editBtn }
    return icon;
  }
}

