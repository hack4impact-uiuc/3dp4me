import React, { useEffect, useState } from 'react';

import { useTranslations } from '../../hooks/useTranslations';

import './PaginateBar.scss';
import ReactPaginate from 'react-paginate'; //see: https://www.npmjs.com/package/react-paginate



/**
 * Shows a table of all patients within the system
 */
const PaginateBar = (props) => {
    const [translations, selectedLang] = useTranslations();

    const { pageCount, onPageChange } = props;

    let nextLabel = <p>{translations.components.button.next}</p>
    let previousLabel = <p>{translations.components.button.previous}</p>

    return (
        <ReactPaginate previousLabel={'previous'}
                initialPage = {0}
                nextLabel={'next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={10}
                pageRangeDisplayed={5}
                onPageChange={(newPage) => {onPageChange(newPage.selected+1)}}
                containerClassName={'paginate-container'}
                pageClassName={'paginate-page'}
                activeClassName={'paginate-active'}
                nextClassName={'paginate-next'}
                previousClassName={'paginate-previous'} 
                pageLinkClassName = {'paginate-link'} 
                previousLinkClassName = {'paginate-link'} 
                nextLinkClassName = {'paginate-link'} 
                nextLabel = {nextLabel}
                previousLabel = {previousLabel}
                />

    );
};

export default PaginateBar;
