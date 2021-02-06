import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';

interface IUploadConfig {
  folderTmp: string;
  folderUpload: string;

  multer: {
    storage: StorageEngine;
  };
}

const folderTmp = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  folderTmp,
  folderUpload: path.join(folderTmp, 'uploads'),
  multer: {
    storage: multer.diskStorage({
      destination: folderTmp,
      filename: (req, file, callback) => {
        const originalName = file.originalname.replace(/ /g, '-');
        const nameHash = crypto.randomBytes(10).toString('hex');
        return callback(null, `${nameHash}-${originalName}`);
      },
    }),
  },
} as IUploadConfig;
