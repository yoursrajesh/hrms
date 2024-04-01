import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Select, MenuItem, Button, TextareaAutosize } from "@material-ui/core";
import './AddProfileForm.css';

const AddProfileForm = ({ initialFormData, onSubmit, showResumeField = true }) => {
  const [formData, setFormData] = useState({
    startDate: "",
    recruiter: "defaultRecruiterValue",
    domain: "defaultDomainValue",
    candidate: "",
    mobile: "",
    email: "",
    panNo: "",
    experience: "0",
    ctc: "",
    ectc: "",
    noticePeriod: "",
    remarks: "",
    resume: null, // New field for the resume file
  });

  useEffect(() => {
    setFormData(
      initialFormData || {
        startDate: "",
        recruiter: "",
        domain: "",
        secondaryskills:"",
        candidate: "",
        mobile: "",
        email: "",
        panNo: "",
        experience: "",
        ctc: "",
        ectc: "",
        noticePeriod: "",
        remarks: "",
        resume: null,
      }
    );
  }, [initialFormData]);

  const [file, setFile] = useState(null);


 

  const [dynamicValues, setDynamicValues] = useState({
    recruiters: [],
    domains: [],
    ctcs: [],
    noticePeriods: [],
  });

  useEffect(() => {
    const fetchDynamicValues = async () => {
      try {
        const recruitersResponse = await axios.get("http://localhost:5000/recruiters");
        setDynamicValues((prev) => ({ ...prev, recruiters: recruitersResponse.data.results }));

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

    fetchDynamicValues();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };


  const fetchDropdownValue = async (dropdownType, dropdownId) => {
    try {
      // Make a request to your backend API to fetch the dropdown value based on ID
      const response = await axios.get(`http://localhost:5000/${dropdownType}/${dropdownId}`);

      if (response.data) {
        // Assuming the response has a 'name' property, adjust accordingly based on your backend structure
        return response.data.name || null;
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error fetching ${dropdownType} value:`, error);
      return null;
    }
  };
  
  const renderDropdownOptions = (name, hardcodedOptions = []) => {
    if (!dynamicValues[name] || dynamicValues[name].length === 0) {
      return <MenuItem value="">Select</MenuItem>;
    }
  
    const dynamicOptions = dynamicValues[name];
    const defaultOption = <MenuItem key="default" value="">Select</MenuItem>;
  
    const dynamicOptionElements = dynamicOptions.map((option) => (
      <MenuItem key={option._id || option.value} value={getOptionLabel(name, option)}>
        {getOptionLabel(name, option)}
      </MenuItem>
    ));
  
    const hardcodedOptionElements = hardcodedOptions.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {/* Use the label property instead of value for names */}
        {option.label}
      </MenuItem>
    ));
  
    return name === "experience"
      ? [...hardcodedOptionElements, ...dynamicOptionElements, defaultOption]
      : [defaultOption, ...dynamicOptionElements, ...hardcodedOptionElements];
  };
  

 
  const getOptionLabel = (fieldName, option) => {
    switch (fieldName) {
      case "recruiters":
        return option.recruiterName; // Use the name property
      case "domains":
        return option.domainName; // Use the name property
      case "ctcs":
        return option.ctcName; // Use the name property
      case "noticePeriods":
        return option.noticePeriodName; // Use the name property
      default:
        return option.label;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    try {
      console.log("File:", file);
  
      // Validate the form
      if (!validateForm()) {
        alert("Please fill in all fields");
        return;
      }
  
      // Validate mobile number
      if (formData.mobile.length !== 10 || isNaN(formData.mobile)) {
        alert("Mobile number must be 10 digits long and contain only numbers.");
        return;
      }
  
      // Create a new FormData object
      const formDataWithResume = new FormData();
  
      // Append resume file to the FormData object
      formDataWithResume.append("resume", file, file.name);
  
      // Append other form data to the FormData object
      Object.entries(formData).forEach(([key, value]) => {
        formDataWithResume.append(key, value);
      });
  
      // Use the FormData object for form submission
      const formDataResponse = await axios.post("http://localhost:5000/form", formDataWithResume);
  
      // Check if the response has a data property
      if (formDataResponse.data) {
        console.log("FormData API Response:", formDataResponse.data);
  
        // Additional logic based on your requirements
  
        // Hide the initial values of secondary skills and resume
        setFormData((prevFormData) => ({
          ...prevFormData,
          secondaryskills: "",
          resume: null,
        }));
  
        // Reset the file state
        setFile(null);
  
        // Display "submitted successfully" message
        alert("Details uploaded successfully!");
  
        // Delay the page refresh after 2 seconds
        setTimeout(() => {
          window.location.reload();
        },);
      } else {
        console.error("Unexpected response format:", formDataResponse);
        alert("Unexpected response format. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form or uploading file:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };
  

  

  const validateForm = () => {
    const requiredFields = ["startDate", "recruiter", "domain", "candidate", "mobile", "email", "experience", "ctc", "ectc", "noticePeriod", "remarks"];

    for (const field of requiredFields) {
      if (!formData[field]) {
        return false;
      }
    }

    return true;
  };

  return (
    <div className="container-profile" style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', width: '95%', height: '400px', margin: '30px', overflowX: 'hidden',padding:'20px',boarderRadius:'10px',overflowY: 'hidden',padding:'20px'}} >
      <div className="profiles-card" >
      <form encType="multipart/form-data">
        <div className="row">
          <div className="col-3">
            <TextField
              type="date"
              fullWidth
              variant="outlined"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              style={{ width: '100%', height: '55px' }}
            />
          </div>

          <div className="col-3 one">
            <div className={`custom-label ${Boolean(formData.recruiter) ? 'shrink' : ''}`}>
              Recruiter
            </div>
            <Select
              label="Recruiter"
              variant="outlined"
              fullWidth
              id="recruiter"
              name="recruiter"
              value={formData.recruiter}
              onChange={handleChange}
              style={{ width: '100%', height: '55px' }}
              className="custom-select"
            >
              {renderDropdownOptions("recruiters")}
            </Select>
          </div>

          <div className="col-3 one">
            <div className={`custom-label ${Boolean(formData.domain) ? 'shrink' : ''}`}>
             Primary Skills
            </div>
            <Select
              label="Primary Skills"
              variant="outlined"
              fullWidth
              id="domain"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              style={{ width: '100%', height: '55px' }}
              className="custom-select"
            >
              {renderDropdownOptions("domains")}
            </Select>
          </div>
          <div className="col-3">
            <div className='secondaryskills-field'></div>
            <TextField
              label="Secondary skills"
              type="text"
              fullWidth
              variant="outlined"
              name="secondaryskills"
              value={formData.secondaryskills}
              onChange={handleChange}
              style={{ width: '100%', height: '55px',marginLeft:'5px' }}
              className="custom-select"
            />
          </div>
          </div>
          <div className="row">
          <div className="col-3">
            <div className='name-field'></div>
            <TextField
              label="Name"
              type="text"
              fullWidth
              variant="outlined"
              name="candidate"
              value={formData.candidate}
              onChange={handleChange}
              style={{ width: '100%', height: '55px' }}
              className="custom-select"
            />
          </div>
        

        
          <div className="col-3">
            <div className={`custom-label ${Boolean(formData.mobile) ? 'shrink' : ''}`}></div>
            <TextField
              label="Mobile"
              fullWidth
              variant="outlined"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              style={{ width: '100%', height: '55px' }}
              className="custom-select"
            />
          </div>

          <div className="col-3">
            <div className={`custom-label ${Boolean(formData.email) ? 'shrink' : ''}`}></div>
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', height: '55px' }}
              className="custom-select"
            />
          </div>

          <div className="col-3">
            <div className={`custom-label ${Boolean(formData.panNo) ? 'shrink' : ''}`}></div>
            <TextField
              label="PAN"
              fullWidth
              variant="outlined"
              name="panNo"
              value={formData.panNo}
              onChange={handleChange}
              style={{ width: '100%', height: '55px' }}
              className="custom-select"
            />
          </div>
          </div>
          
<div className="row">
<div className="col-3">
            <div className='experience-field'></div>
            <TextField
              label="Experience"
              type="text"
              fullWidth
              variant="outlined"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              style={{ width: '100%', height: '55px' }}
              className="custom-select"
            />
          </div>







  <div className="col-3">
            <div className='ctc-field'></div>
            <TextField
              label="CTC"
              type="text"
              fullWidth
              variant="outlined"
              name="ctc"
              value={formData.ctc}
              onChange={handleChange}
              style={{ width: '100%', height: '55px' }}
              className="custom-select"
            />
          </div>

          
<div className="col-3">
            <div className='ectc-field'></div>
            <TextField
              label="ECTC"
              type="text"
              fullWidth
              variant="outlined"
              name="ectc"
              value={formData.ectc}
              onChange={handleChange}
              style={{ width: '100%', height: '55px' }}
              className="custom-select"
            />
          </div>


          
<div className="col-3">
            <div className='np-field'></div>
            <TextField
              label="NP"
              type="text"
              fullWidth
              variant="outlined"
              name="noticePeriod"
              value={formData.noticePeriod}
              onChange={handleChange}
              style={{ width: '100%', height: '55px' }}
              className="custom-select"
            />
          </div>

</div>

<div className="row">
          <div className="col-3">
            <TextareaAutosize
              placeholder="Remarks"
              className="remarks-field" style={{width:'99%'}}
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>
          <div className="col-3 file-input">
    {showResumeField && (
        <input 
            type="file" 
            accept=".pdf, .doc, .docx" 
            id="resume" 
            name="resume" 
            onChange={handleFileChange} 
            style={{ width: '100%', height: '55px',textAlign:'center' }} 
        />
    )}
</div>
          </div>
          <div className="row">
    <div className="col-12 d-flex justify-content-center">
        <Button variant="contained" color="primary" onClick={handleSubmit} className="submit-button">
            Submit
        </Button>
    </div>
</div>

      </form>
      </div>
    </div>
   
  );
};

export default AddProfileForm;