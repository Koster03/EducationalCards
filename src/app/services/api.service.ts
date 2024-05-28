import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../layout/auth/auth-service';
import { AuthManager } from '../layout/auth/auth-service-manager';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    protected router: Router,
    protected zone: NgZone
  ) {}

  // Получение данных
  getData(): Observable<any> {
    return this.http.get(this.baseUrl, this.httpOptions);
  }

  // Отправка данных (создание новой записи)
  // post(path: string, data: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/${path}`, data, this.httpOptions);
  // }

  public post(url: string, data: unknown): Promise<any> {
    const observable = this.http.post(
      `${this.baseUrl}/${url}`,
      JSON.stringify(data),
      { headers: this.getHeaders(), observe: 'response' }
    );
    return this.subscribe(observable);
  }

  public get<TResult = any>(url: string): Promise<TResult | null> {
    const observable = this.http.get(`${this.baseUrl}/${url}`, {
      headers: this.getHeaders(),
      observe: 'response',
    }) as any as Observable<HttpResponse<TResult>>;
    return this.subscribe<TResult>(observable);
  }

  public put(url: string, data: unknown, silent?: boolean): Promise<any> {
    const observable = this.http.put(
      `${this.baseUrl}/${url}`,
      JSON.stringify(data),
      { headers: this.getHeaders(), observe: 'response' }
    );
    return this.subscribe(observable);
  }

  public getWithParams<TResult = any>(
    url: string,
    params: any
  ): Promise<TResult | null> {
    const observable = this.http.get(`${this.baseUrl}/${url}`, {
      headers: this.getHeaders(),
      params: params,
      observe: 'response',
    }) as any as Observable<HttpResponse<TResult>>;
    return this.subscribe<TResult>(observable);
  }

  public getObservable<TResult = any>(url: string): Observable<TResult> {
    const response$ = this.http.get(`${this.baseUrl}/${url}`, {
      headers: this.getHeaders(),
      observe: 'response',
    }) as any as Observable<HttpResponse<TResult>>;
    return this.parse(response$);
  }

  public delete(url: string, silent?: boolean): Promise<any> {
    const observable = this.http.delete(`${this.baseUrl}/${url}`, {
      headers: this.getHeaders(),
      observe: 'response',
    });
    return this.subscribe(observable);
  }

  protected parse<TResult = any>(
    observable: Observable<HttpResponse<TResult>>
  ): Observable<TResult> {
    return observable.pipe(
      tap((response) => {
        if (response.status === 401) {
          AuthManager.unAuthenticate();
          // const loginUrl = this.config.getAuthUrl(window.location.href);
          // window.location.replace(loginUrl);
        } else if (response.status === 402) {
          // const purchaseUrl = this.config.purchaseSubscriptionUrl();
          // window.location.replace(purchaseUrl);
        } else if (response.status === 403) {
          // this.evtDispatcher.publish(new EventItem(EventItem.EVT_ACCESS_DENIED, status));
        }
      }),
      map<HttpResponse<TResult>, TResult>((response) => {
        if (response.ok) {
          return response.body as any;
        } else {
          return null;
        }
      })
    );
  }

  protected getHeaders(): HttpHeaders {
    const token = AuthManager.getToken();
    const headers = new HttpHeaders({
      'content-type': 'application/json',
      // 'cache-control': 'no-cache',
      Authorization: token ? `Bearer ${token}` : [],
    });
    return headers;
  }

  // Обновление данных
  updateData(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data, this.httpOptions);
  }

  // Удаление данных
  deleteData(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.httpOptions);
  }

  // Получение данных по ID
  getDataById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, this.httpOptions);
  }

  protected subscribe<TResult = any>(
    observable: Observable<HttpResponse<TResult>>
  ): Promise<TResult | null> {
    const promise = new Promise<TResult | null>((resolve, reject) => {
      observable.subscribe({
        next: (r: any) => {
          setTimeout(() => {
            this.zone.run(() => {
              resolve(r['body']);
            });
          });
        },
        error: (r: any) => {
          if (r.status === 400) {
            resolve(r.error || null);
          }
          if (r.status === 401) {
            AuthManager.logout();
            // const loginUrl = this.config.getAuthUrl();
            this.router.navigate(['/login']);
            // window.location.replace(loginUrl);

            // reject(r);

            return;
          }
          if (r.status === 402) {
            // const purchaseUrl = this.config.purchaseSubscriptionUrl();
            // window.location.replace(purchaseUrl);
            reject(r);
            return;
          }
          if (r.status === 403) {
            // this.evtDispatcher.publish(new EventItem(EventItem.EVT_ACCESS_DENIED, status));
            resolve(null);
          }
          resolve(null);
        },
      });
    });

    return promise;
  }
}
