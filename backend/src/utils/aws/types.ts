import { AdminGetUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { AccessLevel } from '../constants';

export interface AuthenticatedUser extends AdminGetUserResponse {
    roles: string[]
    name: string
    accessLevel: AccessLevel
}