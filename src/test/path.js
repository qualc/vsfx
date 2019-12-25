const pathRegexp = require('path-to-regexp');

const str = '/static';
const keys = [];
const reg = pathRegexp.pathToRegexp(str, [], { end: false });
console.log(reg, reg.test(''));
