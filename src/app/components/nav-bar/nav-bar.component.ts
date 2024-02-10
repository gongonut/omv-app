import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
// import { DialogData, DialogService } from 'src/app/dialog.service';
import { MongoBaseService } from 'src/app/mongo-base.service';
import { NavObserverService } from 'src/app/nav-observer.service';
import { SharedVarsService } from 'src/app/shared-vars.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  @Input() buttons = '111111';
  @Input() lchat = false;
  @Input() title = '';
  @Output() onClicked = new EventEmitter<any>();
  logged = false;
  user_name = '';

  constructor(
    public nvg: NavObserverService,
    private mongodb: MongoBaseService,
    // private dg: DialogService,
    private sharedvar: SharedVarsService
  ) { }

  ngOnInit(): void {
    this.sharedvar.getLoggedReady().subscribe(logged => {
      
      this.logged = logged;
      if (logged) this.user_name = this.sharedvar.user.name || 'Registrarse';
    });
  }

  ngOnChanges() {
    if (this.buttons.length < 6) { this.buttons = '111111' }
  }

  getNavTitle(): string {
    if (this.sharedvar.isLogged()) {
      return this.nvg.routePrevList[this.nvg.routePrevList.length - 1].title || '';
    }
    return 'Iniciar Sesión';
  }

  getBtnVisible(i: number, forceVis: boolean = false): boolean {
    return this.buttons[i] === '1' && (this.sharedvar.isLogged() || forceVis);
  }

  getLChat(): string {
    if (this.lchat) { return 'block border-b-4 p-3 text-yellow-400'; }
    return 'block border-b-4 p-3 hover:border-violet-500 hover:text-sky-900';
  }

  onClick(event: any, i: number) {

    if (i === 0) { window.print(); }
    event.index = i;
    switch (i) {
      case 3:
        this.mongodb.startSession();
        break;
      case 40:
        this.mongodb.logout();
        this.mongodb.startSession();
        break;
      case 42:
        this.mongodb.logout();
        break;
    }
    this.onClicked.emit(event);
  }



  onBack() {
    if (!this.sharedvar.isLogged()) { return this.mongodb.startSession(); }
    if (this.nvg.routePrevList[this.nvg.routePrevList.length - 1].route === 'poll') {
      // this.mongodb.saveLocalPollExec();
    }
    this.nvg.onRouteBack();
  }


}
