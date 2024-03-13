import { rng_get_byte } from './big-number';

export class SecureRandom {
  nextBytes(ba: number[]): void {
    let i;
    for (i = 0; i < ba.length; ++i) ba[i] = rng_get_byte();
  }
}
