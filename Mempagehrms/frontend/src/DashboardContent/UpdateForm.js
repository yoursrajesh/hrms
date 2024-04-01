
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateForm.css';
import TextField from '@material-ui/core/TextField'; // Import TextField from Material-UI

const UpdateForm = ({ _id, isOpen, onRequestClose }) => {
  const [formData, setFormData] = useState({
    mobile: '',
    domain: '',
    secondaryskills:'',
    ectc: '',
    noticePeriod: '',
    experience: '',
    remarks: '',
  });

  const [dynamicValues, setDynamicValues] = useState({
    domains: [],
    ctcs: [],
    noticePeriods: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/form/${_id}`);
        setFormData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDynamicValues = async () => {
      try {
        const domainsResponse = await axios.get("http://localhost:5000/domains");
        setDynamicValues((prev) => ({ ...prev, domains: domainsResponse.data.results }));

        const ctcsResponse = await axios.get("http://localhost:5000/ctcs");
        setDynamicValues((prev) => ({ ...prev, ctcs: ctcsResponse.data.results }));

        const noticePeriodsResponse = await axios.get("http://localhost:5000/noticeperiods");
        setDynamicValues((prev) => ({ ...prev, noticePeriods: noticePeriodsResponse.data.results }));
      } catch (error) {
        console.error('Error fetching dynamic values:', error);
      }
    };

    if (_id && isOpen) {
      fetchData();
      fetchDynamicValues();
    }
  }, [_id, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleUpdate = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.put(`http://localhost:5000/form/${_id}`, formData);
  
  //     if (response.status === 200) {
  //       console.log('Form updated successfully:', response.data);
  //       onRequestClose();
  //     } else {
  //       console.error('Unexpected status code:', response.status, response.data);
  //     }
  //   } catch (error) {
  //     console.error('Error updating:', error.response ? error.response.data : error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/form/${_id}`, formData);
  
      if (response.status === 200) {
        console.log('Form updated successfully:', response.data);
        onRequestClose();
      } else {
        console.error('Unexpected status code:', response.status, response.data);
      }
    } catch (error) {
      console.error('Error updating:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const renderDropdownOptions = (name, hardcodedOptions = []) => {
    if (!dynamicValues[name] || dynamicValues[name].length === 0) {
      return <option value="">Select</option>;
    }
  
    const dynamicOptions = dynamicValues[name];
    const defaultOption = <option key="default" value="">Select</option>;
  
    const dynamicOptionElements = dynamicOptions.map((option) => (
      <option key={option._id || option.value} value={option.value}>
        {name === "domains" ? option.domainName : name === "ctcs" ? option.ctcName : name === "noticePeriods" ? option.noticePeriodName : option.label}
      </option>
    ));
  
    const hardcodedOptionElements = hardcodedOptions.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ));
  
    return [defaultOption, ...dynamicOptionElements, ...hardcodedOptionElements];
  };

  return (
    <div id="updateForm">
      <h2>Update Form</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="update-form-container">
          {/* <div className="updatecard"> */}
            {/* <div className="card-body"> */}
              <div className="form-row">
                <div className="form-group col-md-4">
                  <TextField
                    label="Mobile"
                    variant="outlined"
                    fullWidth
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    style={{ margin: '10px ', width: '95%', height: '40px'}} // Adjust margin, width, and height as needed
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="primarySkills"></label>
                  <select
                    className="form-control"
                    id="domain"
                    name="domain"
                    value={formData.primarySkills}
                    onChange={handleChange}
                    style={{ margin: '5px ', width: '100%', height: '55px' }} // Adjust margin, width, and height as needed
                  >
                    {renderDropdownOptions("domains")}
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <TextField
                    label="Secondary Skills"
                    variant="outlined"
                    fullWidth
                    name="secondaryskills"
                    value={formData.secondaryskills}
                    onChange={handleChange}
                    style={{ margin: '10px ', width: '95%', height: '40px' }} // Adjust margin, width, and height as needed
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-4">
                  <TextField
                    label="ECTC"
                    variant="outlined"
                    fullWidth
                    name="ectc"
                    value={formData.ectc}
                    onChange={handleChange}
                    style={{ margin: '10px ', width: '95%', height: '40px' }} // Adjust margin, width, and height as needed
                  />
                </div>
                <div className="form-group col-md-4">
                  <TextField
                    label="Notice Period"
                    variant="outlined"
                    fullWidth
                    name="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={handleChange}
                    style={{ margin: '10px ', width: '95%', height: '40px' }} // Adjust margin, width, and height as needed
                  />
                </div>
                <div className="form-group col-md-4">
                  <TextField
                    label="Experience"
                    variant="outlined"
                    fullWidth
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    style={{ margin: '10px ', width: '95%', height: '40px' }} // Adjust margin, width, and height as needed
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-4 remarks">
                <TextField
  label="Remarks"
  variant="outlined"
  fullWidth
  multiline
  rows={1}
  name="remarks"
  value={formData.remarks}
  onChange={handleChange}
  style={{ margin: '10px 0', width: '40%', minHeight: '40px', height: 'auto !important' }}
/>


                </div>
              </div>

              {/* <button onClick={handleUpdate} className="btn btn-primary">
                Update
              </button> */}
              <button type="button" onClick={(e) => handleUpdate(e)} className="btn btn-primary">
  Update
</button>


            </div>
          // </div>
        // </div>
      )}
    </div>
  );
};

export default UpdateForm;










