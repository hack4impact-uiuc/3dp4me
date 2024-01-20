import { Request } from 'express'

import { AuthenticatedUser } from '../utils/aws/types'

export interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser
}
