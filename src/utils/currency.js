const digitsRE = /(\d{3})(?=\d)/g;
export function currency(val, curre, decimal) {
  let value = parseFloat(val);
  if (!isFinite(value) || (!value && value !== 0)) return '';
  let currency = curre != null ? curre : '$';
  let decimals = decimal != null ? decimal : 2;
  let stringified = Math.abs(value).toFixed(decimals);
  let _int = decimals
    ? stringified.slice(0, -1 - decimals)
    : stringified;
  let i = _int.length % 3;
  let head = i > 0
    ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
    : '';
  let _float = decimals
    ? stringified.slice(-1 - decimals)
    : '';
  let sign = value < 0 ? '-' : '';
  return sign + currency + head +
    _int.slice(i).replace(digitsRE, '$1,') +
    _float;
}
