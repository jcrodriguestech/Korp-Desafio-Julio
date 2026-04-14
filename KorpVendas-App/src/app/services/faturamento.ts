import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class FaturamentoService {
  private apiUrl = 'http://localhost:5225/api/faturamento';

  constructor(private http: HttpClient) { }

  emitirNota(nota: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/emitir`, nota).pipe(
      timeout(2000),
      catchError(err => throwError(() => err))
    );
  }

  getNotas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      timeout(2000),
      catchError(err => throwError(() => err))
    );
  }

  imprimirNota(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/imprimir/${id}`, {}).pipe(
      timeout(2000),
      catchError(err => throwError(() => err))
    );
  }
}