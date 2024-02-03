import { QueryClient } from '@tanstack/react-query'

const STALE_TIME_MS = 10_000 // 10 seconds

export enum QueryKeys {
    Patient = 'Patient',
    Patients = 'Patients',
    Steps = 'Steps',
}

/**
 * React Query is used to cache data and prevent unnecessary requests. The client
 * is instantiated here and passed to the QueryClientProvider so that it can be
 * used throughout the app.
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: STALE_TIME_MS,
        },
    },
})

// TODO: Maybe implement
// export const localStoragePersister = createSyncStoragePersister({ storage: window.localStorage })
