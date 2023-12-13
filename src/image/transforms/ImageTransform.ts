import { Image } from '../Image.js';

export interface ImageTransform {
  (image: Image): Image;
}
