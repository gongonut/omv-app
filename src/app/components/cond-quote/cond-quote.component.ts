import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Condition } from 'src/app/datatypes';

@Component({
  selector: 'app-cond-quote',
  templateUrl: './cond-quote.component.html',
  styleUrls: ['./cond-quote.component.scss']
})
export class CondQuoteComponent {

  @Input() condition!: Condition;
  @Input() edit: boolean = false;
  @Input() editView: boolean = false;
  @Input() visible: boolean = true;
  @Output() status = new EventEmitter<Condition>();

  editCond() {
    this.condition.tag = 'edit';
    this.status.emit(this.condition);
  }

  delCond() {
    this.condition.tag = 'delete';
    this.status.emit(this.condition);
  }

  visibleCond(e: any) {
    this.condition.tag = e.target.checked? 'visible' : 'invisible';   
    this.status.emit(this.condition);
  }

}
