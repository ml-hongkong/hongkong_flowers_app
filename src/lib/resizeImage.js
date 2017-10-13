import { Image, ImageEditor } from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import Config from 'react-native-config';

const IMAGE_SIZE = parseInt(Config.IMAGE_SIZE, 10);

export const cropImage = (image, offset, size) =>
  new Promise((resolve, reject) => {
    ImageEditor.cropImage(image, {
      offset,
      size,
    },
    uri => resolve(uri),
    err => reject(err));
  });

export const resizeImage = (image) => {
  const path = image.path || image.uri;

  return new Promise((resolve) => {
    Image.getSize(path, (width, height) => {
      const minSize = Math.min(width, height);
      const cropSize = {
        width: minSize,
        height: minSize,
      };
      const offset = { x: 0, y: (height - minSize) / 2 };

      return cropImage(path, offset, cropSize)
        .then(newPath => ImageResizer.createResizedImage(newPath, IMAGE_SIZE, IMAGE_SIZE, 'JPEG', 75))
        .then(uri => resolve({ ...image, originalPicture: path, uri }));
    });
  });
};
