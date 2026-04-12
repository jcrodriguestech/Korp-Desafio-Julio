import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = 'http://localhost:5224/api/produtos'; 

  constructor(private http: HttpClient) { }
  
cadastrarProduto(produto: any): Observable<any> {
  return this.http.post(this.apiUrl, produto);
}
  getProdutos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}