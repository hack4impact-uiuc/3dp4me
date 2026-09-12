import { Patient } from '@3dp4me/types'

import {
    getPatientsByPageNumberAndSearch,
    getPatientsByStageAndPageNumberAndSearch,
    Paginated,
} from '../api/api'
import { queryClient, QueryKeys } from './query'
import { useErrorWrappedQuery } from './useErrorWrappedQuery'

export interface UsePatientsOptions {
    stepKey?: string
    page: number
    limit: number
    query: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

const getPatientsQueryKey = ({ stepKey, page, limit, query, sortBy, sortOrder }: UsePatientsOptions) => [
    QueryKeys.Patients,
    `${page}-${limit}-${query}-${sortBy}-${sortOrder}$${stepKey}`,
]

const getPatientsQuery = (opts: UsePatientsOptions) => ({
    queryKey: getPatientsQueryKey(opts),
    queryFn: async () => {
        if (opts.stepKey === undefined) {
            const res = await getPatientsByPageNumberAndSearch(
                opts.page,
                opts.limit,
                opts.query,
                opts.sortBy,
                opts.sortOrder
            )
            return res.result
        }

        if (opts.stepKey === '') return { data: [], count: 0 }

        const res = await getPatientsByStageAndPageNumberAndSearch(
            opts.stepKey,
            opts.page,
            opts.limit,
            opts.query,
            opts.sortBy,
            opts.sortOrder
        )
        return res.result
    },
})

export const usePatients = (opts: UsePatientsOptions) =>
    useErrorWrappedQuery<Paginated<Patient[]>>(getPatientsQuery(opts))

export const useInvalidatePatients = () => () =>
    queryClient.invalidateQueries({
        queryKey: [QueryKeys.Patients],
    })
