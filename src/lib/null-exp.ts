// A "null" reducer
import { BigNumber } from './big-number';

export class NullExp {
  convert(x: BigNumber): BigNumber {
    return x;
  }

  revert(x: BigNumber): BigNumber {
    return x;
  }

  mulTo(x: BigNumber, y: BigNumber, r: BigNumber): void {
    x.multiplyTo(y, r);
  }

  sqrTo(x: BigNumber, r: BigNumber): void {
    x.squareTo(r);
  }
}
