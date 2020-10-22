import React from "react";
import { Pagination } from "react-bootstrap";
import ReactPageScroller from "react-page-scroller";
import Chateau from "./Chateau";
import Tominoya from "./Tominoya";
import Serenity from "./Serenity";


export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentPage: null };
  }

  handlePageChange = number => {
    this.setState({ currentPage: number }); // set currentPage number, to reset it from the previous selected.
  };

  getPagesNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= 3; i++) {
      pageNumbers.push(
        <Pagination.Item key={i} eventKey={i - 1} onSelect={this.handlePageChange}>
          {i}
        </Pagination.Item>,
      );
    }

    return [...pageNumbers];
  };

  render() {
    const pagesNumbers = this.getPagesNumbers();

    return (
      <React.Fragment>
        <ReactPageScroller
          pageOnChange={this.handlePageChange}
          customPageNumber={this.state.currentPage}
        >
          <Chateau />
          <Tominoya />
          <Serenity />
        </ReactPageScroller>

        <span className="pagination-container">
          <div className="pagination-additional-class">
            <div className={ this.state.currentPage === 0 ? "page-indicator-dot active" : "page-indicator-dot" } />
            <div className={ this.state.currentPage === 1 ? "page-indicator-dot active" : "page-indicator-dot" } />
            <div className={ this.state.currentPage === 2 ? "page-indicator-dot active" : "page-indicator-dot" } />
          </div>
        </span>

      </React.Fragment>
    );
  }
}
