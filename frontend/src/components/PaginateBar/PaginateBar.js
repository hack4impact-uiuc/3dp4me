import React from 'react';

import './PaginateBar.scss';
import ReactPaginate from 'react-paginate'; // see: https://www.npmjs.com/package/react-paginate
import PropTypes from 'prop-types';

import RightArrow from '../../assets/right-arrow.svg';
import LeftArrow from '../../assets/left-arrow.svg';

/**
 * Shows a table of all patients within the system
 */
const PaginateBar = (props) => {
    const { pageCount, onPageChange } = props;

    const nextLabel = <img className="arrow" alt="" src={RightArrow} />;
    const previousLabel = <img className="arrow" alt="" src={LeftArrow} />;

    return (
        <ReactPaginate
            initialPage={0}
            breakLabel="..."
            breakClassName="break-me"
            pageCount={pageCount}
            marginPagesDisplayed={10}
            pageRangeDisplayed={5}
            onPageChange={(newPage) => {
                onPageChange(newPage.selected + 1);
            }}
            containerClassName="paginate-container"
            pageClassName="paginate-element"
            activeClassName="paginate-active"
            nextClassName="paginate-next"
            previousClassName="paginate-previous"
            pageLinkClassName="paginate-link"
            previousLinkClassName="paginate-previous-link"
            nextLinkClassName="paginate-next-link"
            nextLabel={nextLabel}
            previousLabel={previousLabel}
        />
    );
};

PaginateBar.propTypes = {
    pageCount: PropTypes.number,
    onPageChange: PropTypes.func.isRequired,
};

export default PaginateBar;
