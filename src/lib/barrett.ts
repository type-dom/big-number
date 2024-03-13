// Barrett modular reduction
import { BigNumber, nbi } from './big-number';

export class Barrett {
  r2: BigNumber;
  q3: BigNumber;
  mu: BigNumber;
  m: BigNumber;

  constructor(m: BigNumber) {
    // setup Barrett
    this.r2 = nbi();
    this.q3 = nbi();
    BigNumber.ONE.dlShiftTo(2 * m.t, this.r2);
    this.mu = this.r2.divide(m);
    this.m = m;
  }

  convert(x: BigNumber): BigNumber {
    if (x.s < 0 || x.t > 2 * this.m.t) {
      return x.mod(this.m);
    } else if (x.compareTo(this.m) < 0) {
      return x;
    } else {
      let r = nbi();
      x.copyTo(r);
      this.reduce(r);
      return r;
    }
  }

  revert(x: BigNumber): BigNumber {
    return x;
  }

  // x = x mod m (HAC 14.42)
  reduce(x: BigNumber): void {
    x.drShiftTo(this.m.t - 1, this.r2);
    if (x.t > this.m.t + 1) {
      x.t = this.m.t + 1;
      x.clamp();
    }
    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
    this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
    while (x.compareTo(this.r2) < 0) {
      x.dAddOffset(1, this.m.t + 1);
    }
    x.subTo(this.r2, x);
    while (x.compareTo(this.m) >= 0) {
      x.subTo(this.m, x);
    }
  }

  // r = x*y mod m; x,y !== r
  mulTo(x: BigNumber, y: BigNumber, r: BigNumber): void {
    x.multiplyTo(y, r);
    this.reduce(r);
  }

  // r = x^2 mod m; x !== r
  sqrTo(x: BigNumber, r: BigNumber): void {
    x.squareTo(r);
    this.reduce(r);
  }

}
