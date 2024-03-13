// Modular reduction using "classic" algorithm
import { BigNumber } from './big-number';

export class Classic {
  m: BigNumber;

  constructor(m: BigNumber) {
    this.m = m;
  }

  convert(x: BigNumber): BigNumber {
    if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
    else return x;
  }

  revert(x: BigNumber): BigNumber {
    return x;
  }

  reduce(x: BigNumber): void {
    x.divRemTo(this.m, null, x);
  }

  mulTo(x: BigNumber, y: BigNumber, r: BigNumber): void {
    x.multiplyTo(y, r);
    this.reduce(r);
  }

  sqrTo(x: BigNumber, r: BigNumber): void {
    x.squareTo(r);
    this.reduce(r);
  }
}
