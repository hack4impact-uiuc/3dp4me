import translations from '../translations.json';
import { useContext } from 'react';
import { Context } from '../store/Store';

export const useTranslations = () => {
    const state = useContext(Context)[0];
    return [translations[state.language], state.language];
};
