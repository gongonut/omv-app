import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { MongoBaseService } from './mongo-base.service';
import { Observable } from 'rxjs';
import { User } from './datatypes';
// import { env } from './environmets';
import { SharedVarsService } from './shared-vars.service';

@Injectable({
  providedIn: 'root'
})
export class HttpUsersService {

  constructor(private httpq: HttpClient, private sharedvar: SharedVarsService) { }

  newUser(): User {
    return { name: 'Nombre', email: 'email@usuario.com', password: '', rol: [] } as User;
  }

  getUsersList(): Observable<User[]> {
    return this.httpq.get<User[]>(`${this.sharedvar.OMV_SERVER}users`);
  }
  getUser(id: string): Observable<User> {

    return this.httpq.get<User>(`${this.sharedvar.OMV_SERVER}users/${id}`);
  }

  createUser(user: User): Observable<User> {
    // const UsersJ = JSON.stringify(Users);

    return this.httpq.post<User>(`${this.sharedvar.OMV_SERVER}users/register`, user);
  }

  logUser(user: User): Observable<any> {
    // const UsersJ = JSON.stringify(Users);

    return this.httpq.post<User>(`${this.sharedvar.OMV_SERVER}users/login`, user);
  }

  deleteUser(id: string): Observable<User> {

    return this.httpq.delete<User>(`${this.sharedvar.OMV_SERVER}users/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.httpq.put<User>(`${this.sharedvar.OMV_SERVER}users/${user._id}`, user);
    // return this.httpq.put<CotizaWish>(`${env.OMV_SERVER}quote/${id}`, quote);
  }

}
