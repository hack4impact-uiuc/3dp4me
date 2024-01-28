import './PaginateBar.scss'

import PropTypes from 'prop-types'
import React from 'react'
import ReactPaginate from 'react-paginate' // see: https://www.npmjs.com/package/react-paginate

import LeftArrow from '../../assets/left-arrow.svg'
import RightArrow from '../../assets/right-arrow.svg'

export interface PaginateBarProps {
    pageCount: number
    onPageChange: (newPage: number) => void
    currentPage: number
}

/**
 * Shows a pagination component with arrows and page numbers
 */
const PaginateBar = ({ pageCount, onPageChange, currentPage }: PaginateBarProps) => {
    const nextLabel = <img className="arrow" alt="" src={RightArrow} />
    const previousLabel = <img className="arrow" alt="" src={LeftArrow} />

    return (
        <ReactPaginate
            forcePage={currentPage}
            breakLabel="..."
            breakClassName="break-me"
            pageCount={pageCount}
            marginPagesDisplayed={10}
            pageRangeDisplayed={5}
            onPageChange={(newPage) => {
                onPageChange(newPage.selected + 1)
            }}
            containerClassName="paginate-container"
            pageClassName="paginate-element"
            activeClassName="paginate-active"
            nextClassName="paginate-next"
            previousClassName="paginate-previous"
            pageLinkClassName="paginate-link"
            previousLinkClassName="paginate-previous-link"
            nextLinkClassName="paginate-next-link"
            breakLinkClassName="paginate-break"
            nextLabel={nextLabel}
            previousLabel={previousLabel}
        />
    )
}

PaginateBar.propTypes = {
    pageCount: PropTypes.number,
    onPageChange: PropTypes.func.isRequired,
    currentPage: PropTypes.number,
}

export default PaginateBar
