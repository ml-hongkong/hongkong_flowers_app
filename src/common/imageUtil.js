import { Image, ImageEditor } from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import FetchBlob from 'react-native-fetch-blob';
import Config from 'react-native-config';

export const cropImage = (uri, offset, size) => (
  new Promise((resolve, reject) => {
    ImageEditor.cropImage(uri, {
      offset,
      size,
    },
    _uri => resolve(_uri),
    err => reject(err));
  })
);

export const resizeImage = (uri, { size, format, quality } = {
  size: parseInt(Config.IMAGE_SIZE, 10) || 1440,
  format: 'JPEG',
  quality: 75,
}) => (
  new Promise((resolve, reject) => {
    Image.getSize(uri, async (width, height) => {
      const minSize = Math.min(width, height);
      const cropSize = {
        width: minSize,
        height: minSize,
      };
      const offset = { x: 0, y: (height - minSize) / 2 };

      try {
        const cropedImageUri = await cropImage(uri, offset, cropSize);
        const resizedImage = await ImageResizer.createResizedImage(
          cropedImageUri,
          size,
          size,
          format,
          quality,
        );
        resolve({
          name: resizedImage.name,
          size: resizedImage.size,
          uri: resizedImage.uri,
          originalUri: uri,
        });
      } catch (error) {
        reject(error);
      }
    });
  })
);

export const imageUriToBase64 = async (uri) => {
  try {
    const base64Data = await FetchBlob.fs.readFile(uri, 'base64');
    return base64Data;
  } catch (error) {
    throw error;
  }
};

export default {
  cropImage,
  resizeImage,
  imageUriToBase64,
};
