import { Step } from '@3dp4me/types'

import { getAllStepsMetadata } from '../api/api'
import { sortMetadata } from '../utils/utils'
import { queryClient, QueryKeys } from './query'
import { useErrorWrappedQuery } from './useErrorWrappedQuery'

export interface UseStepsOptions {
    includeHiddenFields: boolean
    includeReservedSteps?: boolean
}

const getStepsQueryKey = (includeHiddenFields: boolean, includeReservedSteps: boolean) => [
    QueryKeys.Steps,
    `${includeHiddenFields}:${includeReservedSteps}`,
]

const getStepsQuery = ({ includeHiddenFields, includeReservedSteps = false }: UseStepsOptions) => ({
    queryKey: getStepsQueryKey(includeHiddenFields, includeReservedSteps),
    queryFn: async () => {
        const res = await getAllStepsMetadata(includeHiddenFields, includeReservedSteps)
        return sortMetadata(res.result)
    },
})

export const useSteps = (opts: UseStepsOptions) => useErrorWrappedQuery<Step[]>(getStepsQuery(opts))

export const useInvalidateSteps = () => () =>
    queryClient.invalidateQueries({
        queryKey: [QueryKeys.Steps],
    })
