import { CanvasImageData } from '../Image.js';

export interface ImageTransform {
  (image: CanvasImageData): CanvasImageData;
}
