export interface NotaFiscal {
  id?: number;
  numeroNota?: string;
  codigoProduto: string;
  descricao: string;
  quantidade: number;
  dataEmissao?: Date;
}