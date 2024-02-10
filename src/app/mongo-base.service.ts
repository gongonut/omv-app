import { Injectable } from '@angular/core';
import { CotizaWish, General, Item, User } from './datatypes';
import { StorageMap } from '@ngx-pwa/local-storage';
import { DialogData, DialogService } from './dialog.service';
import { HttpUsersService } from './http-users.service';
import { HttpGeneralService } from './http-general.service';
import { SharedVarsService } from './shared-vars.service';
// import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MongoBaseService {

  constructor(
    private storage: StorageMap,
    private dg: DialogService,
    private httpUser: HttpUsersService,
    private httpGen: HttpGeneralService,
    private sharedvar: SharedVarsService
  ) { }

  // private logged = true;

  getLoginData() {
    localStorage.removeItem('user');
  }

  startSession() {

    let user = this.getLocalValidUser();
    if (user && user.email.length > 0) { this.login(user.email, user.password) } else {
      const adata: DialogData = {}
      adata.title = 'Iniciar sesión';
      // adata.newUsr = false;
      this.dg.aPass(adata).subscribe((result: any) => {

        if (result && result.email && result.pass) {
          this.login(result.email, result.pass);
        }
      });
    }
  }

  private getLocalValidUser(): User | null {

    const str = localStorage.getItem('user');
    if (!(str && str.length > 0)) return null;
    const user = JSON.parse(str) as User;
    if (!user) return null;
    // const milisechour = user.date ? this.sharedvar.getTime2NumberByHours(1) : 0;
    const date = Number(new Date());
    // if (milisechour < date) return null;
    return user;
  }

  /*
  private loginBeta(email: string, password: string) {
    
    
    const user: User = { email: 'email@usuario.com', password: 'email001', name: '' };
    const subs = this.httpUser.getUser(user.email).subscribe(data => {
      if (subs) subs.unsubscribe();
      if (data) {
        this.sharedvar.user = data as User;
        this.sharedvar.user.date = Number(new Date());
        localStorage.setItem('user', JSON.stringify(this.sharedvar.user));
        this.sharedvar.setLogged(true);
        const sub = this.httpGen.getGeneral().subscribe(data => {
          if (sub) sub.unsubscribe();
          this.getDefaData();
          if (data && data[0].id === 'only') { this.sharedvar.general = data[0]; } else { this.sharedvar.general = this.httpGen.newGeneral(); }
        });
      }

    })

  }
  */

  private login(email: string, password: string) {

    const user: User = { email, password, name: '' };
    const subs = this.httpUser.logUser(user).subscribe(data => {
      if (subs) subs.unsubscribe();
      if (data) {
        localStorage.setItem('token', data.token);
        // this.sharedvar.token = data.token; 
        this.sharedvar.user = data.user as User;
        // this.sharedvar.user.date = Number(new Date()) + this.sharedvar.getTime2NumberByHours(1);
        localStorage.setItem('user', JSON.stringify(user));
        this.sharedvar.setLogged(true);
        const sub = this.httpGen.getGeneral().subscribe(data => {
          if (sub) sub.unsubscribe();
          this.getDefaData();

          if (data && data.id === 'only') { this.sharedvar.general = data; } else { this.sharedvar.general = this.httpGen.newGeneral(); }
        }, error => {
          console.log(error);
          
          // location.reload();
        });
      } else { 
        console.log('error');
        
        // location.reload();
      }

    }, error => {
      
      console.log(error);
      if (error.status === 452) {
      
        this.login('user@user.user', 'user001')
      }
    })
    // const user: User = { email, password, name: '' };


  }


  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    location.reload();
  }

  /*
  isLogged(): boolean {
    return this.logged;
  }
  */

  /*
  newUser() {
    this.user = {id: 'ANONYMOUS', names: 'AGENTE OMV', email: 'omv@omv.com', pass: 'ANONYMOUS', phone: 'ANONYMOUS'}
  }
  */

  updateDefaData() {
    this.storage.set('defawishdata', this.sharedvar.defaWishData).subscribe(() => { });
  }

  getDefaData() {
    this.storage.get('defawishdata').subscribe((dta) => {
      this.sharedvar.defaWishData = dta as {} || {};
    });
  }

}
