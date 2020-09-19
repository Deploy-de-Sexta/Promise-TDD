const all = require('./all');

describe('All', () => {
  it('Rejeita se o argumento não é um iterável', async () => {
    try {
      await all();
    } catch (err) {
      expect(err).toEqual(new Error('Argumento não é iterável'));
    }
  });

  it('Resolve quando o argumento não é uma Promise', () => {
    return expect(all([1, 2, 3])).resolves.toEqual([1, 2, 3]);
  });

  it('Resolve quando o argumento é uma Promise', () => {
    return expect(all([
      Promise.resolve(7),
      new Promise((resolve) => resolve(16)),
    ])).resolves.toEqual([7, 16]);
  });

  it('Resolve arguments em ordem', (done) => {
    all([
      new Promise((resolve) => setTimeout(() => resolve(3), 10)),
      new Promise((resolve) => setTimeout(() => resolve(8), 5)),
    ]).then(v => {
      expect(v).toEqual([3, 8]);
      done();
    });
  });

  it('Rejeita se uma das Promises for rejeitada', () => {
    const erro = new Error('Oops');

    return expect(all([
      Promise.resolve(1),
      Promise.reject(erro),
    ])).rejects.toBe(erro);
  });

  it('Rejeita com a primeira rejeição', () => {
    const erro1 = new Error('Yay');
    const erro2 = new Error('Wow');

    return expect(all([
      new Promise((resolve, reject) => setTimeout(() => reject(erro1), 10)),
      new Promise((resolve, reject) => setTimeout(() => reject(erro2), 5)),
    ])).rejects.toBe(erro2);
  });

  it('Rejeita com a primeira rejeição', () => {
    const promise = new Promise((resolve) => {      
      resolve(new Promise((resolve2) => {
        resolve2(Promise.resolve(3));
      }))
    });

    return expect(all([ promise ])).resolves.toEqual([ 3 ]);
  });

  it('Funciona quando o input é uma string', () => {
    return expect(all('abc')).resolves.toEqual(['a', 'b', 'c']);
  });
});