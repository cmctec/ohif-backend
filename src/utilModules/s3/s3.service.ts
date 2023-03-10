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
    signatureVersion: 'v4',
  });

  async uploadPublicFile(
    dataBuffer: Buffer,
    mimetype: string,
    folder?: string,
  ) {
    const uploadResult = await this.s3
      .upload({
        Bucket: this.bucketData,
        Body: dataBuffer,
        ContentType: mimetype,
        Key: `${folder || ''}/${uuid()}`,
        ACL: 'public-read',
      })
      .promise();
    return { Location: uploadResult.Location, mimetype, ACL: 'public-read' };
  }
  async deletePublicFile(fileKey: string) {
    return await this.s3
      .deleteObject({ Bucket: this.bucketData, Key: fileKey })
      .promise();
  }
  async updatePublicFile(
    dataBuffer: Buffer,
    mimetype: string,
    image_url: string,
  ) {
    const Key = image_url.slice(
      'https://11076-dcm-archive.archive.pscloud.io/'.length,
    );
    await this.deletePublicFile(Key);
    const data = await this.s3
      .upload({
        Bucket: this.bucketData,
        Body: dataBuffer,
        ContentType: mimetype,
        Key,
        ACL: 'public-read',
      })
      .promise();
    console.log({ data });
  }
  async getSignedUrl(Key: string) {
    return this.s3.getSignedUrl('getObject', {
      Bucket: this.bucketData,
      Key,
      Expires: 604800,
    });
  }
}
