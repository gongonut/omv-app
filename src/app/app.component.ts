import { Component, OnInit } from '@angular/core';
import { NavObserverService } from './nav-observer.service';
import { Router } from '@angular/router';
import { HttpMapicoService } from './http-mapico.service';
import { MongoBaseService } from './mongo-base.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'quote-cli-01';

  constructor(
    public nvg: NavObserverService,
    private router: Router,
    // private http_marpico: HttpMapicoService,
    private mongodb: MongoBaseService
    ) {}

  ngOnInit() {
    this.navObserver();  
    // Prueba, después solo consulta el elemento desde cada origen
    // Inicia aplicación verifica si está autenticado
    this.start();
    // this.http_marpico.getDataPrueba();
  }

  navObserver() {
    this.nvg.getRouteDetailObs().subscribe(navDeta => {
      
      if (navDeta.tag && navDeta.tag.length > 0) {
        this.router.navigate([navDeta.route, navDeta.tag], { skipLocationChange: true }); // .catch(rason => console.log(rason));
      } else {
        this.router.navigate([navDeta.route], { skipLocationChange: true });// this.router.navigate([`/${navDeta.route}`]); // .catch(rason => console.log(rason));
      }
      // this.router.navigate([`/myPage/`], { relativeTo: this.route, skipLocationChange: true })
    });
  }

  start() {
    
    this.mongodb.startSession();
    
  }

}



/**
 * 
 * {
  "hosting": {
    "site": "omv-cli-quote",

    "public": "public",
    ...
  }
}

 * // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCr2fOsFLVKdZd-5pnDNGDhhxlfqceAvpc",
  authDomain: "omvpage.firebaseapp.com",
  projectId: "omvpage",
  storageBucket: "omvpage.appspot.com",
  messagingSenderId: "993141052146",
  appId: "1:993141052146:web:4311b10e34547043d8766b",
  measurementId: "G-KEBBV8C0Y3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
 */