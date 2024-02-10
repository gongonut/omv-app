import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CotizaWish } from './datatypes';
// import { MongoBaseService } from './mongo-base.service';
import { SharedVarsService } from './shared-vars.service';
// import { env } from './environmets';
// import * as txt from './../assets/';

@Injectable({
  providedIn: 'root'
})
export class HttpQuoteService {

  // https://www.youtube.com/watch?v=AmF_BTzJdFY


  constructor(
    private httpq: HttpClient,
    // private mongodb: MongoBaseService,
    private sharedvar: SharedVarsService
    ) { }


  getQuotes(): Observable<CotizaWish[]> {
    return this.httpq.get<CotizaWish[]>(`${this.sharedvar.OMV_SERVER}quote`);
  }

  getQuote(id: string): Observable<CotizaWish> {
    return this.httpq.get<CotizaWish>(`${this.sharedvar.OMV_SERVER}quote/findOne/${id}`);
  }

  getQuoteByFilter(status: number, agent_id: string): Observable<CotizaWish[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('status', status);
    queryParams = queryParams.append('agent_id', agent_id);
    // const filter = {status, agent_id: this.sharedvar.user._id}
    return this.httpq.get<CotizaWish[]>(`${this.sharedvar.OMV_SERVER}quote/filter/data`, {params:queryParams});
  }

  getQuoteByDates(date_in: number, date_out: number): Observable<CotizaWish[]> {
      let queryParams = new HttpParams();
      queryParams = queryParams.append('date_in', date_in);
      queryParams = queryParams.append('date_out', date_out);
      // const filter = {status, agent_id: this.sharedvar.user._id}
      return this.httpq.get<CotizaWish[]>(`${this.sharedvar.OMV_SERVER}quote/filter/datebetween`, {params:queryParams});
  }

  createQuote(quote: CotizaWish): Observable<CotizaWish> {
    return this.httpq.post<CotizaWish>(`${this.sharedvar.OMV_SERVER}quote`, quote);
  }

  deleteQuote(id: string): Observable<CotizaWish> {
    return this.httpq.delete<CotizaWish>(`${this.sharedvar.OMV_SERVER}quote/${id}`);
  }

  resendMailQuote(id: string, quote: CotizaWish): Observable<CotizaWish> {
    
    return this.httpq.put<CotizaWish>(`${this.sharedvar.OMV_SERVER}quote/resend/${id}`, quote);
  }

  updateQuote(id: string, quote: CotizaWish): Observable<CotizaWish> {
    return this.httpq.put<CotizaWish>(`${this.sharedvar.OMV_SERVER}quote/${id}`, quote);
  }

  getCssData(idcss: string) {
    // const URL = '../assets/quote.txt';
    return this.httpq.get(idcss, {responseType: 'text'});
    /*
    subscribe(data => {
      const dataArray = data as [];
      if (dataArray.length > 0) {
        this.mongodb.marpicoItems = dataArray;
      }
    })
    */
  }

}
