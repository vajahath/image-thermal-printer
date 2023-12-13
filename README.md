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

## License

MIT &copy; [Vajahath Ahmed](https://www.threads.net/@vajahath_)