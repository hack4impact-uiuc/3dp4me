import React, { useEffect, useState } from 'react';

import { useTranslations } from '../../hooks/useTranslations';

import './PaginateBar.scss';
import ReactPaginate from 'react-paginate'; //see: https://www.npmjs.com/package/react-paginate
import RightArrow from '../../assets/right-arrow.svg'
import LeftArrow from '../../assets/left-arrow.svg'


/**
 * Shows a table of all patients within the system
 */
const PaginateBar = (props) => {
    const [translations, selectedLang] = useTranslations();

    const { pageCount, onPageChange } = props;

    // let nextLabel = <img src = >{translations.components.button.next}</img>
    let nextLabel = <img className = "arrow" src = {RightArrow}/>
    let previousLabel = <img className = "arrow" src = {LeftArrow}/>

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
