import { useContext } from 'react';

import translations from '../translations.json';
import { Context } from '../store/Store';

export const useTranslations = () => {
    const state = useContext(Context)[0];
    return [translations[state.language], state.language];
};
