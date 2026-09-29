import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinaryProvider: any) {}

  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    const config = cloudinary.config();
    console.log('Cloudinary Config Check - Cloud Name:', config.cloud_name);
    
    if (!config.cloud_name) {
      console.error('Cloudinary is NOT configured! Check CloudinaryProvider.');
    }

    console.log('CloudinaryService: Starting upload for field:', file.fieldname);
    if (!file.buffer) {
      console.error('CloudinaryService: No file buffer found! Check multer configuration.');
      return Promise.reject(new Error('No file buffer found'));
    }

    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream((error, result) => {
        if (error) {
          console.error('Cloudinary Upload Stream Error:', error);
          return reject(error);
        }
        if (!result) {
          console.error('Cloudinary Upload Error: No result returned');
          return reject(new Error('Cloudinary upload failed'));
        }
        console.log('Cloudinary Upload Success:', result.secure_url);
        resolve(result as CloudinaryResponse);
      });

      try {
        streamifier.createReadStream(file.buffer).pipe(upload);
      } catch (err) {
        console.error('Streamifier/Pipe Error:', err);
        reject(err);
      }
    });
  }
}
