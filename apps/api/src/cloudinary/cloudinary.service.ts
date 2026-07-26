import { Injectable, Inject } from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinary: typeof Cloudinary,
  ) {}

  async uploadImage(file: Express.Multer.File) {
    return new Promise<any>((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream(
          {
            folder: 'krevvy/products',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async deleteImage(publicId: string) {
    return this.cloudinary.uploader.destroy(publicId);
  }
}