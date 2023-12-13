import { Image } from './image/Image.js';
import { floydSteinberg } from './image/transforms/index.js';

import { initialize, image, Cmd, cut, newLine, getData } from './printer/index.js';

export { Cmd };

export async function generatePrintCommandsForImage(
  imageToPrint: string,
  printerOptions: IPrinterOptions
) {
  const processableImage = await readImage(imageToPrint);

  const transformedImage = floydSteinberg(processableImage);

  const commands: Cmd[] = [initialize()];

  commands.push(image(transformedImage));

  if (printerOptions.newLinesAfterImage) {
    let index = 0;
    for (; index <= printerOptions.newLinesAfterImage; index++) {
      commands.push(newLine());
    }
  }

  if (printerOptions.cutAfterPrint) {
    cut();
  }

  commands.push(newLine());

  return getData(commands);
}

export interface IPrinterOptions {
  cutAfterPrint: boolean;
  newLinesAfterImage: number;
}

export function readImage(src: string) {
  return new Promise<Image>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = '';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const context = canvas.getContext('2d');
      if (context == null) {
        reject(new Error('cannot get context'));
        return;
      }

      context.drawImage(img, 0, 0);
      const { data } = context.getImageData(0, 0, img.width, img.height);
      resolve({
        data: new Uint8Array(data),
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = err => reject(err);
    img.src = src;
  });
}
