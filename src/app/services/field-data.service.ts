import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FieldDataService {

  getData(endpoint: string, params?: any): Observable<any[]> {

    switch (endpoint) {
      case 'clients':
        return of([
          { id: 1, name: 'Client A' },
          { id: 2, name: 'Client B' }
        ]);

      case 'distributors':
        return of(
          params.clientId === 1
            ? [{ id: 11, name: 'Distributor A1' }]
            : [{ id: 21, name: 'Distributor B1' }]
        );

      case 'restaurants':
        return of([
          { id: 101, name: 'Restaurant X' },
          { id: 102, name: 'Restaurant Y' }
        ]);

      default:
        return of([]);
    }
  }

  callApi(endpoint: string, payload: any) {
    console.log('API CALL:', endpoint, payload);
    return of(true);
  }
}
