import { useQuery } from "@tanstack/react-query";
import { QueryKeys, queryClient } from "./query";
import { Paginated, getPatientsByPageNumberAndSearch } from "../api/api";
import { Patient } from "@3dp4me/types";

export interface UsePatientsOptions {
    page: number
    limit: number
    query: string
}

const getPatientsQueryKey = ({
    page,
    limit,
    query
}: UsePatientsOptions) => [QueryKeys.Patients, `${page}-${limit}-${query}`]

const getPatientsQuery = (opts: UsePatientsOptions) => ({
    queryKey: getPatientsQueryKey(opts),
    queryFn: async () => {
        const res = await getPatientsByPageNumberAndSearch(opts.page, opts.limit, opts.query)
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
