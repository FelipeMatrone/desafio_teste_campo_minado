# Desafio de Teste — Campo Minado 18 × 14

Casos de teste em JavaScript para um Campo Minado de **18 colunas por 14 linhas**. O projeto modela uma grade de 252 células, revelação, bandeiras, contagem de vizinhas e encerramento por bomba ou vitória. Não há interface gráfica: o foco é tornar as regras de estado verificáveis por uma suíte automatizada.

## Colaborador

| Nome | Participação |
| --- | --- |
| Felipe de Almeida Matrone | Implementação do modelo, cenários de teste e documentação. |

## Como executar

O projeto requer Node.js 18 ou superior. Não utiliza bibliotecas externas: os testes usam apenas `node:test` e `node:assert/strict`.

```bash
npm test
```

Resultado esperado: **12 testes aprovados**, sem falhas nem instalação adicional.

## Especificação modelada

### Grade e células

| Item | Valor |
| --- | --- |
| Largura | 18 colunas, com `x` entre 0 e 17 |
| Altura | 14 linhas, com `y` entre 0 e 13 |
| Total de células | 252 |
| Limite de bombas | 40 |
| Estrutura de cada célula | `bomba`, `revelada`, `bandeira` e `vizinhas` |

Uma célula é acessada pela coordenada `(x, y)` e fica armazenada internamente como `grade[y][x]`. Coordenadas negativas, não inteiras ou fora da grade são recusadas.

O construtor aceita uma lista de coordenadas de bombas para permitir cenários controlados, por exemplo:

```js
const campo = new CampoMinado([[0, 0], [2, 2]]);
```

Não são aceitas mais de 40 bombas ou posições duplicadas.

### Vizinhança

O atributo `vizinhas` informa quantas bombas existem nas oito posições adjacentes válidas. A própria célula não entra na conta. O modelo trata corretamente as diferenças entre canto, borda e centro:

| Posição da célula | Máximo de vizinhas avaliadas |
| --- | ---: |
| Canto | 3 |
| Borda | 5 |
| Centro | 8 |

### Revelação e cascata

O método `revelar(x, y)` possui quatro resultados possíveis:

| Resultado | Significado |
| --- | --- |
| `segura` | Uma célula sem bomba foi revelada. |
| `bomba` | Uma bomba foi revelada; a partida é encerrada. |
| `repetida` | A célula já estava revelada; o estado não é alterado. |
| `vitoria` | Todas as células seguras foram reveladas. |

Quando uma célula vazia, com `vizinhas === 0`, é revelada, o modelo abre as células adjacentes de forma encadeada. A expansão continua apenas pelas células vazias e para nas células numeradas. Bombas e células marcadas com bandeira não são reveladas pela cascata.

### Bandeiras e fim de jogo

`alternarBandeira(x, y)` marca ou desmarca uma célula fechada. Uma célula marcada não pode ser revelada até que a bandeira seja removida. Uma célula já revelada também não pode receber bandeira.

A partida encerra quando uma bomba é aberta ou quando não resta nenhuma célula segura fechada. Depois disso, revelações e alterações de bandeira são recusadas. O atributo `vencedor` fica `true` apenas na condição de vitória.

## Semente e repetibilidade

Além de aceitar coordenadas manuais, o modelo oferece `CampoMinado.comSemente(semente)`. Esse método usa uma semente inteira para criar exatamente 40 bombas sem posições duplicadas.

```js
const campo = CampoMinado.comSemente(2026);
```

Usar a mesma semente gera a mesma distribuição. Essa decisão evita testes aleatórios instáveis: um caso que passa ou falha conforme a posição sorteada das bombas não é reproduzível.

## Modelo testado

O arquivo [`src/campo-minado.js`](src/campo-minado.js) exporta as constantes `LARGURA`, `ALTURA`, `BOMBAS` e a classe `CampoMinado`.

| Membro | Responsabilidade |
| --- | --- |
| `new CampoMinado(bombas?)` | Cria a grade e posiciona até 40 bombas informadas. |
| `CampoMinado.comSemente(semente)` | Cria um campo reproduzível com 40 bombas. |
| `revelar(x, y)` | Revela célula, abre cascata quando necessário e atualiza o fim de jogo. |
| `alternarBandeira(x, y)` | Marca ou desmarca uma célula fechada. |
| `grade` | Estado público da grade, utilizado para observar os cenários. |
| `encerrado` | Indica derrota por bomba ou vitória por abertura de todas as células seguras. |
| `vencedor` | Indica vitória quando todas as células sem bomba foram reveladas. |

## Organização e cobertura dos testes

| Arquivo | Casos | Cenários verificados |
| --- | ---: | --- |
| [`test/campo-minado.test.js`](test/campo-minado.test.js) | 7 | dimensão, vizinhança, bomba, célula numerada, cascata, bandeira e limites |
| [`test/partida-e-semente.test.js`](test/partida-e-semente.test.js) | 5 | quantidade de bombas, repetibilidade, duplicatas, vitória e bloqueio após encerramento |
| **Total** | **12** | regras principais, limites, aleatoriedade controlada e estado final |

### Exemplos de cenários cobertos

- O tabuleiro é criado com exatamente 18 × 14 posições.
- Bombas em canto e no interior produzem a contagem correta de vizinhas.
- Revelar uma bomba encerra o jogo e impede novas ações.
- Revelar uma célula numerada não abre células distantes indevidamente.
- A cascata revela células vazias e para ao chegar nas numeradas.
- Uma bandeira bloqueia a revelação até ser removida.
- A mesma semente gera a mesma grade e sempre contém 40 bombas.
- Revelar todas as células seguras encerra a partida com vitória.

## Critérios de qualidade dos casos

Os testes conferem retorno, transição de estado e efeitos colaterais. Não basta, por exemplo, que uma bomba retorne `bomba`: o cenário também exige que `encerrado` seja ativado e que ações posteriores sejam recusadas. Da mesma forma, uma entrada inválida ou um campo com bombas duplicadas não pode deixar a grade parcialmente configurada.

Os cenários com bombas manuais usam apenas as posições necessárias para tornar cada regra visível. Já os testes de semente verificam propriedades gerais da geração — quantidade e repetibilidade — sem depender de uma distribuição específica fixa.

## Decisões de escopo

O desafio prioriza regras testáveis da grade. Por isso, não foram implementados temporizador, ranking, interface visual, primeiro clique protegido, marcação automática de bombas ou persistência de partidas. Esses itens podem existir em uma aplicação completa, mas não são necessários para validar a contagem, revelação, bandeiras e condições de término cobertas aqui.

## Estrutura do projeto

```text
desafio_teste_campo_minado/
├── src/
│   └── campo-minado.js
├── test/
│   ├── campo-minado.test.js
│   └── partida-e-semente.test.js
├── package.json
└── README.md
```
