import { Patient } from '@3dp4me/types'

import { getPatientById } from '../api/api'
import { queryClient, QueryKeys } from './query'
import { useErrorWrappedQuery } from './useErrorWrappedQuery'

const getPatientQueryKey = (patientId: string) => [QueryKeys.Patient, patientId]

const getPatientQuery = (patientId: string) => ({
    queryKey: getPatientQueryKey(patientId),
    queryFn: async () => {
        const res = await getPatientById(patientId)
        return res.result
    },
})

export const usePatient = (patientId: string) =>
    useErrorWrappedQuery<Patient>(getPatientQuery(patientId))

export const useInvalidatePatient = (patientId: string) => () =>
    queryClient.invalidateQueries({
        queryKey: getPatientQueryKey(patientId),
    })
