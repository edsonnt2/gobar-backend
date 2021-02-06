import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.folderTmp, file),
      path.resolve(uploadConfig.folderUpload, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const loadFile = path.resolve(uploadConfig.folderUpload, file);

    try {
      await fs.promises.stat(loadFile);
    } catch {
      return;
    }

    await fs.promises.unlink(loadFile);
  }
}

export default DiskStorageProvider;
