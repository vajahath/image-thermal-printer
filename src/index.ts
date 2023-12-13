import { initialize, image, Cmd, cut, newLine, getData } from './printer/index.js';

export { Cmd };

export async function generatePrintCommandsForImage(
  imageToPrint: Uint8Array | Blob | ArrayBuffer,
  imageOptions: { width: number; height: number },
  printerOptions: IPrinterOptions
) {
  const processableImage: Uint8Array =
    imageToPrint instanceof Blob
      ? new Uint8Array(await imageToPrint.arrayBuffer())
      : imageToPrint instanceof ArrayBuffer
      ? new Uint8Array(imageToPrint)
      : imageToPrint;

  const commands: Cmd[] = [initialize()];

  commands.push(image({ data: processableImage, ...imageOptions }));

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
  cutAfterPrint: boolean;
  newLinesAfterImage: number;
}
