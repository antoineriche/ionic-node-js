import { Injectable } from '@angular/core';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyserverService {

  constructor(private http: HttpClient) {
    console.log('Hello MyserverService Provider');
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
        console.error(error.error);
    }
    // return an observable with a user-facing error message
    return throwError(error);
  }

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  postToServer(ipAddress: string, data: any): Observable<any> {
    console.log('postToServer');
    var url = "http://"+ipAddress+":8080/sportpoint";
    return this.http.post(url, data).pipe(
      map(this.extractData), catchError(this.handleError)
    );
  }

  getFavorite(ipAddress: string, userId: string): Observable<any> {
    console.log('getFavorite');
    var url = "http://"+ipAddress+":8080/"+userId+"/favorite";
    return this.http.get(url).pipe(
      map(this.extractData), catchError(this.handleError)
    );
  }

  checkServer(ipAddress: string): Observable<any> {
    console.log('checkServer');
    var url = "http://"+ipAddress+":8080";

    return this.http.get(url).pipe(
      map(this.extractData), catchError(this.handleError)
    );
  }
}
