import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root',
})

export class AppleFormMockService  implements InMemoryDbService {
  createDb() {
    const data = [
      'dar',
    ];
    return { data };
  }
}
