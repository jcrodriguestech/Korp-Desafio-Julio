using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Korp.Estoque.API.Models;

namespace Korp.Estoque.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProdutosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProdutosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Produto>>> GetProdutos()
        {
            return await _context.Produtos.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Produto>> GetProduto(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);

            if (produto == null)
            {
                return NotFound();
            }

            return produto;
        }

        [HttpGet("codigo/{codigo}")]
        public async Task<ActionResult<Produto>> GetProdutoByCodigo(string codigo)
        {
            var produto = await _context.Produtos
                .FirstOrDefaultAsync(p => p.Codigo == codigo);

            if (produto == null)
            {
                return NotFound(new { message = "Produto não encontrado no estoque." });
            }

            return produto;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduto(int id, Produto produto)
        {
            if (id != produto.Id)
            {
                return BadRequest();
            }

            _context.Entry(produto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProdutoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Produto>> PostProduto(Produto produto)
        {
            produto.Id = 0;
            _context.Produtos.Add(produto);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduto", new { id = produto.Id }, produto);
        }

        [HttpPost("baixa")]
        public async Task<IActionResult> BaixarEstoque([FromBody] BaixaEstoqueRequest request)
        {
            var produto = await _context.Produtos.FirstOrDefaultAsync(p => p.Codigo == request.Codigo);

            if (produto == null) return NotFound("Produto não encontrado.");

            if (produto.Quantidade < request.Quantidade) return BadRequest("Saldo insuficiente.");

            produto.Quantidade -= request.Quantidade;

            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Saldo atualizado!", novoSaldo = produto.Quantidade });
        }

        public class BaixaEstoqueRequest
        {
            public string Codigo { get; set; } = string.Empty;
            public int Quantidade { get; set; }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduto(int id)
        {
            var produto = await _context.Produtos.FindAsync(id);
            if (produto == null)
            {
                return NotFound();
            }

            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProdutoExists(int id)
        {
            return _context.Produtos.Any(e => e.Id == id);
        }
    }
}
