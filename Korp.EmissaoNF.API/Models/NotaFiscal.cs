namespace Korp.EmissaoNF.API.Models
{
    public class NotaFiscal
    {
        public int Id { get; set; }
        public string CodigoProduto { get; set; } = string.Empty;
        public int Quantidade { get; set; }
        public string? NumeroNota { get; set; }
        public DateTime DataEmissao { get; set; }
        public string Status { get; set; } = "Aberta";
    }
}