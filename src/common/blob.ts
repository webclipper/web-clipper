const Base64ImageToBlob = (image: string): Blob => {
  const arr = image.split(',');
  const mime = arr[0].match(/:(.*?);/)![1] || 'image/png';
  const bytes = window.atob(arr[1]);
  let ab = new ArrayBuffer(bytes.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  const blob = new Blob([ab], {
    type: mime,
  });
  return blob;
};

function loadImage(date: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = date;
  });
}

export { Base64ImageToBlob, loadImage };
