import AWS from 'aws-sdk';
import { S3_REGION } from './awsExports';

AWS.config.update({ region: S3_REGION });
