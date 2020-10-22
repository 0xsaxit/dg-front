import React, { useContext, useState } from "react";
import { Pagination } from "react-bootstrap";
import ReactPageScroller from "react-page-scroller";
import Chateau from "./Chateau";
import Tominoya from "./Tominoya";
import Serenity from "./Serenity";
import { GlobalContext } from '../../store';


const Dashboard = () => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [currentPage, setCurrentPage] = useState(null);

  // helper functions
  function handlePageChange(number) {
    setCurrentPage(number);
  };

  function getPagesNumbers() {
    const pageNumbers = [];

    for (let i = 1; i <= 3; i++) {
      pageNumbers.push(
        <Pagination.Item key={i} eventKey={i - 1} onSelect={handlePageChange}>
          {i}
        </Pagination.Item>,
      );
    }

    return [...pageNumbers];
  };


  return (
    <span>
      {state.userStatus ? (
        <React.Fragment>
          <ReactPageScroller
            pageOnChange={handlePageChange}
            customPageNumber={currentPage}
          >
            <Chateau />
            <Tominoya />
            <Serenity />
          </ReactPageScroller>

          <span className="pagination-container">
            <div className="pagination-additional-class">
              <div className={ currentPage === 0 ? "page-indicator-dot active" : "page-indicator-dot" } />
              <div className={ currentPage === 1 ? "page-indicator-dot active" : "page-indicator-dot" } />
              <div className={ currentPage === 2 ? "page-indicator-dot active" : "page-indicator-dot" } />
            </div>
          </span>

        </React.Fragment>
      ) : (
        <React.Fragment>
          <Chateau />
        </React.Fragment>
      )}
    </span>
  );
}

export default Dashboard
