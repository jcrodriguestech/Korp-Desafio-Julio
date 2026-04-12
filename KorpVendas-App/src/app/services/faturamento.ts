import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaturamentoService {
  private apiUrl = 'http://localhost:5225/api/faturamento';

  constructor(private http: HttpClient) { }

  emitirNota(nota: any): Observable<any> {

    return this.http.post(`${this.apiUrl}/emitir`, nota);
  }

  getNotas(): Observable<any[]> {

    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  imprimirNota(id: number): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}/imprimir/${id}`, {});
  }
}