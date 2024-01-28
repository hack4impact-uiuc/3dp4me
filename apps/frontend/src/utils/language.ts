import { Language } from '@3dp4me/types'

/**
 * Returns true if the given string is a valid language identifier
 */
export const isLanguageValid = (language: string): language is Language =>
    Object.values(Language).includes(language as Language)
