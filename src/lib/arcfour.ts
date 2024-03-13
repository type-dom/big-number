// Random number generator - requires a PRNG backend, e.g. prng4.js

// For best results, put code like
// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
// in your main HTML document.

// prng4.js - uses Arcfour as a PRNG

export class Arcfour {
  i: number;
  j: number;
  S: number[];

  constructor() {
    this.i = 0;
    this.j = 0;
    this.S = [];
  }

  // Initialize arcfour context from key, an array of ints, each from [0..255]
  init(key: number[]): void {
    let i;
    let j;
    let t;
    for (i = 0; i < 256; ++i) this.S[i] = i;
    j = 0;
    for (i = 0; i < 256; ++i) {
      j = (j + this.S[i] + key[i % key.length]) & 255;
      t = this.S[i];
      this.S[i] = this.S[j];
      this.S[j] = t;
    }
    this.i = 0;
    this.j = 0;
  }

  next(): number {
    let t;
    this.i = (this.i + 1) & 255;
    this.j = (this.j + this.S[this.i]) & 255;
    t = this.S[this.i];
    this.S[this.i] = this.S[this.j];
    this.S[this.j] = t;
    return this.S[(t + this.S[this.i]) & 255];
  }
}
