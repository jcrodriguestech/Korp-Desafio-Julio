Desafio Técnico Korp - Sistema de Vendas

Este projeto foi desenvolvido como parte do processo seletivo para a Korp. A solução consiste em uma arquitetura de microsserviços para gestão de estoque e emissão de Notas Fiscais, priorizando a integridade dos dados e a comunicação entre sistemas.

## Tecnologias Utilizadas ##

- Backend: .NET 10 ASP.NET Core Web API
- Frontend: Angular 17+
- Banco de Dados: SQLite independente para cada API
- Documentação: Scalar

## Arquitetura ##

A solução foi dividida em três microsserviços:

1. Korp.Estoque.API: Gerencia o inventário de produtos.
2. Korp.EmissaoNF.API: Orquestra a emissão de notas e valida regras de negócio.
3. Frontend: Painel reativo para operação em tempo real.

## Lógica de Integração ##

O sistema implementa uma comunicação síncrona via HTTP. Ao solicitar a emissão de uma nota:

- A API de Faturamento consulta o saldo na API de Estoque.
- Regra de negócio: Se o estoque for insuficiente, o faturamento é impedido e um erro amigável é retornado ao usuário.
- Persistência: Após a validação, a nota é gravada no banco de faturamento e o estoque é atualizado via comando de baixa.

## Como rodar o projeto ##

1. Clone o repositório.
2. No Backend C#: Execute "dotnet run" em ambas as pastas de API.
3. No Frontend Angular: Execute "npm install" e "npm start".