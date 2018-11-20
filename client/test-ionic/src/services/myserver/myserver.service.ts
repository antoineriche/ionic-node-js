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

  checkServer(): Observable<any> {
    console.log('checkServer');
    var url = "http://localhost:8080";

    // url = "http://cors-anywhere.herokuapp.com/"+url;
    return this.http.get(url).pipe(
      map(this.extractData), catchError(this.handleError)
    );
  }
}
