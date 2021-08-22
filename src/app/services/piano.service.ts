import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PianoService {

  constructor(private http: HttpClient) { 

  }

  getPrefDataByEmail(email: string) { 
    return this.http.get('https://piano-golang-test.herokuapp.com/person/email', {
      params: {
        email: email,
      }
    });
  }

  updatePrefData() {

  }
}
