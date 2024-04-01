import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { TextField } from "@material-ui/core";
import "./SearchProfileContent.css"; // Import the CSS file for styling

const SearchProfileContent = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState({
    mobile: "",
    candidate: "",
    domain: "",
    secondaryskills: "",
    email: "",
    experience: "",
    searchWeekly: false,
    searchMonthly: false,
    startDate: "",
    endDate: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "radio" && checked) {
      setSearchQuery((prevQuery) => ({
        ...prevQuery,
        searchWeekly: name === "searchWeekly" ? checked : false,
        searchMonthly: name === "searchMonthly" ? checked : false,
      }));
    } else {
      setSearchQuery((prevQuery) => ({
        ...prevQuery,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSearch = () => {
    // Check if at least one search option is selected or filled
    const isSearchOptionsEmpty =
      Object.values(searchQuery).every((value) => value === "") &&
      !searchQuery.searchWeekly &&
      !searchQuery.searchMonthly;

    if (isSearchOptionsEmpty) {
      alert("Please select at least one search option");
      return;
    }

    // Proceed with the search
    onSearch(searchQuery);
  };

  return (
    <div className="searchprofile-container">
      <div className="row searchprofile-options">
        <TextField
          label="Mobile"
          type="text"
          name="mobile"
          value={searchQuery.mobile}
          onChange={handleInputChange}
          variant="outlined"
          className="col-1 searchprofile-input"
        />

        <TextField
          label="Name"
          type="text"
          name="candidate"
          value={searchQuery.candidate}
          onChange={handleInputChange}
          variant="outlined"
          className="col-1 searchprofile-input"
        />

        <TextField
          label="Primaryskills"
          type="text"
          name="domain"
          value={searchQuery.domain}
          onChange={handleInputChange}
          variant="outlined"
          className="col-1 searchprofile-input"
        />
        <TextField
          label="secondaryskills"
          type="text"
          name="secondaryskills"
          value={searchQuery.secondaryskills}
          onChange={handleInputChange}
          variant="outlined"
          className="col-1 searchprofile-input"
        />
        <TextField
          label="Email"
          type="text"
          name="email"
          value={searchQuery.email}
          onChange={handleInputChange}
          variant="outlined"
          className="col-1 searchprofile-input"
        />

        <TextField
          label="Experience"
          type="text"
          name="experience"
          value={searchQuery.experience}
          onChange={handleInputChange}
          variant="outlined"
          className="col-1 searchprofile-input"
        />
        <div className="anothercontainer">
          <div className="row">
            <div className="col-1 searchprofile-radio-container">
              <div className="searchprofile-radio-wrapper">
                <input
                  type="radio"
                  name="searchWeekly"
                  checked={searchQuery.searchWeekly}
                  onChange={handleInputChange}
                  className="searchprofile-radio"
                />
                <span className="searchprofile-radio-label">Weekly</span>
              </div>
            </div>

            <div className="col-1 searchprofile-radio-container">
              <div className="searchprofile-radio-wrapper">
                <input
                  type="radio"
                  name="searchMonthly"
                  checked={searchQuery.searchMonthly}
                  onChange={handleInputChange}
                  className="searchprofile-radio"
                />
                <span className="searchprofile-radio-label">Monthly</span>
              </div>
            </div>

            <TextField
              type="date"
              name="startDate"
              value={searchQuery.startDate}
              onChange={handleInputChange}
              variant="outlined"
              className="col-1 searchprofile-input"
            />

            <TextField
              type="date"
              name="endDate"
              value={searchQuery.endDate}
              onChange={handleInputChange}
              variant="outlined"
              className="col-1 searchprofile-input"
            />

            <div className="col-1">
              <button className="searchprofile-button" onClick={handleSearch}>
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProfileContent;
