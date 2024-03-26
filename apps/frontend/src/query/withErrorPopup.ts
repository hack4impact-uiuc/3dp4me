import { UseQueryResult } from "@tanstack/react-query";
import { useSetError } from "../hooks/uesSetError";

/**
 * HOC that takes a react query provider and sets the global error in the 
 * store if it errors out.
 */
export const withErrorPopup = <T, E>(r: UseQueryResult<T, E>) => {
    const setError = useSetError()

    if (r.error) {
        setError(r.error)
    }

    return r;
}