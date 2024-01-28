import { AccessLevel } from '@3dp4me/types';
import { AdminGetUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider';

export interface AuthenticatedUser extends AdminGetUserCommandOutput {
    roles: string[]
    name: string
    accessLevel: AccessLevel
}