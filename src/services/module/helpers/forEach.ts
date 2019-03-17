export function forEach<T>(arr: any[], fn: (effect) => T) {
    let i = 0;
    const len = arr.length;
    if (arr.constructor === Array && fn.constructor === Function) {
        for (; i < len; i++) {
            fn.call(arr, arr[i], i, arr);
        }
    }
}