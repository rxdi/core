export declare class Sha256 {
    /**
     * Generates SHA-256 hash of string.
     *
     * @param   {string} msg - (Unicode) string to be hashed.
     * @param   {Object} [options]
     * @param   {string} [options.msgFormat=string] - Message format: 'string' for JavaScript string
     *   (gets converted to UTF-8 for hashing); 'hex-bytes' for string of hex bytes ('616263' ≡ 'abc') .
     * @param   {string} [options.outFormat=hex] - Output format: 'hex' for string of contiguous
     *   hex bytes; 'hex-w' for grouping hex bytes into groups of (4 byte / 8 character) words.
     * @returns {string} Hash of msg as hex character string.
     */
    static hash(msg: any, options?: any): any;
    /**
     * Rotates right (circular right shift) value x by n positions [§3.2.4].
     * @private
     */
    static ROTR(n: any, x: any): number;
    /**
     * Logical functions [§4.1.2].
     * @private
     */
    static Σ0(x: any): number;
    static Σ1(x: any): number;
    static σ0(x: any): number;
    static σ1(x: any): number;
    static Ch(x: any, y: any, z: any): number;
    static Maj(x: any, y: any, z: any): number;
}
