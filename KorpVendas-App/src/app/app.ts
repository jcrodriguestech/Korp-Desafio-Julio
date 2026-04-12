import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProdutoService } from './services/produto';
import { FaturamentoService } from './services/faturamento';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: false
})
export class AppComponent implements OnInit {
  title = 'KorpVendas-App';
  produtos: any[] = [];
  notas: any[] = [];

  novoProduto = { codigo: '', descricao: '', quantidade: 0 };
  novaNota = { codigoProduto: '', quantidade: 0 };
  
  imprimindoId: number | null = null; 

  constructor(
    private produtoService: ProdutoService, 
    private faturamentoService: FaturamentoService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listar();
    this.listarNotas();
  }

  listar() {
    this.produtoService.getProdutos().subscribe({
      next: (dados) => {
        this.produtos = [...dados]; 
        this.cdr.detectChanges();  
      },
      error: (err) => console.error('ERRO:', err)
    });
  }

  listarNotas() {
    this.faturamentoService.getNotas().subscribe({
      next: (dados) => {
        console.log('Notas recebidas do servidor:', dados);
        this.notas = [...dados];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao listar notas:', err)
    });
  }

  salvar() {
    this.produtoService.cadastrarProduto(this.novoProduto).subscribe({
      next: (resultado) => {
        alert('Produto salvo com sucesso!');
        this.listar();
        this.novoProduto = { codigo: '', descricao: '', quantidade: 0 };
      },
      error: (err) => {
        alert('Erro ao salvar produto. Verifique a API.');
      }
    });
  }

  gerarNota() {
    this.faturamentoService.emitirNota(this.novaNota).subscribe({
      next: (res) => {
        alert('Nota Fiscal emitida com sucesso!');
        this.novaNota = { codigoProduto: '', quantidade: 0 };
        this.listar();
        this.listarNotas();
      },
      error: (err) => {
        const mensagemBackend = err.error || 'Erro inesperado na API.';
        alert(mensagemBackend); 
      }
    });
  }

  imprimir(id: number) {
    this.imprimindoId = id;

    this.faturamentoService.imprimirNota(id).subscribe({
      next: (res) => {
        alert('Impressão concluída e nota fechada!');
        this.imprimindoId = null;
        this.listarNotas();
      },
      error: (err) => {
        this.imprimindoId = null;
        const msg = err.error || 'Erro ao processar impressão.';
        alert(msg);
      }
    });
  }
}