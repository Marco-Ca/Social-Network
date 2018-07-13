import React from "react";
import { connect } from "react-redux";
import { getUsersForSearch } from "./action.js";
import { Link } from "react-router-dom";

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.hideResults = this.hideResults.bind(this);
    }
    hideResults() {
        let searches = document.querySelector(".searchResults");
        searches.style.display = "none";
    }
    render() {
        return (
            <div className="searchBar">
                <input id="inp" type="text" name="search"
                    placeholder="Search"
                    ref={elem => {
                        this.text = elem;
                    }}
                    onChange={e =>
                        this.props.dispatch(getUsersForSearch(e.target.value))
                    }
                />
                <div className="searchResults">
                    {this.props.searchResults &&
                      this.props.searchResults.map(result => {
                          return (
                              <div className="userResult" key={result.id}>
                                  <Link onClick={() => {
                                      this.text.value = "";
                                      this.hideResults();
                                  }}
                                  to={`/users/${result.id}`}>
                                      <div className="searchContainer">
                                          <div><img className="friendsImage" src={result.image || "/assets/user.png"} /></div>
                                          <div>{result.first} {result.last}</div>
                                      </div>
                                  </Link>
                              </div>
                          );
                      })}
                    {this.props.noResults}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        searchResults: state.searchResults || [],
        noResults: state.noResults
    };
};
export default connect(mapStateToProps)(Search);
