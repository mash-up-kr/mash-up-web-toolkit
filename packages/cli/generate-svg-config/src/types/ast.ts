import { types } from 'recast';

export type ObjectExpression = types.namedTypes.ObjectExpression;
export type Property =
  | types.namedTypes.Property
  | types.namedTypes.ObjectProperty
  | types.namedTypes.ObjectMethod;
export type FunctionLike =
  | types.namedTypes.FunctionExpression
  | types.namedTypes.ArrowFunctionExpression
  | types.namedTypes.ObjectMethod;
