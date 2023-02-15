import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {}
  bucketData = this.configService.get('S3_PUBLIC_BUCKET_NAME');

  s3 = new S3({
    accessKeyId: this.configService.get('S3_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY'),
    region: this.configService.get('S3_REGION'),
    endpoint: this.configService.get('ENDPOINT'),
  });

  async uploadPublicFile(dataBuffer: Buffer, mimetype: string) {
    const uploadResult = await this.s3
      .upload({
        Bucket: this.bucketData,
        Body: dataBuffer,
        ContentType: mimetype,
        Key: `test_folder/${uuid()}`,
        ACL: 'public-read',
      })
      .promise();
    return { Location: uploadResult.Location, mimetype, ACL: 'public-read' };
  }
}