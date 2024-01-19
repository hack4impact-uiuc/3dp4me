import { Nullish } from '@3dp4me/types'
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

import { getCurrentSession } from '../aws/aws-helper'

let cachedJWTToken: Nullish<string> = null
const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL

// The configured axios instance to be exported
const instance = axios.create({
    baseURL: BASE_URL,
    validateStatus: () => true,
})

/**
 * Refetches the JWT token and caches it
 */
const updateCachedJWTToken = async () => {
    const session = await getCurrentSession()
    cachedJWTToken = session.getAccessToken().getJwtToken()
}

/**
 * Appends an authorization header to the request
 */
const addAuthHeader = async (config: InternalAxiosRequestConfig) => {
    const updatedConfig = config

    // Grab the JWT token
    if (!cachedJWTToken) await updateCachedJWTToken()

    // Add JWT Token to header
    if (cachedJWTToken) updatedConfig.headers.Authorization = `Bearer ${cachedJWTToken}`

    return updatedConfig
}

/**
 * Called when a request returns an error.
 * Set the token to null in case it was caused by an old auth token.
 */
const onRequestError = (error: AxiosError) => {
    cachedJWTToken = null
    return Promise.reject(error)
}

instance.interceptors.request.use(addAuthHeader, onRequestError)

export default instance
