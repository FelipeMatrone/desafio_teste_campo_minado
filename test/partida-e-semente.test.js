import test from 'node:test';
import assert from 'node:assert/strict';
import { CampoMinado, BOMBAS } from '../src/campo-minado.js';

test('campo com semente contém exatamente quarenta bombas', () => { const c = CampoMinado.comSemente(2026); assert.equal(c.grade.flat().filter((x) => x.bomba).length, BOMBAS); });
test('a mesma semente produz a mesma distribuição', () => { const a = CampoMinado.comSemente(10), b = CampoMinado.comSemente(10); assert.deepEqual(a.grade.flat().map((c) => c.bomba), b.grade.flat().map((c) => c.bomba)); });
test('recusa coordenadas de bomba repetidas', () => assert.throws(() => new CampoMinado([[1,1],[1,1]]), /quantidade/i));
test('revelar todas as células seguras encerra com vitória', () => { const c = new CampoMinado([[0,0]]); for (let y = 0; y < 14; y++) for (let x = 0; x < 18; x++) if (!(x === 0 && y === 0) && !c.encerrado) c.revelar(x,y); assert.equal(c.vencedor, true); assert.equal(c.encerrado, true); });
test('não permite bandeira após o fim', () => { const c = new CampoMinado([[0,0]]); c.revelar(0,0); assert.throws(() => c.alternarBandeira(1,1), /encerrada/i); });
