export const cropImage = (image, crop) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
  
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        600,
        600
      );
  
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };
  