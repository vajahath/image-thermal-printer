import { Image, imageToRaster, ImageToRasterOptions } from '../image/index.js';

import { cashdraw as cashdrawCmd } from './commands/cashdraw.js';
import { LF } from './commands/common.js';
import { cut as cutCmd } from './commands/cut.js';
import { image as imageCmd } from './commands/image.js';
import { initialize as initializeCmd } from './commands/initialize.js';

export type CashDrawerPin = '2pin' | '5pin';

export interface Cmd {
  name: string;
  args?: unknown[];
  data: number[];
}

export function raw(data: Uint8Array) {
  return {
    name: 'raw',
    args: [data],
    data: Array.from(data),
  };
}

export function newLine() {
  return {
    name: 'newLine',
    data: [LF],
  };
}

export function cut(partial = false) {
  return {
    name: 'cut',
    data: cutCmd(partial ? 49 : 48),
  };
}

export function image(img: Image, options?: ImageToRasterOptions) {
  const size = new ArrayBuffer(4);
  const view = new DataView(size);
  view.setUint16(0, Math.ceil(img.width / 8), true);
  view.setUint16(2, img.height, true);

  const [xL, xH, yL, yH] = [...new Uint8Array(size).values()] as [number, number, number, number];

  return {
    name: 'image',
    args: [img.data.byteLength, img.width, img.height],
    data: imageCmd(0, xL, xH, yL, yH, imageToRaster(img, options)),
  };
}

export function cashdraw(pin: CashDrawerPin) {
  const m = (() => {
    switch (pin) {
      case '2pin':
        return 0;
      case '5pin':
        return 1;
    }
  })();

  return {
    name: 'cashdraw',
    args: [pin],
    data: cashdrawCmd(m, 0x19, 0x78),
  };
}

export function initialize() {
  return {
    name: 'initialize',
    data: initializeCmd(),
  };
}

export function getData(commands: Cmd[]): Uint8Array {
  const data = commands.flatMap(x => x.data);
  return new Uint8Array(data);
}
