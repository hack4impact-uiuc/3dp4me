import { AccessLevel } from '@3dp4me/types';
import { AdminGetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';

export interface AuthenticatedUser extends AdminGetUserResponse {
    roles: string[]
    name: string
    accessLevel: AccessLevel
}