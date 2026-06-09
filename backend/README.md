# Backend UsinaLink NestJS

Backend em NestJS para validar cadastros, login por tipo, busca de empresas/usinas, propostas e funcionarios. A persistencia atual continua em JSON dentro de `backend/database`.

## Como rodar

```bash
cd backend
npm install
npm start
```

Servidor padrao: `http://localhost:3001`

## Comandos

```bash
npm start      # roda NestJS via ts-node
npm run build  # compila para dist/
npm run start:prod
```

## Rotas principais

- `GET /` rota de teste da API.
- `POST /api/auth/login` login por e-mail, senha e tipo.
- `POST /api/cadastro/empresa` cadastra empresa.
- `POST /api/cadastro/pessoa-fisica` cadastra pessoa fisica.
- `POST /api/cadastro/usina` cadastra usina.
- `GET /api/empresas/buscar?nome=Metal` busca empresa por nome.
- `GET /api/empresas/buscar?cnpj=11222333000181` busca empresa por CNPJ.
- `GET /api/usinas/buscar?nome=Atlas` busca usina por nome.
- `GET /api/propostas` lista propostas.
- `PUT /api/propostas/:id` edita proposta.
- `PUT /api/propostas/:id/cancelar` cancela proposta.
- `GET /api/funcionarios?contexto=empresa` lista funcionarios.
- `POST /api/funcionarios` cria funcionario.
- `PUT /api/funcionarios/:id` edita funcionario.
- `POST /api/funcionarios/:id/reenviar-convite` simula reenvio.

## Exemplo de cadastro de empresa

```json
{
  "nome": "Metal Forte Ltda",
  "cnpj": "11.222.333/0001-81",
  "email": "compras@metalforte.com",
  "responsavel": "Ana Martins",
  "cargo": "Gerente de compras",
  "senha": "123456"
}
```

## Validacoes atuais

- E-mail obrigatorio, formato valido e unico no sistema.
- Senha obrigatoria com no minimo 6 caracteres.
- CPF obrigatorio, valido e unico para pessoa fisica.
- CNPJ obrigatorio, valido e unico para empresa e usina.
- Telefone validado quando enviado.

Os dados ficam em array na memoria (`database/memoryDatabase.js`). Ao reiniciar o servidor, os registros sao apagados. Essa separacao facilita trocar o armazenamento por banco real depois.
