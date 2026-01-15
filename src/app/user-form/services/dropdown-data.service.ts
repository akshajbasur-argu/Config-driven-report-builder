import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DropdownDataService {

  getClients(): Observable<any[]> {
    return of([
      { id: 1, name: 'Client A' },
      { id: 2, name: 'Client B' }
    ]);
  }

  getDistributors(clientId: number): Observable<any[]> {
    console.log("client id is: ",clientId)
    const map: any = {
      1: [
        { id: 11, name: 'Distributor A1' },
        { id: 12, name: 'Distributor A2' }
      ],
      2: [
        { id: 21, name: 'Distributor B1' }
      ]
    };
    return of(map[clientId] || []);
  }
}
