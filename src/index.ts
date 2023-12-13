import { Image } from './image/Image.js';
import { floydSteinberg } from './image/transforms/index.js';

import { initialize, image, Cmd, cut, newLine, getData } from './printer/index.js';

export { Cmd };

export async function generatePrintCommandsForImage(
  imageToPrint: string,
  printerOptions: IPrinterOptions
) {
  const canvasImageData = await readImage(imageToPrint, printerOptions.printerWidthInPx);
  const floydImage = floydSteinberg(canvasImageData);

  const commands: Cmd[] = [initialize()];

  if (printerOptions.newLinesBeforeImage) {
    let index = 0;
    for (; index <= printerOptions.newLinesBeforeImage; index++) {
      commands.push(newLine());
    }
  }

  commands.push(image(floydImage));

  if (printerOptions.newLinesAfterImage) {
    let index = 0;
    for (; index <= printerOptions.newLinesAfterImage; index++) {
      commands.push(newLine());
    }
  }

  if (printerOptions.cutAfterPrint) {
    cut();
  }

  return getData(commands);
}

export interface IPrinterOptions {
  printerWidthInPx: number;
  cutAfterPrint?: boolean;
  newLinesAfterImage?: number;
  newLinesBeforeImage?: number;
}

export function readImage(src: string, printWidthInPx: number) {
  return new Promise<Image>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = '';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = printWidthInPx;
      canvas.height = (canvas.width * img.height) / img.width;

      const context = canvas.getContext('2d');
      if (context == null) {
        reject(new Error('cannot get context'));
        return;
      }

      context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
      const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
      resolve({
        data: new Uint8Array(data),
        width: canvas.width,
        height: canvas.height,
      });
    };
    img.onerror = err => reject(err);
    img.src = src;
  });
}
