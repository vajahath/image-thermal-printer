import './style.css';
import { generatePrintCommandsForImage } from 'image-thermal-printer';

let device: USBDevice | undefined;

document.getElementById('test-print')?.addEventListener('click', async () => {
  await connectPrinter();
  console.log(device);
  console.log('Clicked, preparing data...');

  const printContent: Uint8Array = await generatePrintCommandsForImage('/the-2-time.webp', {
    cutAfterPrint: true,
    newLinesAfterImage: 3,
    printerWidthInPx: 377,
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
