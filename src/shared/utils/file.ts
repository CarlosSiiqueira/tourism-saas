import path from "path";
import fs from 'fs'

export const uploadImage = (base64Image: string, fileName: string, filePath: string) => {
  const base64Data = base64Image.split(',')[1]
  fs.writeFileSync(filePath, base64Data, 'base64');
}

export const removeFile = async (filePath: string) => {

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting the file:', err);
      return;
    }

    console.log('File deleted successfully');
  });
}

export const checkFile = async (filePath: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}
