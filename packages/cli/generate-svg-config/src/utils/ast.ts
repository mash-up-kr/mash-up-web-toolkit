import { types } from 'recast';

export function getClosestCallExpression(
  p: any
): types.namedTypes.CallExpression | null {
  let cur = p.parentPath;
  while (cur) {
    const n = cur.node;
    if (types.namedTypes.CallExpression.check(n)) return n;

    // TS/Babel에서 나올 수 있는 래퍼 노드들(필요시 추가)
    if (
      types.namedTypes.TSSatisfiesExpression?.check?.(n) ||
      types.namedTypes.TSAsExpression?.check?.(n) ||
      types.namedTypes.ParenthesizedExpression.check(n)
    ) {
      cur = cur.parentPath;
      continue;
    }
    cur = cur.parentPath;
  }
  return null;
}
