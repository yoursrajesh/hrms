import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddCategoryContent.css";

const AddCategoryContent = () => {
  const [activeForm, setActiveForm] = useState(null);

  const [categoryName, setCategoryName] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  const [recruiterName, setRecruiterName] = useState("");
  const [recruiterList, setRecruiterList] = useState([]);

  const [domainName, setDomainName] = useState("");
  const [domainList, setDomainList] = useState([]);

  const handleAddCategory = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/category", {
        categoryName: categoryName,
      });

      if (response.data.message === "Category submitted successfully!") {
        setCategoryList([
          ...categoryList,
          {
            _id: response.data.result._id,
            categoryName: response.data.result.categoryName,
          },
        ]);
        setCategoryName("");
      } else {
        alert("Failed to save category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      alert(`An error occurred while adding the category: ${error.message}`);
    }
  };

  const handleAddRecruiter = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/recruiter", {
        recruiterName: recruiterName,
      });

      if (response.data.message === "Recruiter submitted successfully!") {
        setRecruiterList([
          ...recruiterList,
          {
            _id: response.data.result._id,
            recruiterName: response.data.result.recruiterName,
          },
        ]);
        setRecruiterName("");
      } else {
        alert("Failed to save Recruiter");
      }
    } catch (error) {
      console.error("Error adding Recruiter:", error);
      alert(`An error occurred while adding the Recruiter: ${error.message}`);
    }
  };

  const handleAddDomain = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/domain", {
        domainName: domainName,
      });

      if (response.data.message === "Domain submitted successfully!") {
        setDomainList([
          ...domainList,
          {
            _id: response.data.result._id,
            domainName: response.data.result.domainName,
          },
        ]);
        setDomainName("");
      } else {
        alert("Failed to save Domain");
      }
    } catch (error) {
      console.error("Error adding Domain:", error);
      alert(`An error occurred while adding the Domain: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/categories");
        setCategoryList(response.data.results);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const response = await axios.get("http://localhost:5000/recruiters");
        setRecruiterList(response.data.results);
      } catch (error) {
        console.error("Error fetching recruiters:", error);
      }
    };

    fetchRecruiters();
  }, []);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await axios.get("http://localhost:5000/domains");
        setDomainList(response.data.results);
      } catch (error) {
        console.error("Error fetching domains:", error);
      }
    };

    fetchDomains();
  }, []);

  const handleButtonClick = (formName) => {
    setActiveForm(formName);
  };

  return (
    <div>
      <div className="button-container">
        <button
          onClick={() => handleButtonClick("category")}
          className="add-category-button"
        >
          Add Category
        </button>

        <button
          onClick={() => handleButtonClick("recruiter")}
          className="add-recruiter-button"
        >
          Add Recruiter
        </button>

        <button
          onClick={() => handleButtonClick("domain")}
          className="add-domain-button"
        >
          Add Primary Skills
        </button>
      </div>


      <div className="containerOf">
        <div className="row" >
          <div className="card-container col-6">

            {activeForm === "category" && (
              <div className="card mt-3">
                <div className="card-body">
                  <h3 className="card-title">Add Category</h3>
                  <form onSubmit={handleAddCategory}  className="form">
                    <div style={{ marginBottom: "10px" }}>
                      <label
                        htmlFor="categoryName"
                        style={{ display: "block", marginBottom: "5px" }}
                      >
                        Category Name:
                      </label>
                      <input
                        type="text"
                        id="categoryName"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: "100%" }}
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            )}

{activeForm === "domain" && (
              <div className="card mt-3">
                <div className="card-body">
                  <h3 className="card-title">Add Primary Skill</h3>
                  <form onSubmit={handleAddDomain}  className="frm">
                    <div style={{ marginBottom: "10px" }}>
                      <label
                        htmlFor="domainName"
                        style={{ display: "block", marginBottom: "5px" }}
                      >
                        Primary Skills Name:
                      </label>
                      <input
                        type="text"
                        id="domainName"
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: "100%" }}
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeForm === "recruiter" && (
              <div className="card mt-3">
                <div className="card-body">
                  <h3 className="card-title">Add Recruiter</h3>
                  <form onSubmit={handleAddRecruiter}  className="form">
                    <div style={{ marginBottom: "10px" }}>
                      <label
                        htmlFor="recruiterName"
                        style={{ display: "block", marginBottom: "5px" }}
                      >
                        Recruiter Name:
                      </label>
                      <input
                        type="text"
                        id="recruiterName"
                        value={recruiterName}
                        onChange={(e) => setRecruiterName(e.target.value)}
                        style={{ width: "100%", padding: "8px" }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: "100%" }}
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            )}

            
            </div>
          </div>
          

        <div className="table-container col-6">
          {activeForm === "category" && (
            <div className="mt-3 col-6">
              <h3>Category List</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryList.map((category) => (
                    <tr key={category._id}>
                      <td>{category.categoryName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeForm === "recruiter" && (
            <div className="mt-3">
              <h3>Recruiter List</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {recruiterList.map((recruiter) => (
                    <tr key={recruiter._id}>
                      <td>{recruiter.recruiterName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeForm === "domain" && (
            <div className="mt-3">
              <h3>Primary Skill List</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {domainList.map((domain) => (
                    <tr key={domain._id}>
                      <td>{domain.domainName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>

  );
};

export default AddCategoryContent;
