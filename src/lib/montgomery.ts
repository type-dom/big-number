// Montgomery reduction
import { BigNumber, nbi } from './big-number';

export class Montgomery {
  m: BigNumber;
  mp: number;
  mpl: number;
  mph: number;
  um: number;
  mt2: number;

  constructor(m: BigNumber) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp & 0x7fff;
    this.mph = this.mp >> 15;
    this.um = (1 << (m.DB - 15)) - 1;
    this.mt2 = 2 * m.t;
  }

  convert(x: BigNumber): BigNumber {
    let r = nbi();
    x.abs().dlShiftTo(this.m.t, r);
    r.divRemTo(this.m, null, r);
    if (x.s < 0 && r.compareTo(BigNumber.ZERO) > 0) this.m.subTo(r, r);
    return r;
  }

  revert(x: BigNumber) {
    let r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  }

  reduce(x: BigNumber): void {
    while (x.t <= this.mt2) // pad x so am has enough room later
    {
      x[x.t++] = 0;
    }
    for (let i = 0; i < this.m.t; ++i) {
      // faster way of calculating u0 = x[i]*mp mod DV
      let j = x[i] & 0x7fff;
      let u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM;
      // use am to combine the multiply-shift-add into one call
      j = i + this.m.t;
      x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
      // propagate carry
      while (x[j] >= x.DV) {
        x[j] -= x.DV;
        x[++j]++;
      }
    }
    x.clamp();
    x.drShiftTo(this.m.t, x);
    if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
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
