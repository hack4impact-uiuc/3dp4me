import { Step } from '@3dp4me/types'
import { useQuery } from '@tanstack/react-query'

import { getAllStepsMetadata } from '../api/api'
import { sortMetadata } from '../utils/utils'
import { queryClient, QueryKeys } from './query'
import { useErrorWrappedQuery } from './useErrorWrappedQuery'

export interface UseStepsOptions {
    includeHiddenFields: boolean
}

const getStepsQueryKey = (includeHiddenFields: boolean) => [QueryKeys.Steps, includeHiddenFields]

const getStepsQuery = ({ includeHiddenFields }: UseStepsOptions) => ({
    queryKey: getStepsQueryKey(includeHiddenFields),
    queryFn: async () => {
        const res = await getAllStepsMetadata(includeHiddenFields)
        return sortMetadata(res.result)
    },
})

export const useSteps = (opts: UseStepsOptions) => useErrorWrappedQuery<Step[]>(getStepsQuery(opts))

export const useInvalidateSteps = () => () =>
    queryClient.invalidateQueries({
        queryKey: [QueryKeys.Steps],
    })
