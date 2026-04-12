export interface NotaFiscal {
  id?: number;
  numeroNota?: string;
  codigoProduto: string;
  quantidade: number;
  dataEmissao?: Date;
}