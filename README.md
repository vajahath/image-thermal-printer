# image-thermal-printer

(Experimental, Pure ESM)

## Install

```sh
npm i @vaju/image-thermal-printer
```

## Usage

```ts
import { generatePrintCommandsForImage } from '@vaju/image-thermal-printer';

const printContent: Uint8Array = await generatePrintCommandsForImage('/the-2-time.webp', {
  cutAfterPrint: true,
  newLinesAfterImage: 3,
  printerWidthInPx: 300,
});
```

## FAQ

### How to find `printerWidthInPx`?

> px = mm * dpi / 25.4

- Common dpi values are `200` and `300`.
- Common mm values are 58mm (... need to find out). But in reality you have to subtract ~10mm as margin for both sides. If your rendered images is more than the maximum pixes available in printer, the printer crashes. Then you have to restart your printer.

**Eg:**
- 200 dpi
- 58 mm - 10mm = 48mm
- gives 377px

## License

MIT &copy; [Vajahath Ahmed](https://www.threads.net/@vajahath_)