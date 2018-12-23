let str = 'application/json';

let strArr = str.split('');

let cuted = strArr.splice(strArr.lastIndexOf('/') + 1, strArr.length - 1).join('');

console.log(cuted)