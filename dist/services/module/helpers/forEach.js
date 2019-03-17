"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function forEach(arr, fn) {
    let i = 0;
    const len = arr.length;
    if (arr.constructor === Array && fn.constructor === Function) {
        for (; i < len; i++) {
            fn.call(arr, arr[i], i, arr);
        }
    }
}
exports.forEach = forEach;
