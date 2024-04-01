const express = require("express");
const app = express();
const axios = require("axios");
const mongoose = require("mongoose");
const multer = require("multer");
const { Schema } = mongoose;
const mammoth = require("mammoth");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
const bcrypt = require("bcrypt");
app.use("/uploads", express.static("./uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const dotenv = require("dotenv");
dotenv.config();
const { SERVER_HOST, DB_NAME, DB_HOST, DB_PORT, SERVER_PORT } = process.env;
const PORT = process.env.SERVER_PORT || 5000;

mongoose
  .connect(`mongodb+srv://mempagetech10:mempage@mempage.pjhutu1.mongodb.net/

  `)
  .then(() => {
    console.log("Connected to MongoDB");

    const userSchema = new mongoose.Schema({
      loginmail: {
        type: String,
        required: true,
        unique: true,
      },
      loginpassword: {
        type: String,
        required: true,
      },
    });
    const User = mongoose.model("Signin", userSchema);

    app.post("/signin", async (req, resp) => {
      try {
        const { loginmail, loginpassword, forgottenpassword } = req.body;

        if (forgottenpassword) {
          const forgottenpasswordResponse = await handleForgottenPassword({
            loginmail,
          });
          return resp.json(forgottenpasswordResponse);
        }

        const user = await User.findOne({ loginmail: loginmail });

        if (user) {
          const passwordMatch = await bcrypt.compare(
            loginpassword,
            user.loginpassword
          );

          if (passwordMatch) {
            const authToken = generateAuthToken(user, false);
            return resp.json({ message: "Log In successful", authToken });
          } else {
            return resp.json({ message: "Incorrect password" });
          }
        } else {
          const hashedPassword = await bcrypt.hash(loginpassword, 10);
          const newUser = new User({
            loginmail,
            loginpassword: hashedPassword,
          });
          await newUser.save();

          const authToken = generateAuthToken(newUser, false);
          return resp.json({
            message: "User created and logged in successfully",
            authToken,
          });
        }
      } catch (error) {
        resp
          .status(500)
          .json({ error: "Internal Server Error", message: error.message });
      }
    });

    const generateAuthToken = (user, isReset) => {
      const payload = {
        loginmail: user.loginmail,
        isReset: isReset,
      };
      const authToken = jwt.sign(payload, "surya", { expiresIn: "1h" });
      return authToken;
    };

    const handleForgottenPassword = async ({ loginmail }) => {
      try {
        const user = await User.findOne({ loginmail });

        if (!user) {
          return { message: "User not found" };
        }

        const resetToken = jwt.sign({ loginmail: user.loginmail }, "surya", {
          expiresIn: "1h",
          algorithm: "HS256",
        });

        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000;
        await user.save();

        const transporter = nodemailer.createTransport({
          host: "smtp.googlemail.com",
          port: 465,
          secure: true,
          auth: {
            user: "ongurisuvarna67@gmail.com",
            pass: "eavt pfzm ypcf rixd",
          },
        });

        const resetLink = `http://localhost:3000/resetpassword/${resetToken}`;
        const mailOptions = {
          from: "ongurisuvarna67@gmail.com",
          to: user.loginmail,
          subject: "Password Reset",
          text: `Click the following link to reset your password: ${resetLink}`,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent successfully");
        return { message: "Reset email sent successfully", token: resetToken };
      } catch (error) {
        console.log("Error sending email:", error.message);
        return { message: "Failed to send email", error: error.message };
      }
    };

    app.post("/resetpassword/:token", async (req, resp) => {
      try {
        const { token } = req.params;
        const { newpassword } = req.body;

        const decodedToken = jwt.verify(token, "surya");

        if (!decodedToken) {
          return resp.json({ message: "Invalid or expired token" });
        }

        const user = await User.findOne({ loginmail: decodedToken.loginmail });

        if (!user) {
          return resp.status(404).json({ message: "User not found" });
        }

        if (Date.now() > user.resetTokenExpiry) {
          return resp.status(400).json({ message: "Reset token has expired" });
        }

        const hashedPassword = await bcrypt.hash(newpassword, 10);
        user.loginpassword = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        const authToken = generateAuthToken(user, true);
        return resp.json({ message: "Password reset successfully", authToken });
      } catch (error) {
        resp
          .status(500)
          .json({ error: "Internal Server Error", message: error.message });
      }
    });

    const userSchema1 = new mongoose.Schema({
      categoryName: {
        type: String,
        required: true,
      },
    });
    const Category = mongoose.model("Category", userSchema1);

    

    const recruiterSchema = new mongoose.Schema({
      recruiterName: {
        type: String,
        required: true,
      },
    });
    const Recruiter = mongoose.model("Recruiter", recruiterSchema);

    const domainSchema = new mongoose.Schema({
      domainName: {
        type: String,
        required: true,
      },
    });
    const Domain = mongoose.model("Domain", domainSchema);

    app.post("/category", async (req, res) => {
      try {
        const newCategory = new Category(req.body);
        const savedCategory = await newCategory.save();

        res.status(200).json({
          message: "Category submitted successfully!",
          result: savedCategory,
        });
      } catch (error) {
        res.json({ message: "Error submitting category." });
      }
    });

    app.post("/recruiter", async (req, res) => {
      try {
        const newRecruiter = new Recruiter(req.body);
        const savedRecruiter = await newRecruiter.save();
        res.status(200).json({
          message: "Recruiter submitted successfully!",
          result: savedRecruiter,
        });
      } catch (error) {
        res.json({ message: "Error submitting Recruiter." });
      }
    });

    app.post("/domain", async (req, res) => {
      try {
        const newDomain = new Domain(req.body);
        const savedDomain = await newDomain.save();
        res.status(200).json({
          message: "Domain submitted successfully!",
          result: savedDomain,
        });
      } catch (error) {
        res.json({ message: "Error submitting Domain." });
      }
    });

    app.get("/categories", async (req, res) => {
      try {
        const categories = await Category.find();
        res.status(200).json({
          message: "Categories retrieved successfully!",
          results: categories,
        });
      } catch (error) {
        res.status(500).json({ message: "Error retrieving categories." });
      }
    });

    app.get("/recruiters", async (req, res) => {
      try {
        const recruiters = await Recruiter.find();
        res.status(200).json({
          message: "Recruiters retrieved successfully!",
          results: recruiters,
        });
      } catch (error) {
        res.status(500).json({ message: "Error retrieving Recruiters." });
      }
    });

    app.get("/domains", async (req, res) => {
      try {
        const domains = await Domain.find();
        res.status(200).json({
          message: "Domains retrieved successfully!",
          results: domains,
        });
      } catch (error) {
        res.status(500).json({ message: "Error retrieving Domains." });
      }
    });

    const userDetailsSchema = new mongoose.Schema({
      startDate: { type: Date, required: true },
      recruiter: { type: String, required: true },
      domain: { type: String, required: true },
      candidate: { type: String, required: true },
      mobile: { type: String, required: true },
      email: { type: String, required: true },
      panNo: { type: String },
      experience: { type: String, required: true },
      ctc: { type: String, required: true },
      ectc: { type: String, required: true },
      noticePeriod: { type: String, required: true },
      secondaryskills: { type: String, required: true },
      remarks: { type: String, required: true },
      resume: {
        data: { type: Buffer, required: true },
        fileName: { type: String, required: true },
      },
    });

    const UserDetails = mongoose.model("UserDetails", userDetailsSchema);

    const Form = mongoose.model("Form", { name: String, description: String });

    const userStorage = multer.memoryStorage();
    const userUpload = multer({ storage: userStorage });

    app.use(express.json());

    app.post("/form", userUpload.single("resume"), async (req, res) => {
      try {
        console.log("Received form data:", req.body);

        const recruiter = await fetchDropdownValue(
          "recruiters",
          req.body.recruiter
        );
        const domain = await fetchDropdownValue("domains", req.body.domain);
        const ctc = await fetchDropdownValue("ctcs", req.body.ctc);
        const noticePeriod = await fetchDropdownValue(
          "noticePeriods",
          req.body.noticePeriod
        );

        console.log("Dropdown values:", {
          recruiter,
          domain,
          ctc,
          noticePeriod,
        });

        const userDetails = new UserDetails({
          startDate: req.body.startDate,
          recruiter: recruiter,
          domain: domain,
          candidate: req.body.candidate,
          mobile: req.body.mobile,
          email: req.body.email,
          panNo: req.body.panNo,
          experience: req.body.experience,
          ctc: req.body.ctc,
          ectc: req.body.ectc,
          noticePeriod: req.body.noticePeriod,
          secondaryskills: req.body.secondaryskills,
          remarks: req.body.remarks,
          resume: {
            data: req.file.buffer,
            fileName: req.file.originalname,
          },
        });

        await userDetails.save();

        res.json({ msg: "Successfully submitted" });
      } catch (error) {
        console.error("Error processing form submission:", error);
        res
          .status(500)
          .json({ error: "Internal Server Error", details: error.message });
      }
    });

    const fetchDropdownValue = async (dropdownType, dropdownId) => {
      return dropdownId;
    };

    app.get("/all", async (req, res) => {
      try {
        const allUserDetails = await UserDetails.find();

        res.json(allUserDetails);
      } catch (error) {
        console.error("Error fetching all user details:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/getResume/:userId", async (req, res) => {
      try {
        const fileType = user.resume.fileName.split(".").pop().toLowerCase();

        let contentType = "application/octet-stream";
        if (fileType === "pdf") {
          contentType = "application/pdf";
        } else if (fileType === "doc" || fileType === "docx") {
          contentType = "application/msword";
        }

        res.set("Content-Type", contentType);
        res.send(user.resume.data);
      } catch (error) {
        console.error("Error fetching resume:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.delete("/deleteUser/:userId", async (req, res) => {
      try {
        const userId = req.params.userId;

        const user = await UserDetails.findById(userId);

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        await UserDetails.findByIdAndDelete(userId);

        res.json({ msg: "User deleted successfully" });
      } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.put("/form/:id", async (req, res, next) => {
      try {
        const formId = req.params.id;
        console.log("Received PUT request for form update:", formId, req.body);

        const updateData = req.body;

        const updatedForm = await UserDetails.findByIdAndUpdate(
          formId,
          updateData,
          { new: true }
        );

        if (!updatedForm) {
          console.error("Form not found or not updated.");
          return res
            .status(404)
            .json({ error: "Form not found or not updated." });
        }

        console.log("Updated Form:", updatedForm);

        res.json(updatedForm);
      } catch (error) {
        console.error("Error updating form:", error);
        next(error);
      }
    });

    const handleUpdate = async () => {
      try {
        setLoading(true);

        const response = await axios.put(
          `http://localhost:5000/form/${_id}`,
          formData
        );

        if (response.status === 200) {
          console.log("Form updated successfully:", response.data);
          onRequestClose();
        } else {
          console.error(
            "Unexpected status code:",
            response.status,
            response.data
          );
        }
      } catch (error) {
        console.error(
          "Error updating:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    app.get("/form/:userId", async (req, res) => {
      try {
        const userId = req.params.userId;

        const userDetails = await UserDetails.findById(userId);

        if (!userDetails) {
          return res.status(404).json({ error: "User not found" });
        }

        res.json(userDetails);
      } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    const employeeSchema = new mongoose.Schema({
      StartDate: { type: Date, required: true },
      EmpId: { type: String, required: true, unique: true },
      Supervisor: { type: String, required: true },
      Name: { type: String, required: true },
      Mobile: { type: String, required: true },
      Mail: { type: String, required: true },
      Password: { type: String, required: true },
      Aadhar: { type: String, required: true },
      PAN: { type: String, required: true },
      UAN: { type: String, required: true },
      Address: { type: String, required: true },
      CTC: { type: String, required: true },
      CategoryName: { type: String, required: true },
      uploadAadhar: {
        data: { type: Buffer, required: true },
        fileName: { type: String, required: true },
      },
      uploadPAN: {
        data: { type: Buffer, required: true },
        fileName: { type: String, required: true },
      },
      uploadCV: {
        data: { type: Buffer, required: true },
        fileName: { type: String, required: true },
      },
    });

    const Employee = mongoose.model("Employee", employeeSchema);

    const employeeStorage = multer.memoryStorage();
    const employeeUpload = multer({ storage: employeeStorage });

    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      next();
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.post(
      "/employee",
      employeeUpload.fields([
        { name: "uploadAadhar", maxCount: 1 },
        { name: "uploadPAN", maxCount: 1 },
        { name: "uploadCV", maxCount: 1 },
      ]),
      async (req, res) => {
        try {
          console.log("Received form data:", req.body);
          console.log("Received files:", req.files);

          if (!/^\d{10}$/.test(req.body.Mobile)) {
            return res.status(400).json({ error: "Invalid Mobile number" });
          }

          if (!/^\d{12}$/.test(req.body.Aadhar)) {
            return res.status(400).json({ error: "Invalid Aadhar number" });
          }

          if (!/@/.test(req.body.Mail)) {
            return res.status(400).json({ error: "Invalid Email address" });
          }

          if (
            !req.files ||
            !req.files["uploadAadhar"] ||
            !req.files["uploadPAN"] ||
            !req.files["uploadCV"]
          ) {
            return res.status(400).json({ error: "Files are required" });
          }

          const category = await Category.findById(req.body.Category_id);

          if (!category) {
            return res.status(400).json({ error: "Invalid Category_id" });
          }

          const aadharFile = req.files["uploadAadhar"][0];
          const panFile = req.files["uploadPAN"][0];
          const cvFile = req.files["uploadCV"][0];

          res.set("Content-Type", "application/json");

          if (aadharFile.mimetype) {
            res.set("Aadhar-Content-Type", aadharFile.mimetype);
          }

          if (panFile.mimetype) {
            res.set("PAN-Content-Type", panFile.mimetype);
          }

          if (cvFile.mimetype) {
            res.set("CV-Content-Type", cvFile.mimetype);
          }

          const employee = new Employee({
            StartDate: req.body.StartDate,
            EmpId: req.body.EmpId,
            Supervisor: req.body.Supervisor,
            Name: req.body.Name,
            Mobile: req.body.Mobile,
            Mail: req.body.Mail,
            Password: req.body.Password,
            Aadhar: req.body.Aadhar,
            PAN: req.body.PAN,
            UAN: req.body.UAN,
            Address: req.body.Address,
            CTC: req.body.CTC,
            CategoryName: category.categoryName,
            uploadAadhar: {
              data: aadharFile.buffer,
              fileName: aadharFile.originalname,
            },
            uploadPAN: {
              data: panFile.buffer,
              fileName: panFile.originalname,
            },
            uploadCV: {
              data: cvFile.buffer,
              fileName: cvFile.originalname,
            },
          });

          await employee.save();

          res.json({ message: "Employee saved successfully" });
        } catch (error) {
          console.error("Error adding/editing employee:", error);
          if (error.code === 11000) {
            return res.status(400).json({ error: "EmpId must be unique" });
          }
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    );

    app.get("/employees", async (req, res) => {
      try {
        const employees = await Employee.find();

        res.json(employees);
      } catch (error) {
        console.error("Error fetching employee details:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/file/:fileType/:employeeId", async (req, res) => {
      try {
        const employeeId = req.params.employeeId;
        const fileType = req.params.fileType;

        const employee = await Employee.findById(employeeId);

        if (!employee) {
          return res.status(404).json({ error: "Employee not found" });
        }

        let fileData;
        let contentType;
        let originalname;

        if (fileType === "aadhar" || fileType === "pan") {
          fileData =
            employee[fileType === "aadhar" ? "uploadAadhar" : "uploadPAN"];
          contentType = "image/jpeg";
          originalname = fileData.fileName;
        } else if (fileType === "cv") {
          fileData = employee.uploadCV;

          if (fileData) {
            const fileExtension = fileData.fileName
              .split(".")
              .pop()
              .toLowerCase();

            if (fileExtension === "pdf") {
              contentType = "application/pdf";
            } else if (fileExtension === "doc" || fileExtension === "docx") {
              contentType = "application/msword";
            } else {
              contentType = "application/octet-stream";
            }

            originalname = fileData.fileName;
            res.setHeader("Original-File-Name", originalname);
          } else {
            console.error("CV File not found");
            return res.status(404).json({ error: "CV File not found" });
          }
        }

        res.setHeader(
          "Content-Type",
          contentType || "application/octet-stream"
        );
        res.setHeader(
          "Content-Disposition",
          `inline; filename="${fileData.fileName}"`
        );
        res.setHeader("Original-File-Name", fileData.fileName);

        res.send(fileData.data);
      } catch (error) {
        console.error("Error fetching file data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    let searchResults = [];

    app.get("/employees/search", async (req, res) => {
      try {
        const query = req.query.query;

        if (!query) {
          return res.status(400).json({ error: "Query parameter is required" });
        }

        const regexQuery = new RegExp(query, "i");

        console.log("Search Query:", query);

        const searchResults = await Employee.find({
          $or: [
            { Name: { $regex: regexQuery } },
            { EmpId: { $regex: regexQuery } },
            { Mobile: { $regex: regexQuery } },
          ],
        });

        console.log("Search Results:", searchResults);

        res.json(searchResults);
      } catch (error) {
        console.error("Error searching employees:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.put("/employees/:id", async (req, res) => {
      const { id } = req.params;
      const {
        Mail,
        Address,
        Mobile,
        CTC,
        CategoryName,
        Aadhar,
        PAN,
        CV,
      } = req.body;

      try {
        const updatedEmployee = await Employee.findByIdAndUpdate(id, {
          Mail,
          Address,
          Mobile,
          CTC,
          CategoryName,
          Aadhar,
          PAN,
          CV,
        });
        res.json(updatedEmployee);
      } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.delete("/employees/:id", async (req, res) => {
      const { id } = req.params;

      try {
        const deletedEmployee = await Employee.findByIdAndDelete(id);

        if (!deletedEmployee) {
          return res.status(404).json({ error: "Employee not found" });
        }

        res.json({ message: "Employee deleted successfully" });
      } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    const leaveSchema = new mongoose.Schema({
      leaveType: {
        type: String,
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      supervisor: {
        type: String,
        required: true,
      },
      totalDays: {
        type: Number,
        required: true,
      },
    });

    const approvedSchema = new mongoose.Schema({
      leaveType: {
        type: String,
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      supervisor: {
        type: String,
        required: true,
      },
      totalDays: {
        type: Number,
        required: true,
      },
    });

    const rejectedSchema = new mongoose.Schema({
      leaveType: {
        type: String,
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
      },
      endDate: {
        type: Date,
        required: true,
      },
      supervisor: {
        type: String,
        required: true,
      },
      totalDays: {
        type: Number,
        required: true,
      },
    });

    const Leave = mongoose.model("Leave", leaveSchema);
    const ApprovedLeave = mongoose.model("ApprovedLeave", approvedSchema);
    const RejectedLeave = mongoose.model("RejectedLeave", rejectedSchema);

    app.post("/leave", async (req, res) => {
      try {
        const {
          leaveType,
          startDate,
          endDate,
          supervisor,
          totalDays,
        } = req.body;

        if (!supervisor) {
          return res.status(400).json({ error: "Supervisor is required." });
        }

        const newLeave = new Leave({
          leaveType,
          startDate,
          endDate,
          supervisor,
          totalDays,
        });

        const savedLeave = await newLeave.save();

        res.status(200).json({
          message: "Leave application submitted successfully!",
          result: savedLeave,
        });
      } catch (error) {
        console.error("Error submitting leave application:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/totalleaves", async (req, res) => {
      try {
        const allLeaves = await Leave.find();
        res.status(200).json({ leaves: allLeaves });
      } catch (error) {
        console.error("Error fetching leave applications:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.post("/updatestatus/:id", async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;

      try {
        const leave = await Leave.findById(id);

        if (!leave) {
          return res.status(404).json({ error: "Leave not found" });
        }

        leave.status = status;
        await leave.save();

        res.status(200).json({
          message: "Leave status updated successfully!",
          result: leave,
        });
      } catch (error) {
        console.error("Error updating leave status:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.put("/approveleave/:id", async (req, res) => {
      try {
        const leaveId = req.params.id;
        const action = req.body.action;

        const leave = await Leave.findById(leaveId);

        if (!leave) {
          return res.status(404).json({ error: "Leave not found" });
        }

        if (action === "approve") {
          const approvedLeave = new ApprovedLeave(leave.toObject());
          await approvedLeave.save();
        }

        if (action === "reject") {
          const rejectedLeave = new RejectedLeave(leave.toObject());
          await rejectedLeave.save();
        }

        await leave.remove();

        res
          .status(200)
          .json({ message: "Leave action processed successfully" });
      } catch (error) {
        console.error("Error processing leave action:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    app.get("/approvedleaves", async (req, res) => {
      try {
        const allApprovedLeaves = await ApprovedLeave.find();
        res.status(200).json({ approvedLeaves: allApprovedLeaves });
      } catch (error) {
        console.error("Error fetching approved leaves:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.put("/rejectleave/:id", async (req, res) => {
      try {
        const leaveId = req.params.id;

        const leave = await Leave.findById(leaveId);

        if (!leave) {
          return res.status(404).json({ error: "Leave not found" });
        }

        const rejectedLeave = new RejectedLeave({
          leaveType: leave.leaveType,
          startDate: leave.startDate,
          endDate: leave.endDate,
          supervisor: leave.supervisor,
          totalDays: leave.totalDays,
        });

        await rejectedLeave.save();

        await leave.remove();

        res.status(200).json({ message: "Leave rejected successfully" });
      } catch (error) {
        console.error("Error rejecting leave:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.get("/rejectedleaves", async (req, res) => {
      try {
        const rejectedLeaves = await RejectedLeave.find();
        res.status(200).json({ rejectedLeaves });
      } catch (error) {
        console.error("Error fetching rejected leaves:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });
