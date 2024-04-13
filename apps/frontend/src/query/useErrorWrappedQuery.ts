import { DefaultError, QueryClient, QueryKey } from '@tanstack/query-core'
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { useEffect } from 'react'

import { useSetError } from '../hooks/uesSetError'

/**
 * This is a wrapper around useQuery that will set the global error state
 * if an error returns. We should be using this for all of our queries.
 */
export const useErrorWrappedQuery = <
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey
>(
    options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient
): UseQueryResult<TData, TError> => {
    const queryResults = useQuery(options, queryClient)
    const { isError, error } = queryResults
    const setError = useSetError()

    useEffect(() => {
        if (isError) {
            setError(error?.toString() || 'An error occurred')
        }
    }, [isError, error, setError])

    return queryResults
}
