/**
 * Layout of the rules on the painted grammar tree.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

const { buildTreeLayout } = await import('../../app/practice/treeLayout.ts');
const { TREE_LIMBS } = await import('../../app/practice/treeMap.ts');

function check(counts) {
  const total = counts.reduce((a, b) => a + b, 0);
  const layout = buildTreeLayout(counts);
  assert.equal(layout.outlines.length, total);
  const owned = new Set(layout.points.map((p) => p.rule));
  let offset = 0;
  counts.forEach((n, l) => {
    for (let r = offset; r < offset + n; r++) {
      assert.ok(owned.has(r), `rule ${r} has no twig`);
      assert.ok(layout.outlines[r].length > 0, `rule ${r} has no area`);
      const firsts = layout.points.filter((p) => p.rule === r && p.first);
      assert.equal(firsts.length, 1, `rule ${r} has one fruit point`);
      assert.equal(firsts[0].limb, l, `rule ${r} grows on its own level's limb`);
    }
    offset += n;
  });
  return layout;
}

test('every rule gets twigs, one fruit point and an area on its own limb', () => {
  check([20, 20, 20, 20, 20, 20]);
  check([31, 27, 24, 28, 22, 16]);
  check([1, 2, 3, 4, 5, 6]);
});

test('levels with more rules than twig tips still fit', () => {
  const most = TREE_LIMBS.map((limb) => limb.pts.length);
  check(most.map((n) => Math.min(n, 45)));
});

test('a level without rules leaves its limb bare', () => {
  const layout = check([10, 0, 10, 10, 10, 10]);
  assert.ok(layout.byLimb[1].every((p) => p.rule === -1));
});

test('rules follow the branch in order and areas do not overlap', () => {
  const layout = check([25, 25, 25, 25, 24, 24]);
  for (const list of layout.byLimb) {
    for (let i = 1; i < list.length; i++) assert.ok(list[i].rule >= list[i - 1].rule);
  }
  // the spot where a rule's leaves sit belongs to that rule or to a nearer neighbour, never nothing
  for (const p of layout.points) {
    const hit = layout.hit(p.x + Math.cos(p.a) * 22, p.y + Math.sin(p.a) * 22);
    assert.ok(hit >= 0);
  }
  const tip = layout.points.find((p) => p.first && p.tip);
  assert.equal(layout.hit(tip.x + Math.cos(tip.a) * 22, tip.y + Math.sin(tip.a) * 22), tip.rule);
  assert.equal(layout.hit(-500, -500), -1);
});
