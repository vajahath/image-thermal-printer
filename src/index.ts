import { type CanvasImageData } from './image/Image.js';
import { floydSteinberg } from './image/transforms/index.js';

import { initialize, image, Cmd, cut, newLine, getData } from './printer/index.js';

export { Cmd };

export function generatePrintCommandsForCanvas(
  canvasElement: HTMLCanvasElement,
  printerOptions: BaseOptions
) {
  const canvasImageData = readCanvas(canvasElement);
  return canvasImageDataToCmdBuffer(canvasImageData, printerOptions);
}

export async function generatePrintCommandsForImage(
  imageToPrint: string,
  printerOptions: IPrinterOptionsForImage
) {
  const canvasImageData = await readImage(imageToPrint, printerOptions.printerWidthInPx);
  return canvasImageDataToCmdBuffer(canvasImageData, printerOptions);
}

function canvasImageDataToCmdBuffer(
  canvasImageData: CanvasImageData,
  printerOptions: BaseOptions
): Uint8Array {
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
    commands.push(cut());
  }

  return getData(commands);
}

export interface IPrinterOptionsForImage extends BaseOptions {
  printerWidthInPx: number;
}

export interface BaseOptions {
  cutAfterPrint?: boolean;
  newLinesAfterImage?: number;
  newLinesBeforeImage?: number;
}

function readCanvas(canvasElement: HTMLCanvasElement): CanvasImageData {
  return {
    data: new Uint8Array(
      canvasElement
        .getContext('2d')!
        .getImageData(0, 0, canvasElement.width, canvasElement.height).data
    ),
    width: canvasElement.width,
    height: canvasElement.height,
  };
}

function readImage(src: string, printWidthInPx: number) {
  return new Promise<CanvasImageData>((resolve, reject) => {
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
