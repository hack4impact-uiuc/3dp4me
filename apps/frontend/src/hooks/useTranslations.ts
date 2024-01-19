import { useContext } from 'react';

import translations from '../translations.json';
import { Context } from '../store/Store';
import { Language } from '@3dp4me/types';

/**
 * Custom hook that returns translations and the current selected language
 */
export const useTranslations = (): [(typeof translations)[Language], Language] => {
    const state = useContext(Context)[0];
    return [translations[state.language], state.language];
};
