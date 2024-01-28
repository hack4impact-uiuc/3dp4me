import { useQuery } from "@tanstack/react-query";
import { QueryKeys, queryClient } from "./query";
import { Paginated, getPatientsByPageNumberAndSearch, getPatientsByStageAndPageNumberAndSearch } from "../api/api";
import { Patient } from "@3dp4me/types";

export interface UsePatientsOptions {
    stepKey?: string
    page: number
    limit: number
    query: string
}

const getPatientsQueryKey = ({
    stepKey,
    page,
    limit,
    query
}: UsePatientsOptions) => [QueryKeys.Patients, `${page}-${limit}-${query}$${stepKey}`]

const getPatientsQuery = (opts: UsePatientsOptions) => ({
    queryKey: getPatientsQueryKey(opts),
    queryFn: async () => {
        if (opts.stepKey === undefined) {
            const res = await getPatientsByPageNumberAndSearch(opts.page, opts.limit, opts.query)
            return res.result
        }

        if (opts.stepKey === '')
            return { data: [], count: 0 }

        const res = await getPatientsByStageAndPageNumberAndSearch(opts.stepKey, opts.page, opts.limit, opts.query)
        return res.result
    },
})


export const usePatients = (opts: UsePatientsOptions) => {
    return useQuery<Paginated<Patient[]>>(
        getPatientsQuery(opts)
    )
}

export const useInvalidatePatients = () => () =>
    queryClient.invalidateQueries({
        queryKey: [QueryKeys.Patients]
    })
