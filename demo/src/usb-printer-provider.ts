import { BehaviorSubject } from 'rxjs';

let printer: USBDevice | undefined;

const deviceConfiguration = 1;
const interfaceNumber = 0;

export const printerInfo$ = new BehaviorSubject<{
  productName?: string;
  manufacturerName?: string;
  serialNumber?: string;
  productId?: number;
}>({ productName: '', manufacturerName: '', serialNumber: '' });

/** If printer is already connected, load it */
export async function autoLoadPrinter() {
  if (printer) return;
  const devices = await navigator.usb.getDevices();

  if (devices.length === 0) {
    console.log('[auto load] No devices found');
    return;
  }

  if (devices.length > 1)
    throw new Error('Many devices found. Remove all and only attach the correct one');

  console.log('[auto load] device found');
  const [device] = devices;

  await device.open();
  await device.selectConfiguration(deviceConfiguration);
  await device.claimInterface(interfaceNumber);

  printer = device;
  printerInfo$.next({
    manufacturerName: device.manufacturerName,
    productName: device.productName,
    serialNumber: device.serialNumber,
    productId: device.productId,
  });
}

export async function getPrinter() {
  await autoLoadPrinter();
  if (printer) return printer;
  await _connectPrinter();
  return printer;
}

async function _connectPrinter() {
  const freshPrinter = await navigator.usb.requestDevice({
    filters: [],
  });

  if (!freshPrinter) return;

  printer = freshPrinter;

  await printer.open();
  await printer.selectConfiguration(deviceConfiguration);
  await printer.claimInterface(interfaceNumber);

  printerInfo$.next({
    manufacturerName: printer.manufacturerName,
    productName: printer.productName,
    serialNumber: printer.serialNumber,
    productId: printer.productId,
  });
}
