export const LARGURA = 18, ALTURA = 14, BOMBAS = 40;
export class CampoMinado {
  constructor(bombas = []) {
    if (bombas.length > BOMBAS) throw new Error('Quantidade de bombas inválida.');
    this.grade = Array.from({ length: ALTURA }, () => Array.from({ length: LARGURA }, () => ({ bomba: false, revelada: false, bandeira: false, vizinhas: 0 })));
    for (const [x, y] of bombas) { this.#celula(x, y).bomba = true; }
    for (let y = 0; y < ALTURA; y++) for (let x = 0; x < LARGURA; x++) this.grade[y][x].vizinhas = this.#vizinhas(x, y).filter(([a,b]) => this.grade[b][a].bomba).length;
    this.encerrado = false;
  }
  #celula(x,y) { if (!Number.isInteger(x)||!Number.isInteger(y)||x<0||x>=LARGURA||y<0||y>=ALTURA) throw new Error('Coordenada fora do tabuleiro.'); return this.grade[y][x]; }
  #vizinhas(x,y) { const resultado=[]; for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){const a=x+dx,b=y+dy;if((dx||dy)&&a>=0&&a<LARGURA&&b>=0&&b<ALTURA)resultado.push([a,b]);} return resultado; }
  alternarBandeira(x,y) { const c=this.#celula(x,y); if(c.revelada) throw new Error('Célula já revelada.'); c.bandeira=!c.bandeira; return c.bandeira; }
  revelar(x,y) { if(this.encerrado) throw new Error('Partida encerrada.'); const inicial=this.#celula(x,y); if(inicial.bandeira) throw new Error('Célula marcada com bandeira.'); if(inicial.revelada) return 'repetida'; if(inicial.bomba) { inicial.revelada=true; this.encerrado=true; return 'bomba'; } const fila=[[x,y]]; while(fila.length){ const [a,b]=fila.pop(), c=this.#celula(a,b); if(c.revelada||c.bandeira||c.bomba) continue; c.revelada=true; if(c.vizinhas===0) fila.push(...this.#vizinhas(a,b)); } return 'segura'; }
}
