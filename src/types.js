export const emptyString='';
export const emptyObject=Object.freeze({});
export const emptyArray=Object.freeze([]);
const testF=emptyObject.toString;
const typeTest=
  type=>
    v=>testF.call(v)===`[object ${type}]`;
export const isFunc=typeTest('Function');
export const isArray=Array.isArray||typeTest('Array');
export const isDate=typeTest('Date');
export const isObj=typeTest('Object');
export const isBoolean=typeTest('Boolean');
export const isNum=typeTest('Number');
export const isString=typeTest('String');
export const isNull=v=>v===void 0||v===null;
export const notNull=v=>!isNull(v);
