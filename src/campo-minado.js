export const LARGURA = 18, ALTURA = 14, BOMBAS = 40;
const chave = ([x, y]) => `${x},${y}`;
export class CampoMinado {
  constructor(bombas = []) {
    if (!Array.isArray(bombas) || bombas.length > BOMBAS || new Set(bombas.map(chave)).size !== bombas.length) throw new Error('Quantidade de bombas inválida.');
    this.grade = Array.from({ length: ALTURA }, () => Array.from({ length: LARGURA }, () => ({ bomba: false, revelada: false, bandeira: false, vizinhas: 0 })));
    bombas.forEach(([x, y]) => { this.#celula(x, y).bomba = true; }); this.#recalcular(); this.encerrado = false; this.vencedor = false;
  }
  static comSemente(semente) { if (!Number.isInteger(semente)) throw new Error('Semente inválida.'); let n = semente >>> 0; const aleatorio = () => ((n = (n * 1664525 + 1013904223) >>> 0) / 2 ** 32); const posicoes = []; while (posicoes.length < BOMBAS) { const p = [Math.floor(aleatorio() * LARGURA), Math.floor(aleatorio() * ALTURA)]; if (!posicoes.some((q) => chave(q) === chave(p))) posicoes.push(p); } return new CampoMinado(posicoes); }
  #celula(x, y) { if (!Number.isInteger(x) || !Number.isInteger(y) || x < 0 || x >= LARGURA || y < 0 || y >= ALTURA) throw new Error('Coordenada fora do tabuleiro.'); return this.grade[y][x]; }
  #vizinhas(x, y) { const r = []; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const a = x + dx, b = y + dy; if ((dx || dy) && a >= 0 && a < LARGURA && b >= 0 && b < ALTURA) r.push([a, b]); } return r; }
  #recalcular() { for (let y = 0; y < ALTURA; y++) for (let x = 0; x < LARGURA; x++) this.grade[y][x].vizinhas = this.#vizinhas(x, y).filter(([a, b]) => this.grade[b][a].bomba).length; }
  alternarBandeira(x, y) { if (this.encerrado) throw new Error('Partida encerrada.'); const c = this.#celula(x, y); if (c.revelada) throw new Error('Célula já revelada.'); c.bandeira = !c.bandeira; return c.bandeira; }
  revelar(x, y) { if (this.encerrado) throw new Error('Partida encerrada.'); const inicial = this.#celula(x, y); if (inicial.bandeira) throw new Error('Célula marcada com bandeira.'); if (inicial.revelada) return 'repetida'; if (inicial.bomba) { inicial.revelada = true; this.encerrado = true; return 'bomba'; } const fila = [[x, y]]; while (fila.length) { const [a, b] = fila.pop(), c = this.#celula(a, b); if (c.revelada || c.bandeira || c.bomba) continue; c.revelada = true; if (c.vizinhas === 0) fila.push(...this.#vizinhas(a, b)); } if (this.grade.flat().filter((c) => !c.bomba).every((c) => c.revelada)) { this.encerrado = true; this.vencedor = true; return 'vitoria'; } return 'segura'; }
}
