import { generatePrintCommandsForImage } from '@vaju/image-thermal-printer';
import { autoLoadPrinter, getPrinter, printerInfo$ } from './usb-printer-provider';
import { fromEvent, map, shareReplay, startWith, switchMap } from 'rxjs';

document.addEventListener('DOMContentLoaded', async () => {
  await autoLoadPrinter();
  console.log('Auto load attempt finished');

  printerInfo$.subscribe(data => {
    const printerInfoEl = document.getElementById('printer-info');
    if (!printerInfoEl) throw new Error('No printer info element');
    printerInfoEl.textContent = JSON.stringify(data, null, 2);
  });
});

const imageSourceInputElement = document.getElementById('print-source') as HTMLInputElement;

if (!imageSourceInputElement) throw new Error('Unable to detect source image input element');

const imageSource$ = fromEvent(imageSourceInputElement, 'input').pipe(
  map(event => (event?.target as any).value as string),
  startWith(imageSourceInputElement.value),
  shareReplay(1)
);

imageSource$.subscribe(src => {
  const imageContainer = document.getElementById('image-container');
  if (!imageContainer) throw new Error('No image container');

  imageContainer.replaceChildren();

  const img = document.createElement('img');
  img.src = src;

  imageContainer.appendChild(img);
});

const imagePrintButtonEl = document.getElementById('image-print');

if (!imagePrintButtonEl) throw new Error('No image print button');

const imagePrintOnClick$ = fromEvent(imagePrintButtonEl, 'click');

imagePrintOnClick$.pipe(switchMap(() => imageSource$)).subscribe(async src => {
  const printer = await getPrinter();
  if (!printer) {
    alert('Printer not authorized / connected');
    return;
  }

  const printContent = await generatePrintCommandsForImage(src, {
    cutAfterPrint: true,
    newLinesAfterImage: 1,
    printerWidthInPx: 377,
    useDithering: 'floyd-steinberg',
  });

  console.log('Prepared print data. Starting to print');

  await printer.transferOut(3, printContent);
  console.log('Print completed');
});
