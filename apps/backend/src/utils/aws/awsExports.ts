export interface BucketConfig {
    bucketName: string;
    region: string;
}

export const PATIENT_BUCKET: BucketConfig = {
    bucketName: process.env.S3_BUCKET_NAME!,
    region: process.env.S3_REGION!,
}

export const PUBLIC_BUCKET: BucketConfig = {
    bucketName: process.env.S3_PUBLIC_BUCKET_NAME!,
    region: process.env.S3_PUBLIC_REGION!,
}

export const COGNITO_REGION = process.env.COGNITO_REGION!;
export const USER_POOL_ID = process.env.USER_POOL_ID!;
export const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID!;
export const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY!;
export const SECURITY_ROLE_ATTRIBUTE_NAME = 'custom:security_roles';
export const SECURITY_ACCESS_ATTRIBUTE_NAME = 'custom:access';
export const SECURITY_ROLE_ATTRIBUTE_MAX_LEN = 1024;
