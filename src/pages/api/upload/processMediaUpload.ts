
import { NextApiRequest, NextApiResponse } from 'next';
import S3 from 'aws-sdk/clients/s3';
import { randomUUID } from 'crypto';

const aws = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
  signatureVersion: "v4"
});



const processImage = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const ext = (req.query.fileType as string).split('/')[1];
    const Key = `${randomUUID()}.${ext}`;
    //send keys to aws s3 to get presigned url ,make that api call
    const uploadUrl = await aws.getSignedUrlPromise('putObject', {
      Bucket: process.env.BUCKET_NAME,
      Key,
      Expires: 60,
      ContentType: "image/" + ext
    });


    return res.status(200).json({ uploadUrl: uploadUrl, Key: Key });

  } catch (error) {
    console.error('Error processing image URL:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export default processImage;
