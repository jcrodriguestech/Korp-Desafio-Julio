import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timeout, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ProdutoService {
  private apiUrl = 'http://localhost:5224/api/produtos'; 

  constructor(private http: HttpClient) { }
  
  cadastrarProduto(produto: any): Observable<any> {
    return this.http.post(this.apiUrl, produto).pipe(
      timeout(2000),
      catchError(err => throwError(() => err))
    );
  }

  getProdutos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      timeout(2000),
      catchError(err => throwError(() => err))
    );
  }
}