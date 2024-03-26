import { Patient } from '@3dp4me/types'
import { useQuery } from '@tanstack/react-query'

import { getPatientById } from '../api/api'
import { queryClient, QueryKeys } from './query'
import { withErrorPopup } from './withErrorPopup'

const getPatientQueryKey = (patientId: string) => [QueryKeys.Patient, patientId]

const getPatientQuery = (patientId: string) => ({
    queryKey: getPatientQueryKey(patientId),
    queryFn: async () => {
        const res = await getPatientById(patientId)
        return res.result
    },
})

export const usePatient = (patientId: string) => withErrorPopup(useQuery<Patient>(getPatientQuery(patientId)))

export const useInvalidatePatient = (patientId: string) => () =>
    queryClient.invalidateQueries({
        queryKey: getPatientQueryKey(patientId),
    })
