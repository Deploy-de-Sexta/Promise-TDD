module.exports = function all(args) {
  if (typeof args === 'undefined' || typeof args[Symbol.iterator] !== 'function') {
    throw new Error('Argumento não é iterável');
  }
  
  return new Promise((resolve, reject) => {
    const values = [];
    let totalItems = args.length;

    Array.from(args).forEach((v, idx) => Promise.resolve(v).then(resolvedValue => {
      values[idx] = resolvedValue;
      totalItems -= 1;
      if (totalItems === 0) resolve(values);
    }).catch(err => {
      reject(err);
    }));
  });
}