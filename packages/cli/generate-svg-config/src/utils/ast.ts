import { types } from 'recast';

import type { ObjectExpression, Property } from '../types/ast.ts';

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

/** Property / ObjectProperty / ObjectMethod 노드인지 확인 */
function isObjectLikeProperty(
  prop: ObjectExpression['properties'][number]
): prop is Property | types.namedTypes.ObjectProperty | types.namedTypes.ObjectMethod {
  return (
    types.namedTypes.Property.check(prop) ||
    types.namedTypes.ObjectProperty.check(prop) ||
    types.namedTypes.ObjectMethod.check(prop)
  );
}

/** prop.key가 주어진 keyName과 일치하는지 확인 (Identifier 또는 Literal) */
function isKeyMatching(
  prop: Property | types.namedTypes.ObjectProperty | types.namedTypes.ObjectMethod,
  keyName: string
): boolean {
  const { key } = prop;
  if (types.namedTypes.Identifier.check(key)) return key.name === keyName;
  if (types.namedTypes.Literal.check(key)) return String(key.value) === keyName;
  return false;
}

// 객체의 특정 key(property)를 찾아 반환하는 함수
export function getPropertyByKey(
  obj: ObjectExpression,
  keyName: string
): Property | types.namedTypes.ObjectProperty | null {
  for (const prop of obj.properties) {
    if (!prop) continue;
    if (isObjectLikeProperty(prop) && isKeyMatching(prop, keyName)) {
      return prop;
    }
  }
  return null;
}

// 객체에 주어진 key의 ObjectProperty가 없으면 새로 생성해서 반환
export function ensureObjectProperty(
  objExpr: ObjectExpression,
  key: string
): ObjectExpression {
  const existing = getPropertyByKey(objExpr, key);
  if (existing && !types.namedTypes.ObjectMethod.check(existing)) {
    const value = (
      existing as types.namedTypes.Property | types.namedTypes.ObjectProperty
    ).value;
    if (value && types.namedTypes.ObjectExpression.check(value)) return value;
  }
  const newProp = types.builders.property(
    'init',
    types.builders.identifier(key),
    types.builders.objectExpression([])
  );
  objExpr.properties.push(newProp);
  return newProp.value as ObjectExpression;
}
