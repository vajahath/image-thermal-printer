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

const canvas = await readImage('/text.png', 400);

canvasHolderDiv.appendChild(canvas);

export {};
