const getMultipleIndexes = (arr, el) =>
  arr.reduce((r, v, i) => r.concat(v === el ? i : []), []);

export { getMultipleIndexes };
