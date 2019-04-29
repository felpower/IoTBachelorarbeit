import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, RequestMethod} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

export enum AuthResponse {
  SUCCESS,
  DENIED,
  UNKNOWN
}

export interface User {
  name: string
}

export interface ShowerStat {
  name: string,
  showertime: number,
  showercount: number
}

export interface ToiletStat {
  toilet_paper: number,
  toilet_occupation: String,
  toilet_timer: string
}

@Injectable()
export class BackendProvider {
  // Define base url
  base: string = 'localhost/php/';

  // Define headers
  headers: any = new Headers(
    {
      'Content-Type': 'application/json'
    });

  constructor(public http: Http) {
  }

  fetch(request: RequestOptions): Promise<any> {
    return this.http.post(request.url, request.body, request).toPromise();
  }

  authenticate(email: string, secret: string): Promise<{ authResponse: AuthResponse }> {
    let data = {
      email: email,
      secret: secret
    };
    let endpoint = 'login.php';

    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: this.base + endpoint,
      headers: this.headers,
      body: JSON.stringify(data)
    });
    return new Promise((resolve) => {
      this.fetch(options)
        .then((res) => {
          let authResponse = AuthResponse.UNKNOWN;
          if (res._body == 'success') {
            authResponse = AuthResponse.SUCCESS
          } else {
            authResponse = AuthResponse.DENIED;
          }
          resolve({authResponse: authResponse});
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  getToiletStats(email: string, secret: string): Promise<ToiletStat> {
    let data = {
      email: email,
      secret: secret
    };
    let endpoint = 'getToiletStats.php';

    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: this.base + endpoint,
      headers: this.headers,
      body: JSON.stringify(data)
    });
    return new Promise((resolve) => {
      this.fetch(options)
        .then((res) => {
          if (res._body != 'error') {
            let tStats: ToiletStat[] = JSON.parse(res._body);
            resolve(tStats[0]);
          } else {
            console.error('getToiletStat Backend Response: ' + res._body);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  getEnvironmentStats(email: string, secret: string): Promise<environmeneStat> {
    let data = {
      email: email,
      secret: secret
    };
    let endpoint = 'getEnvironmentStats.php';

    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: this.base + endpoint,
      headers: this.headers,
      body: JSON.stringify(data)
    });
    return new Promise((resolve) => {
      this.fetch(options)
        .then((res) => {
          if (res._body != 'error') {
            let tStats: environmeneStat[] = JSON.parse(res._body);
            resolve(tStats[0]);
          } else {
            console.error('getEnvironmentStats Backend Response: ' + res._body);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  getUsers(email: string, secret: string): Promise<User[]> {
    let data = {
      email: email,
      secret: secret
    };
    let endpoint = 'getUsers.php';

    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: this.base + endpoint,
      headers: this.headers,
      body: JSON.stringify(data)
    });
    return new Promise((resolve) => {
      this.fetch(options)
        .then((res) => {
          if (res._body != 'error') {
            let user: User[] = JSON.parse(res._body);
            resolve(user);
          } else {
            console.error('getUser Backend Response: ' + res._body);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  getShowerStats(email: string, secret: string): Promise<ShowerStat[]> {
    let data = {
      email: email,
      secret: secret
    };
    let endpoint = 'getShowerStats.php';

    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: this.base + endpoint,
      headers: this.headers,
      body: JSON.stringify(data)
    });
    return new Promise((resolve) => {
      this.fetch(options)
        .then((res) => {
          if (res._body != 'error') {
            let showerStats: ShowerStat[] = JSON.parse(res._body);
            resolve(showerStats);
          } else {
            console.error('getShowerStat Backend Response: ' + res._body);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  setPushId(email: string, secret: string, pushId: string): Promise<number> {
    let data = {
      email: email,
      secret: secret,
      pushId: pushId
    };
    let endpoint = 'setPushId.php';

    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: this.base + endpoint,
      headers: this.headers,
      body: JSON.stringify(data)
    });
    return new Promise((resolve) => {
      this.fetch(options)
        .then((res) => {
          if (res._body == 'no error occured') {
            resolve(1);
          } else {
            console.error('setPushId Backend Response: ' + res._body);
            resolve(-1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
}
