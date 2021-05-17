/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-dupe-class-members */
/* eslint-disable no-param-reassign */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as strings from './strings';

declare const Buffer: any;

const hasBuffer = typeof Buffer !== 'undefined';
const hasTextEncoder = typeof TextEncoder !== 'undefined';
const hasTextDecoder = typeof TextDecoder !== 'undefined';

let textEncoder: TextEncoder | null;
let textDecoder: TextDecoder | null;

export class VSBuffer {
  static alloc(byteLength: number): VSBuffer {
    if (hasBuffer) {
      return new VSBuffer(Buffer.allocUnsafe(byteLength));
    }
    return new VSBuffer(new Uint8Array(byteLength));
  }

  static wrap(actual: Uint8Array): VSBuffer {
    if (hasBuffer && !Buffer.isBuffer(actual)) {
      // https://nodejs.org/dist/latest-v10.x/docs/api/buffer.html#buffer_class_method_buffer_from_arraybuffer_byteoffset_length
      // Create a zero-copy Buffer wrapper around the ArrayBuffer pointed to by the Uint8Array
      actual = Buffer.from(actual.buffer, actual.byteOffset, actual.byteLength);
    }
    return new VSBuffer(actual);
  }

  static fromString(source: string, options?: { dontUseNodeBuffer?: boolean }): VSBuffer {
    const dontUseNodeBuffer = options?.dontUseNodeBuffer || false;
    if (!dontUseNodeBuffer && hasBuffer) {
      return new VSBuffer(Buffer.from(source));
    }
    if (hasTextEncoder) {
      if (!textEncoder) {
        textEncoder = new TextEncoder();
      }
      return new VSBuffer(textEncoder.encode(source));
    }
    return new VSBuffer(strings.encodeUTF8(source));
  }

  static concat(buffers: VSBuffer[], totalLength?: number): VSBuffer {
    if (typeof totalLength === 'undefined') {
      totalLength = 0;
      for (let i = 0, len = buffers.length; i < len; i++) {
        totalLength += buffers[i].byteLength;
      }
    }

    const ret = VSBuffer.alloc(totalLength);
    let offset = 0;
    for (let i = 0, len = buffers.length; i < len; i++) {
      const element = buffers[i];
      ret.set(element, offset);
      offset += element.byteLength;
    }

    return ret;
  }

  readonly buffer: Uint8Array;
  readonly byteLength: number;

  private constructor(buffer: Uint8Array) {
    this.buffer = buffer;
    this.byteLength = this.buffer.byteLength;
  }

  toString(): string {
    if (hasBuffer) {
      return this.buffer.toString();
    }
    if (hasTextDecoder) {
      if (!textDecoder) {
        textDecoder = new TextDecoder();
      }
      return textDecoder.decode(this.buffer);
    }
    return strings.decodeUTF8(this.buffer);
  }

  slice(start?: number, end?: number): VSBuffer {
    // IMPORTANT: use subarray instead of slice because TypedArray#slice
    // creates shallow copy and NodeBuffer#slice doesn't. The use of subarray
    // ensures the same, performant, behaviour.
    return new VSBuffer(this.buffer.subarray(start! /*bad lib.d.ts*/, end));
  }

  set(array: VSBuffer, offset?: number): void;
  set(array: Uint8Array, offset?: number): void;
  set(array: VSBuffer | Uint8Array, offset?: number): void {
    if (array instanceof VSBuffer) {
      this.buffer.set(array.buffer, offset);
    } else {
      this.buffer.set(array, offset);
    }
  }

  readUInt32BE(offset: number): number {
    return readUInt32BE(this.buffer, offset);
  }

  writeUInt32BE(value: number, offset: number): void {
    writeUInt32BE(this.buffer, value, offset);
  }

  readUInt32LE(offset: number): number {
    return readUInt32LE(this.buffer, offset);
  }

  writeUInt32LE(value: number, offset: number): void {
    writeUInt32LE(this.buffer, value, offset);
  }

  readUInt8(offset: number): number {
    return readUInt8(this.buffer, offset);
  }

  writeUInt8(value: number, offset: number): void {
    writeUInt8(this.buffer, value, offset);
  }
}

export function readUInt16LE(source: Uint8Array, offset: number): number {
  return ((source[offset + 0] << 0) >>> 0) | ((source[offset + 1] << 8) >>> 0);
}

export function writeUInt16LE(destination: Uint8Array, value: number, offset: number): void {
  destination[offset + 0] = value & 0b11111111;
  value = value >>> 8;
  destination[offset + 1] = value & 0b11111111;
}

export function readUInt32BE(source: Uint8Array, offset: number): number {
  return (
    source[offset] * 2 ** 24 +
    source[offset + 1] * 2 ** 16 +
    source[offset + 2] * 2 ** 8 +
    source[offset + 3]
  );
}

export function writeUInt32BE(destination: Uint8Array, value: number, offset: number): void {
  destination[offset + 3] = value;
  value = value >>> 8;
  destination[offset + 2] = value;
  value = value >>> 8;
  destination[offset + 1] = value;
  value = value >>> 8;
  destination[offset] = value;
}

export function readUInt32LE(source: Uint8Array, offset: number): number {
  return (
    ((source[offset + 0] << 0) >>> 0) |
    ((source[offset + 1] << 8) >>> 0) |
    ((source[offset + 2] << 16) >>> 0) |
    ((source[offset + 3] << 24) >>> 0)
  );
}

export function writeUInt32LE(destination: Uint8Array, value: number, offset: number): void {
  destination[offset + 0] = value & 0b11111111;
  value = value >>> 8;
  destination[offset + 1] = value & 0b11111111;
  value = value >>> 8;
  destination[offset + 2] = value & 0b11111111;
  value = value >>> 8;
  destination[offset + 3] = value & 0b11111111;
}

export function readUInt8(source: Uint8Array, offset: number): number {
  return source[offset];
}

export function writeUInt8(destination: Uint8Array, value: number, offset: number): void {
  destination[offset] = value;
}
