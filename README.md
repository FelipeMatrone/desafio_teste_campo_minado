# Desafio de Teste — Campo Minado

Casos de teste em JavaScript para um Campo Minado de **18 × 14** células e até **40 bombas**. O modelo foi criado para permitir testes determinísticos das regras do jogo.

## Como executar

Requer Node.js 18 ou superior; não é necessário instalar bibliotecas.

```bash
npm test
```

## Especificação modelada

- A grade contém 252 células; cada uma registra bomba, bandeira, revelação e quantidade de vizinhas.
- Uma célula conta apenas as oito posições adjacentes válidas; cantos e bordas são tratados corretamente.
- Revelar célula sem bomba abre cascata, que para em células numeradas. Revelar bomba encerra a partida.
- Bandeiras alternam apenas em células ainda fechadas. Revelar todas as células seguras encerra com vitória.
- `CampoMinado.comSemente(semente)` gera exatamente 40 bombas de modo reproduzível; isso evita testes aleatórios instáveis.

## Organização da suíte

| Arquivo | Cenários verificados |
| --- | --- |
| `test/campo-minado.test.js` | dimensões, vizinhança, cascata, bomba, bandeira e limites |
| `test/partida-e-semente.test.js` | sementes, distribuição de 40 bombas, duplicatas, vitória e fim de jogo |

Os cenários que falham validam também que o estado não continua sendo alterado depois do término.

## Colaborador

- Felipe Matrone — implementação e casos de teste.
