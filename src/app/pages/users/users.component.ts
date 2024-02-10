import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JsonFormData } from 'src/app/components/dynamic-form/dynamic-form.component';
import { User } from 'src/app/datatypes';
import { DialogData, DialogService } from 'src/app/dialog.service';
import { HttpUsersService } from 'src/app/http-users.service';
import { SharedVarsService } from 'src/app/shared-vars.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

   userData: JsonFormData = {
    controls: [
      {
        name: 'email',
        label: 'Correo electrónico:',
        type: 'text',
        style: { 'width': '150px' },
        validators: { required: true }
      },
      {
        name: 'password',
        label: 'Contraseña:',
        type: 'password',
        sideBtn: 'visibility',
        // style: {'width':'100px','background-color': 'white'},
        validators: { required: true }
      },
      {
        name: 'name',
        label: 'Nombre:',
        type: 'text',
        style: { 'width': '150px' },
        validators: { required: true }
      },
      {
        name: 'phone',
        label: 'Teléfono:',
        type: 'text',
        style: { 'width': '150px' },
        validators: { required: true }
      },
      {
        name: 'city',
        label: 'Ciudad:',
        type: 'text',
        style: { 'width': '150px' },
        validators: { required: true }
      },
      {
        name: 'rol',
        label: 'Permiso para editar:',
        type: 'multiselect',
        // style: {'width':'100px','background-color': 'white'},
        validators: { required: true },
        selectOptions: [
          { key: 'Q', value: 'Cotizaciones' },
          { key: 'P', value: 'Productos' },
          { key: 'C', value: 'Configuración' },
          { key: 'U', value: 'Usuarios' }
        ]
      },
    ]
  }

  @ViewChild('editControlTrigger') editControlTrigger!: MatMenuTrigger;

  usersList: User[] = [];

  constructor(
    private dg: DialogService,
    private user: HttpUsersService,
    private snkBar: MatSnackBar,
    public sharedvar: SharedVarsService
    ) { }

  ngOnInit(): void { this.getList(); }

  private getList() {
    this.user.getUsersList().subscribe((value: User[]) => {
      this.usersList = value;
      this.orderList();
    });
  }

  private orderList() {
    
    this.usersList.sort((a, b) => { return a.name.localeCompare(b.name) });
  }

  getClicked(event: any) {

    switch (event.index) {
      case 2:
        this.createUser();
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

  createUser() {
    
    const user = this.user.newUser();
    

    const ddta: DialogData = {
      title: 'Crear Usuario',
      value: user,
      schema: this.userData,
      dgheigth: 615,
      dgwidth: 300
    }

    this.dg.aDefault(ddta).subscribe((result: any) => {
      
      if (result && user) {
        this.sharedvar.updatePropResult(user, result);
        /*
        user.name = result.name;
        user.email = result.email;
        user.password = result.password;
        user.rol = result.rol || [];
        */

        const sub = this.user.createUser(user).subscribe((event: any) => {
          
          if (sub) { sub.unsubscribe(); }
          if (event) {
            this.usersList.push(event as User);
            this.orderList();
          }
        });

      }
    });
  }

  editUser(user: User) {
    /*
    const userData: JsonFormData = {
      controls: [
        {
          name: 'rol',
          label: 'Permiso para editar:',
          type: 'multiselect',
          // style: {'width':'100px','background-color': 'white'},
          validators: { required: true },
          selectOptions: [
            { key: 'Q', value: 'Cotizaciones' },
            { key: 'P', value: 'Productos' },
            { key: 'C', value: 'Condiciones Comerciales' },
            { key: 'U', value: 'Usuarios' }
          ]
        },
      ]
    }
    */

    const shortUserData = {...this.userData};
    shortUserData.controls = shortUserData.controls?.slice(2);
    const ddta: DialogData = {
      title: 'Editar Usuario',
      value: user,
      schema: shortUserData,
      dgheigth: 460,
      dgwidth: 300
    }

    this.dg.aDefault(ddta).subscribe((result: any) => {
      
      if (result) {
        this.sharedvar.updatePropResult(user, result);
        // user = result;
        const sub = this.user.updateUser(user).subscribe((event: any) => {
      
          if (sub) { sub.unsubscribe(); }
        });

      }
    });
  }

  onDelete(user: User) {
    return this.snkBar.open(`¿Eliminar usuario: ${user.name}?`, 'Si', { duration: 3000 })
      .onAction().subscribe(ok => {
        
        if (user._id) {
          const sub = this.user.deleteUser(user._id).subscribe((event: any) => {
            const i = this.usersList.findIndex(u => u._id === user._id);
            if (i >= 0) {this.usersList.splice(i,1); }
          });
        }
        
        
        // this.user.deleteUsers(user.)
      });
  }

}
