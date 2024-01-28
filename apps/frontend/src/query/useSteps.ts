import { useQuery } from "@tanstack/react-query";
import { QueryKeys, queryClient } from "./query";
import { getAllStepsMetadata, getPatientById } from "../api/api";
import { Patient, Step } from "@3dp4me/types";
import { sortMetadata } from "../utils/utils";

export interface UseStepsOptions {
    includeHiddenFields: boolean
}


const getStepsQueryKey = (
    includeHiddenFields: boolean,
) => [QueryKeys.Steps, includeHiddenFields]

const getStepsQuery = ({
    includeHiddenFields
}: UseStepsOptions) => ({
    queryKey: getStepsQueryKey(includeHiddenFields),
    queryFn: async () => {
        const res = await getAllStepsMetadata(includeHiddenFields)
        return sortMetadata(res.result)
    },
})

export const useSteps = (opts: UseStepsOptions) => {
    return useQuery<Step[]>(
        getStepsQuery(opts)
    )
}

export const useInvalidateSteps = () => () =>
    queryClient.invalidateQueries({
        queryKey: [QueryKeys.Steps]
    })
