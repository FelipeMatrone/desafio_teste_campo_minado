import test from 'node:test'; import assert from 'node:assert/strict'; import { CampoMinado, LARGURA, ALTURA } from '../src/campo-minado.js';
test('usa o tabuleiro solicitado de 18 por 14',()=>{const c=new CampoMinado();assert.equal(c.grade.length,ALTURA);assert.equal(c.grade[0].length,LARGURA);});
test('calcula bombas vizinhas no canto e no meio',()=>{const c=new CampoMinado([[0,0],[2,2]]);assert.equal(c.grade[1][1].vizinhas,2);assert.equal(c.grade[0][1].vizinhas,1);});
test('revelar bomba encerra a partida',()=>{const c=new CampoMinado([[0,0]]);assert.equal(c.revelar(0,0),'bomba');assert.throws(()=>c.revelar(1,1),/encerrada/i);});
test('revela célula numerada sem abrir células distantes',()=>{const c=new CampoMinado([[0,0]]);assert.equal(c.revelar(1,1),'segura');assert.equal(c.grade[1][1].revelada,true);assert.equal(c.grade[10][10].revelada,false);});
test('cascata revela células vazias e para nas numeradas',()=>{const c=new CampoMinado([[5,5]]);c.revelar(0,0);assert.equal(c.grade[0][0].revelada,true);assert.equal(c.grade[4][4].revelada,true);assert.equal(c.grade[5][5].revelada,false);});
test('bandeira alterna e impede revelação',()=>{const c=new CampoMinado();assert.equal(c.alternarBandeira(1,1),true);assert.throws(()=>c.revelar(1,1),/bandeira/i);assert.equal(c.alternarBandeira(1,1),false);});
test('recusa coordenadas fora do tabuleiro',()=>{const c=new CampoMinado();assert.throws(()=>c.revelar(18,0),/fora/i);assert.throws(()=>c.alternarBandeira(0,14),/fora/i);});
