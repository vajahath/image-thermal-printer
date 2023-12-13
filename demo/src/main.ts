import './style.css';
import { generatePrintCommandsForImage } from 'image-thermal-printer';

const image = '/the-2-time.webp';
const blob = await fetch(image).then(response => {
  if (!response.ok) throw new Error('Unable to get image');
  console.log(response);
  return response.blob();
});

const printContent = await generatePrintCommandsForImage(
  blob,
  { width: 256, height: 256 },
  { cutAfterPrint: true, newLinesAfterImage: 0 }
);

console.log({ printContent });
