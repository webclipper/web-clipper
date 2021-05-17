/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const enum Constants {
  /**
   * MAX SMI (SMall Integer) as defined in v8.
   * one bit is lost for boxing/unboxing flag.
   * one bit is lost for sign flag.
   * See https://thibaultlaurens.github.io/javascript/2013/04/29/how-the-v8-engine-works/#tagged-values
   */
  MAX_SAFE_SMALL_INTEGER = 1 << 30,

  /**
   * MIN SMI (SMall Integer) as defined in v8.
   * one bit is lost for boxing/unboxing flag.
   * one bit is lost for sign flag.
   * See https://thibaultlaurens.github.io/javascript/2013/04/29/how-the-v8-engine-works/#tagged-values
   */
  MIN_SAFE_SMALL_INTEGER = -(1 << 30),

  /**
   * Max unsigned integer that fits on 8 bits.
   */
  MAX_UINT_8 = 255, // 2^8 - 1

  /**
   * Max unsigned integer that fits on 16 bits.
   */
  MAX_UINT_16 = 65535, // 2^16 - 1

  /**
   * Max unsigned integer that fits on 32 bits.
   */
  MAX_UINT_32 = 4294967295, // 2^32 - 1

  UNICODE_SUPPLEMENTARY_PLANE_BEGIN = 0x010000,
}
/**
 * A manual encoding of `str` to UTF8.
 * Use only in environments which do not offer native conversion methods!
 */
export function encodeUTF8(str: string): Uint8Array {
  const strLen = str.length;

  // See https://en.wikipedia.org/wiki/UTF-8

  // first loop to establish needed buffer size
  let neededSize = 0;
  let strOffset = 0;
  while (strOffset < strLen) {
    const codePoint = getNextCodePoint(str, strLen, strOffset);
    strOffset += codePoint >= Constants.UNICODE_SUPPLEMENTARY_PLANE_BEGIN ? 2 : 1;

    if (codePoint < 0x0080) {
      neededSize += 1;
    } else if (codePoint < 0x0800) {
      neededSize += 2;
    } else if (codePoint < 0x10000) {
      neededSize += 3;
    } else {
      neededSize += 4;
    }
  }

  // second loop to actually encode
  const arr = new Uint8Array(neededSize);
  strOffset = 0;
  let arrOffset = 0;
  while (strOffset < strLen) {
    const codePoint = getNextCodePoint(str, strLen, strOffset);
    strOffset += codePoint >= Constants.UNICODE_SUPPLEMENTARY_PLANE_BEGIN ? 2 : 1;

    if (codePoint < 0x0080) {
      arr[arrOffset++] = codePoint;
    } else if (codePoint < 0x0800) {
      arr[arrOffset++] = 0b11000000 | ((codePoint & 0b00000000000000000000011111000000) >>> 6);
      arr[arrOffset++] = 0b10000000 | ((codePoint & 0b00000000000000000000000000111111) >>> 0);
    } else if (codePoint < 0x10000) {
      arr[arrOffset++] = 0b11100000 | ((codePoint & 0b00000000000000001111000000000000) >>> 12);
      arr[arrOffset++] = 0b10000000 | ((codePoint & 0b00000000000000000000111111000000) >>> 6);
      arr[arrOffset++] = 0b10000000 | ((codePoint & 0b00000000000000000000000000111111) >>> 0);
    } else {
      arr[arrOffset++] = 0b11110000 | ((codePoint & 0b00000000000111000000000000000000) >>> 18);
      arr[arrOffset++] = 0b10000000 | ((codePoint & 0b00000000000000111111000000000000) >>> 12);
      arr[arrOffset++] = 0b10000000 | ((codePoint & 0b00000000000000000000111111000000) >>> 6);
      arr[arrOffset++] = 0b10000000 | ((codePoint & 0b00000000000000000000000000111111) >>> 0);
    }
  }

  return arr;
}
/**
 * A manual decoding of a UTF8 string.
 * Use only in environments which do not offer native conversion methods!
 */
export function decodeUTF8(buffer: Uint8Array): string {
  // https://en.wikipedia.org/wiki/UTF-8

  const len = buffer.byteLength;
  const result: string[] = [];
  let offset = 0;
  while (offset < len) {
    const v0 = buffer[offset];
    let codePoint: number;
    if (v0 >= 0b11110000 && offset + 3 < len) {
      // 4 bytes
      codePoint =
        (((buffer[offset++] & 0b00000111) << 18) >>> 0) |
        (((buffer[offset++] & 0b00111111) << 12) >>> 0) |
        (((buffer[offset++] & 0b00111111) << 6) >>> 0) |
        (((buffer[offset++] & 0b00111111) << 0) >>> 0);
    } else if (v0 >= 0b11100000 && offset + 2 < len) {
      // 3 bytes
      codePoint =
        (((buffer[offset++] & 0b00001111) << 12) >>> 0) |
        (((buffer[offset++] & 0b00111111) << 6) >>> 0) |
        (((buffer[offset++] & 0b00111111) << 0) >>> 0);
    } else if (v0 >= 0b11000000 && offset + 1 < len) {
      // 2 bytes
      codePoint =
        (((buffer[offset++] & 0b00011111) << 6) >>> 0) |
        (((buffer[offset++] & 0b00111111) << 0) >>> 0);
    } else {
      // 1 byte
      codePoint = buffer[offset++];
    }

    if ((codePoint >= 0 && codePoint <= 0xd7ff) || (codePoint >= 0xe000 && codePoint <= 0xffff)) {
      // Basic Multilingual Plane
      result.push(String.fromCharCode(codePoint));
    } else if (codePoint >= 0x010000 && codePoint <= 0x10ffff) {
      // Supplementary Planes
      const uPrime = codePoint - 0x10000;
      const w1 = 0xd800 + ((uPrime & 0b11111111110000000000) >>> 10);
      const w2 = 0xdc00 + ((uPrime & 0b00000000001111111111) >>> 0);
      result.push(String.fromCharCode(w1));
      result.push(String.fromCharCode(w2));
    } else {
      // illegal code point
      result.push(String.fromCharCode(0xfffd));
    }
  }

  return result.join('');
}

export function getNextCodePoint(str: string, len: number, offset: number): number {
  const charCode = str.charCodeAt(offset);
  if (isHighSurrogate(charCode) && offset + 1 < len) {
    const nextCharCode = str.charCodeAt(offset + 1);
    if (isLowSurrogate(nextCharCode)) {
      return computeCodePoint(charCode, nextCharCode);
    }
  }
  return charCode;
}

/**
 * See http://en.wikipedia.org/wiki/Surrogate_pair
 */
export function isHighSurrogate(charCode: number): boolean {
  return 0xd800 <= charCode && charCode <= 0xdbff;
}

/**
 * See http://en.wikipedia.org/wiki/Surrogate_pair
 */
export function isLowSurrogate(charCode: number): boolean {
  return 0xdc00 <= charCode && charCode <= 0xdfff;
}

/**
 * See http://en.wikipedia.org/wiki/Surrogate_pair
 */
export function computeCodePoint(highSurrogate: number, lowSurrogate: number): number {
  return ((highSurrogate - 0xd800) << 10) + (lowSurrogate - 0xdc00) + 0x10000;
}
