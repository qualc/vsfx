const querystring = require('querystring');
const qs = require('qs');

const obj = {
    key: 1,
    value: {
        age: 1
    }
};

console.log(querystring.stringify(obj));
console.log(qs.stringify(obj));
