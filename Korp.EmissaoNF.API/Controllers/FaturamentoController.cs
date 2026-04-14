using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Korp.EmissaoNF.API.Models;

namespace Korp.EmissaoNF.API.Controllers
{
    [ApiController]
    [Route("api/faturamento")]
    public class FaturamentoController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly AppDbContext _context;

        public FaturamentoController(IHttpClientFactory httpClientFactory, AppDbContext context)
        {
            _httpClient = httpClientFactory.CreateClient("EstoqueAPI");
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotaFiscal>>> ListarTodas()
        {
            return await _context.NotasFiscais.ToListAsync();
        }

        [HttpPost("emitir")]
        public async Task<IActionResult> EmitirNota([FromBody] NotaFiscal nota)
        {
            var ultimaNota = await _context.NotasFiscais.OrderByDescending(n => n.Id).FirstOrDefaultAsync();
            int proximoNumero = (ultimaNota != null) ? ultimaNota.Id + 1 : 1000;

            nota.NumeroNota = $"NF-{proximoNumero:D4}";
            nota.DataEmissao = DateTime.Now;
            nota.Status = "Aberta";

            var response = await _httpClient.PostAsJsonAsync($"http://localhost:5224/api/produtos/baixa", new
            {
                codigo = nota.CodigoProduto,
                descricao = nota.DescricaoProduto,
                quantidade = nota.Quantidade
            });

            if (!response.IsSuccessStatusCode)
            {
                var erro = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Erro na baixa: {erro}");
                return BadRequest($"Estoque recusou: {erro}");
            }

            _context.NotasFiscais.Add(nota);
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Nota Fiscal emitida com sucesso!", dados = nota });
        }
        [HttpPost("imprimir/{id}")]
        public async Task<IActionResult> ImprimirNota(int id)
        {
            var nota = await _context.NotasFiscais.FindAsync(id);
            if (nota == null) return NotFound();
            if (nota.Status == "Fechada") return BadRequest("Esta nota já foi impressa e fechada.");

            await Task.Delay(1000);

            nota.Status = "Fechada";
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Nota impressa e status atualizado para Fechada!" });
        }
    }
}
