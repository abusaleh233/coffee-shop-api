import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(config: ConfigService) {
    cloudinary.config({
      cloud_name: config.getOrThrow('CLOUDINARY_CLOUD_NAME'),
      api_key: config.getOrThrow('CLOUDINARY_API_KEY'),
      api_secret: config.getOrThrow('CLOUDINARY_API_SECRET'),
    });
  }

  upload(file: Express.Multer.File, folder = 'coffee-shop'): Promise<string> {
    return new Promise((resolve, reject) =>
      cloudinary.uploader
        .upload_stream({ folder, resource_type: 'image' }, (err, res) =>
          err || !res ? reject(err) : resolve(res.secure_url),
        )
        .end(file.buffer),
    );
  }
}
