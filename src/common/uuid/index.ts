export interface UUID {
  /**
   * @returns the canonical representation in sets of hexadecimal numbers separated by dashes.
   */
  asHex(): string;
}

class ValueUUID implements UUID {
  constructor(public _value: string) {
    // empty
  }

  public asHex(): string {
    return this._value;
  }
}

class V4UUID extends ValueUUID {
  private static readonly _chars = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
  ];

  private static readonly _timeHighBits = ['8', '9', 'a', 'b'];

  constructor() {
    super(
      [
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        '-',
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        '-',
        '4',
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        '-',
        V4UUID._oneOf(V4UUID._timeHighBits),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        '-',
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
        V4UUID._randomHex(),
      ].join('')
    );
  }

  private static _oneOf(array: string[]): string {
    return array[Math.floor(array.length * Math.random())];
  }

  private static _randomHex(): string {
    return V4UUID._oneOf(V4UUID._chars);
  }
}

export function generateUuid(): string {
  return new V4UUID().asHex();
}
