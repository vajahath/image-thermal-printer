import { generatePrintCommandsForImage } from '@vaju/image-thermal-printer';

function readImage(src: string, printWidthInMm: number) {
  return new Promise<HTMLCanvasElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = '';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = printWidthInMm;
      canvas.height = (canvas.width * img.height) / img.width;

      const context = canvas.getContext('2d');
      if (context == null) {
        reject(new Error('cannot get context'));
        return;
      }

      context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

      resolve(canvas);
    };
    img.onerror = err => reject(err);
    img.src = src;
  });
}

const canvasHolderDiv = document.getElementById('canvas-holder') as HTMLDivElement;

const canvas = await readImage('/insta.png', 377);

canvasHolderDiv.appendChild(canvas);

const printButton = document.getElementById('print') as HTMLButtonElement;

let device: USBDevice | undefined;

printButton.addEventListener('click', async () => {
  await connectPrinter();
  console.log(device);
  console.log('Clicked, preparing data...');

  const printContent = await generatePrintCommandsForImage({
    canvasElement: canvas,
    printerOptions: {
      cutAfterPrint: true,
      newLinesAfterImage: 3,
    },
  });

  console.log('Prepared print data. Starting to print', printContent);

  if (!device) {
    throw new Error('Print device not found');
  }

  await device.transferOut(3, printContent);
  console.log('Print completed');
});

async function connectPrinter() {
  if (device) {
    console.log('already connected to device');
    return;
  }

  device = await navigator.usb.requestDevice({
    filters: [],
  });

  console.log(device.productName);
  console.log(device.manufacturerName);
  console.log(device);

  await device.open();
  await device.selectConfiguration(1);
  await device.claimInterface(0);
}

export {};
