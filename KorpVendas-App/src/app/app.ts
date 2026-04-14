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
  novaNota = { codigoProduto: '', descricaoProduto: '', quantidade: 0 };

  mensagemSucessoProduto: string = '';
  mensagemSucessoNF: string = '';
  mensagemErroProduto: string = '';
  mensagemErroNF: string = '';
  erroCarregarEstoque: string = '';
  erroCarregarNotas: string = '';
  carregandoProduto: boolean = false;
  carregandoNF: boolean = false;
  imprimindoId: number | null = null; 

  constructor(
    private produtoService: ProdutoService, 
    private faturamentoService: FaturamentoService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.listar();
      this.listarNotas();
    }, 2000); 
  
    setInterval(() => {
      console.log('Atualizando dados automaticamente...');
      this.listar();
      this.listarNotas();
    }, 30000);
  }

  listar() {
    this.produtoService.getProdutos().subscribe({
      next: (dados) => {
        this.produtos = [...dados]; 
        this.erroCarregarEstoque = '';
        this.cdr.detectChanges();  
      },
      error: (err) => {
        this.erroCarregarEstoque = 'Serviço de estoque offline.';
        this.produtos = [];
        this.cdr.detectChanges();
      }  
    })
  }

  listarNotas() {
    this.faturamentoService.getNotas().subscribe({
      next: (dados) => {
        this.notas = [...dados];
        this.erroCarregarNotas = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.erroCarregarNotas = 'Serviço de faturamento offline.';
        this.notas = [];
        this.cdr.detectChanges();
      }
    });
  }

  salvar() {
    this.carregandoProduto = true;
    this.mensagemErroProduto = '';

    this.produtoService.cadastrarProduto(this.novoProduto).subscribe({
      next: (res) => {
        this.mensagemSucessoProduto = 'Produto cadastrado com sucesso!';
        this.listar();
        this.novoProduto = { codigo: '', descricao: '', quantidade: 0 };
        this.carregandoProduto = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.mensagemSucessoProduto = '';
          this.cdr.detectChanges(); 
        }, 5000); 
      },
      error: (err) => {
        console.error('Erro ao salvar produto.', err);
        this.mensagemErroProduto = 'Não foi possível conectar ao servidor de Estoque.';
        this.carregandoProduto = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.mensagemErroProduto = '';
          this.cdr.detectChanges();
        }, 10000);
      }
    });
  }

  gerarNota() {
    this.carregandoNF = true;
    this.mensagemErroNF = '';
    this.mensagemSucessoNF = '';

    this.faturamentoService.emitirNota(this.novaNota).subscribe({
      next: (res: any) => {
        this.mensagemErroNF = '';
        this.mensagemSucessoNF = 'Nota Fiscal emitida com sucesso!';
        this.novaNota = { codigoProduto: '', descricaoProduto: '', quantidade: 0 };
        this.listar();
        this.listarNotas();
        this.carregandoNF = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.mensagemSucessoNF = '';
          this.cdr.detectChanges();
        }, 5000);
      },

      error: (err: any) => {

        if (err.status >= 200 && err.status < 300) {
          this.mensagemSucessoNF = 'Nota Fiscal emitida com sucesso!';
          this.novaNota = { codigoProduto: '', descricaoProduto: '', quantidade: 0 };
          this.listar();
          this.listarNotas();
          this.carregandoNF = false;
          this.cdr.detectChanges();
          return;
        }

        if (err.error && typeof err.error === 'string') {
          this.mensagemErroNF = err.error;
        } else {
          this.mensagemErroNF = 'Não foi possível conectar ao servidor de Faturamento.';
        }
        
        this.carregandoNF = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.mensagemErroNF = '';
          this.cdr.detectChanges();
        }, 7000);
      }
    });
  } 

  imprimir(id: number) {
    this.imprimindoId = id;
    this.faturamentoService.imprimirNota(id).subscribe({
      next: (res: any) => {
        this.listarNotas();
        this.imprimindoId = null;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erro ao imprimir!', err);
        this.imprimindoId = null;
        this.cdr.detectChanges();
      }
    });
  }
}