// const express = require('express');
//   const mongoose = require('mongoose');
//   const multer = require('multer');
//   const cors = require('cors');
//   const bcrypt = require('bcrypt');
//   const jwt = require('jsonwebtoken');
//   const nodemailer = require('nodemailer');
//   const app = express();
//   const PORT = 5000;
  
//   app.use(express.json());
//   app.use(cors());
//   app.use(express.urlencoded({ extended: true }));

//   app.use('/uploads', express.static('uploads'));
  
//   const mongodbConnection = 'mongodb://127.0.0.1:27017/MemePage';
  
//   const fileSchema = new mongoose.Schema({
//     filename: String,
//     uploadDate: { type: Date, default: Date.now },
//   });
  
//   const File = mongoose.model('File', fileSchema);
  
//   mongoose.connect(mongodbConnection, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//       console.log('Connected to MongoDB');
  
//       const gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//         bucketName: 'uploads',
//       });
  
//       const storage = multer.memoryStorage();
//       const upload = multer({ storage });
  
//       app.post('/upload', upload.single('video'), async (req, res) => {
//         try {
//           if (!req.file) {
//             return res.status(400).send('No file uploaded');
//           }
  
//           const video = req.file;
  
//           const uploadStream = gridfsBucket.openUploadStream(video.originalname);
//           uploadStream.end(video.buffer);
  
//           uploadStream.on('error', () => {
//             return res.status(500).send('Error at uploading file');
//           });
  
//           uploadStream.on('finish', async () => {
//             const fileRecord = new File({
//               filename: video.originalname,
//             });
//             await fileRecord.save();
  
//             return res.status(201).send('File uploaded');
//           });
//         } catch (error) {
//           console.error('Error during file upload:', error);
//           return res.status(500).send('Internal Server Error');
//         }
//       });
//       app.get('/file/:filename', async (req, res) => {
//         try {
//           const file = await gridfsBucket.openDownloadStreamByName(req.params.filename);
//           file.pipe(res);
//         } catch (error) {
//           console.error('Error retrieving file:', error);
//           return res.send('File not found');
//         }
//       });
//       app.get('/files', async (req, res) => {
//         try {
//           const files = await File.find();
//           res.json(files);
//         } catch (error) {
//           console.error('Error fetching files:', error);
//           res.status(500).send('Internal Server Error');
//         }
//       });
  
  
//       const userSchema = new mongoose.Schema({
//         loginmail: {
//           type: String,
//           required: true,
//           unique: true,
//         },
//         loginpassword: {
//           type: String,
//           required: true,
//         },
//         resetToken: String,
//         resetTokenExpiry: Date,
//       });
//       const User = mongoose.model("Signin", userSchema);
  
//       app.post('/signin', async (req, resp) => {
//         try {
//           const { loginmail, loginpassword, forgottenpassword } = req.body;
  
//           if (forgottenpassword) {
//             const forgottenpasswordResponse = await handleForgottenPassword(req.body);
//             return resp.json(forgottenpasswordResponse);
//           }
  
//           const user = await User.findOne({ 'loginmail': loginmail });
  
//           if (user) {
//             const passwordMatch = await bcrypt.compare(loginpassword, user.loginpassword);
  
//             if (passwordMatch) {
//               const token = generateToken(user);
//               return resp.json({ message: 'Log In successful', token });
//             } else {
//               return resp.status(400).json({ error: 'Bad Request', message: 'Incorrect password' });
//             }
//           } else {
//             const hashedPassword = await bcrypt.hash(loginpassword, 10);
//             const newUser = new User({ loginmail, loginpassword: hashedPassword });
//             await newUser.save();
  
//             const token = generateToken(newUser);
//             return resp.json({ message: 'User created and logged in successfully', token });
//           }
//         } catch (error) {
//           resp.status(500).json({ error: 'Internal Server Error', message: error.message });
//         }
//       });
  
//       const generateToken = (user) => {
//         const payload = {
//           userId: user._id,
//           loginmail: user.loginmail,
//         };
  
//         const token = jwt.sign(payload, "suvarna");
//         return token;
//       };
  
//       const handleForgottenPassword = async ({ email }) => {
//         try {
//           const secretKey = 'your-secret-key';
//           const user = await User.findOne({ loginmail: email });
  
//           if (!user) {
//             return { message: 'User not found' };
//           }
  
//           const expiresIn = '1h';
//           const resetToken = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h', algorithm: 'HS256' });
  
//           user.resetToken = resetToken;
//           user.resetTokenExpiry = Date.now() + 3600000;
//           await user.save();
  
//           const transporter = nodemailer.createTransport({
//             host: 'smtp.googlemail.com',
//             port: 465,
//             secure: true,
//             auth: {
//               user: 'yedlurirajesh1@gmail.com',
//               pass: '137@Rajesh',
//             },
//           });
  
//           const resetLink = `http://localhost:3000/resetpassword/${resetToken}`;
//           const mailOptions = {
//             from: 'your-email@gmail.com',
//             to: user.loginmail,
//             subject: 'Password Reset',
//             text: `Click the following link to reset your password: ${resetLink}`,
//           };
  
//           await transporter.sendMail(mailOptions);
  
//           console.log('Reset email sent successfully');
//           return { message: 'Reset email sent successfully' };
//         } catch (error) {
//           console.error('Error sending email:', error);
//           return { message: 'Failed to send email', error: error.message };
//         }
//       };
  
//       const userSchema1 = new mongoose.Schema({
//         categoryName: {
//           type: String,
//           required: true,
//         },
//       });
//       const Category = mongoose.model('Category', userSchema1);
  
//       app.post('/category', async (req, res) => {
//         try {
//           const newCategory = new Category(req.body);
//           const savedCategory = await newCategory.save();
  
//           res.status(200).json({ message: 'Category submitted successfully!', result: savedCategory });
//         } catch (error) {
//           res.status(500).json({ message: 'Error submitting category.' });
//         }
//       });
  
//       app.get('/categories', async (req, res) => {
//         try {
//           const categories = await Category.find({}, 'categoryName');
//           res.json(categories);
//         } catch (error) {
//           console.error('Error fetching categories:', error);
//           res.status(500).send('Internal Server Error');
//         }
//       });
  
//       const employeeSchema = new mongoose.Schema({
//         name: {
//           type: String,
//           required: true,
//         },
//         email: {
//           type: String,
//           required: true,
//           unique: true,
//         },
//         address: {
//           type: String,
//           required: true,
//         },
//         salary: {
//           type: Number,
//           required: true,
//         },
//         category_id: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'Category',
//           required: true,
//         },
//         image: {
//           data: Buffer,
//           contentType: String,
          
//         },
//       });
  
//       const Employee = mongoose.model('Employee', employeeSchema);
  
//       const storage1 = multer.diskStorage({
//         destination: function (req, file, cb) {
//           cb(null, './uploads');
//         },
//         filename: function (req, file, cb) {
//           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//           cb(null, file.fieldname + '-' + uniqueSuffix + "." + file.mimetype.split("/")[1]);
//         },
//       });
  
//       const upload1 = multer({
//         storage: storage1,
//         limits: { fileSize: 1000000 },
//         fileFilter(req, file, cb) {
//           if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             return cb(new Error('Please upload an image (jpg, jpeg, or png)'));
//           }
//           cb(null, true);
//         },
//       }).single('image');
  
//       app.post('/employee', (req, res) => {
//         try {
//           upload1(req, res, async function (err) {
//             if (err instanceof multer.MulterError) {
//               return res.status(400).json({ error: 'Multer error', message: err.message });
//             } else if (err) {
//               return res.status(500).json({ error: 'Internal Server Error', message: err.message });
//             }
      
//             if (!req.file) {
//               return res.status(400).send('No file uploaded');
//             }
      
//             const categoryId = req.body.category_id;
      
//             const employeeData = {
//               name: req.body.name,
//               email: req.body.email,
//               address: req.body.address,
//               salary: req.body.salary,
//               category_id: categoryId,
//               image:req.file.filename 
                
                 
              
//             };
      
//             const employee = new Employee(employeeData);
//             await employee.save();
      
//             res.send({ message: 'Employee saved' });
//           });
//         } catch (error) {
//           console.error(error);
//           res.status(500).send({ error: 'Server Error' });
//         }
//       });
  
//       app.get('/employees', async (req, res) => {
//         try {
//           let employees = await Employee.find()
//             .select('name email address salary category_id image');
  
//           employees = employees.map(async (employee) => {
//             const category = await Category.findById(employee.category_id);
//             employee.categoryName = category ? category.categoryName : 'Unknown';
  
//             employee.imageUrl = `${req.protocol}://${req.headers.host}/uploads/${employee.image.filename}`;
//             return employee;
//           });
  
//           employees = await Promise.all(employees);
  
//           res.json(employees);
//         } catch (error) {
//           console.error(error);
//           res.status(500).send({ error: 'Server error' });
//         }
//       });
      

//       const ctcSchema = new mongoose.Schema({
//         ctcValue: {
//           type: String,
//           required: true,
//         },
//       });
      
//       const Ctc = mongoose.model('Ctc', ctcSchema);
      
//       app.post('/ctc', async (req, res) => {
//         try {
//           const newCtc = new Ctc(req.body);
//           const savedCtc = await newCtc.save();
      
//           res.status(200).json({ message: 'CTC submitted successfully!', result: savedCtc });
//         } catch (error) {
//           res.status(500).json({ message: 'Error submitting CTC.' });
//         }
//       });
      
//       app.get('/ctcs', async (req, res) => {
//         try {
//           const ctcs = await Ctc.find({}, 'ctcValue');
//           res.json(ctcs);
//         } catch (error) {
//           console.error('Error fetching CTCs:', error);
//           res.status(500).send('Internal Server Error');
//         }
//       });
      
//       const noticePeriodSchema = new mongoose.Schema({
//         noticePeriodValue: {
//           type: String,
//           required: true,
//         },
//       });
      
//       const NoticePeriod = mongoose.model('NoticePeriod', noticePeriodSchema);
      
//       app.post('/ctc', async (req, res) => {
//         try {
//           console.log('Request Body:', req.body);  // Add this line
//           const newCtc = new Ctc(req.body);
//           const savedCtc = await newCtc.save();
      
//           res.status(200).json({ message: 'CTC submitted successfully!', result: savedCtc });
//         } catch (error) {
//           console.error('Error submitting CTC:', error);  // Add this line
//           res.status(500).json({ message: 'Error submitting CTC.' });
//         }
//       });
      
      
//       app.get('/notice-periods', async (req, res) => {
//         try {
//           const noticePeriods = await NoticePeriod.find({}, 'noticePeriodValue');
//           res.json(noticePeriods);
//         } catch (error) {
//           console.error('Error fetching Notice Periods:', error);
//           res.status(500).send('Internal Server Error');
//         }
//       });






  
//       app.listen(PORT, () => {
//         console.log(`Server is running at http://localhost:${PORT}`);
//       });
  
//     })
//     .catch((err) => {
//       console.error('Error connecting to MongoDB:', err);
//       process.exit(1);
//     });


















// // const express = require('express');
// // const mongoose = require('mongoose');
// // const multer = require('multer');
// // const cors = require('cors');
// // const bcrypt = require('bcrypt');
// // const jwt = require('jsonwebtoken');
// // const nodemailer = require('nodemailer');
// // const app = express();
// // const PORT = 5000;

// // app.use(express.json());
// // app.use(cors());
// // app.use(express.urlencoded({ extended: true }));
// // app.use('/uploads', express.static('uploads'));

// // const mongodbConnection = 'mongodb://127.0.0.1:27017/MemePage';

// // const fileSchema = new mongoose.Schema({
// //   filename: String,
// //   uploadDate: { type: Date, default: Date.now },
// // });

// // const File = mongoose.model('File', fileSchema);

// // const userSchema = new mongoose.Schema({
// //   loginmail: {
// //     type: String,
// //     required: true,
// //     unique: true,
// //   },
// //   loginpassword: {
// //     type: String,
// //     required: true,
// //   },
// //   resetToken: String,
// //   resetTokenExpiry: Date,
// // });

// // const User = mongoose.model('Signin', userSchema);

// // const userSchema1 = new mongoose.Schema({
// //   categoryName: {
// //     type: String,
// //     required: true,
// //   },
// // });

// // const Category = mongoose.model('Category', userSchema1);

// // const employeeSchema = new mongoose.Schema({
// //   name: {
// //     type: String,
// //     required: true,
// //   },
// //   email: {
// //     type: String,
// //     required: true,
// //     unique: true,
// //   },
// //   address: {
// //     type: String,
// //     required: true,
// //   },
// //   salary: {
// //     type: Number,
// //     required: true,
// //   },
// //   category_id: {
// //     type: mongoose.Schema.Types.ObjectId,
// //     ref: 'Category',
// //     required: true,
// //   },
// //   image: {
// //     data: Buffer,
// //     contentType: String,
// //   },
// // });

// // const Employee = mongoose.model('Employee', employeeSchema);

// // const storage1 = multer.diskStorage({
// //   destination: function (req, file, cb) {
// //     cb(null, './uploads');
// //   },
// //   filename: function (req, file, cb) {
// //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// //     cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
// //   },
// // });

// // const upload1 = multer({
// //   storage: storage1,
// //   limits: { fileSize: 1000000 },
// //   fileFilter(req, file, cb) {
// //     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
// //       return cb(new Error('Please upload an image (jpg, jpeg, or png)'));
// //     }
// //     cb(null, true);
// //   },
// // }).single('image');

// // const ctcSchema = new mongoose.Schema({
// //   ctcValue: {
// //     type: String,
// //     required: true,
// //   },
// // });

// // const Ctc = mongoose.model('Ctc', ctcSchema);

// // const noticePeriodSchema = new mongoose.Schema({
// //   noticePeriodValue: {
// //     type: String,
// //     required: true,
// //   },
// // });

// // const NoticePeriod = mongoose.model('NoticePeriod', noticePeriodSchema);

// // app.post('/upload', upload1, async (req, res) => {
// //   try {
// //     if (!req.file) {
// //       return res.status(400).send('No file uploaded');
// //     }

// //     const video = req.file;

// //     const uploadStream = gridfsBucket.openUploadStream(video.originalname);
// //     uploadStream.end(video.buffer);

// //     uploadStream.on('error', () => {
// //       return res.status(500).send('Error at uploading file');
// //     });

// //     uploadStream.on('finish', async () => {
// //       const fileRecord = new File({
// //         filename: video.originalname,
// //       });
// //       await fileRecord.save();

// //       return res.status(201).send('File uploaded');
// //     });
// //   } catch (error) {
// //     console.error('Error during file upload:', error);
// //     return res.status(500).send('Internal Server Error');
// //   }
// // });

// // app.post('/signin', async (req, resp) => {
// //   try {
// //     const { loginmail, loginpassword, forgottenpassword } = req.body;

// //     if (forgottenpassword) {
// //       const forgottenpasswordResponse = await handleForgottenPassword(req.body);
// //       return resp.json(forgottenpasswordResponse);
// //     }

// //     const user = await User.findOne({ loginmail });

// //     if (user) {
// //       const passwordMatch = await bcrypt.compare(loginpassword, user.loginpassword);

// //       if (passwordMatch) {
// //         const token = generateToken(user);
// //         return resp.json({ message: 'Log In successful', token });
// //       } else {
// //         return resp.status(400).json({ error: 'Bad Request', message: 'Incorrect password' });
// //       }
// //     } else {
// //       const hashedPassword = await bcrypt.hash(loginpassword, 10);
// //       const newUser = new User({ loginmail, loginpassword: hashedPassword });
// //       await newUser.save();

// //       const token = generateToken(newUser);
// //       return resp.json({ message: 'User created and logged in successfully', token });
// //     }
// //   } catch (error) {
// //     resp.status(500).json({ error: 'Internal Server Error', message: error.message });
// //   }
// // });

// // app.post('/category', async (req, res) => {
// //   try {
// //     const newCategory = new Category(req.body);
// //     const savedCategory = await newCategory.save();

// //     res.status(200).json({ message: 'Category submitted successfully!', result: savedCategory });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error submitting category.', error: error.message });
// //   }
// // });

// // app.post('/employee', (req, res) => {
// //   try {
// //     upload1(req, res, async function (err) {
// //       if (err instanceof multer.MulterError) {
// //         return res.status(400).json({ error: 'Multer error', message: err.message });
// //       } else if (err) {
// //         return res.status(500).json({ error: 'Internal Server Error', message: err.message });
// //       }

// //       if (!req.file) {
// //         return res.status(400).send('No file uploaded');
// //       }

// //       const categoryId = req.body.category_id;

// //       const employeeData = {
// //         name: req.body.name,
// //         email: req.body.email,
// //         address: req.body.address,
// //         salary: req.body.salary,
// //         category_id: categoryId,
// //         image: req.file.filename,
// //       };

// //       const employee = new Employee(employeeData);
// //       await employee.save();

// //       res.status(200).json({ message: 'Employee saved successfully!', result: employee });
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: 'Server Error', message: error.message });
// //   }
// // });

// // app.post('/ctc', async (req, res) => {
// //   try {
// //     const newCtc = new Ctc(req.body);
// //     const savedCtc = await newCtc.save();

// //     res.status(200).json({ message: 'CTC submitted successfully!', result: savedCtc });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error submitting CTC.', error: error.message });
// //   }
// // });

// // app.post('/notice-period', async (req, res) => {
// //   try {
// //     const newNoticePeriod = new NoticePeriod(req.body);
// //     const savedNoticePeriod = await newNoticePeriod.save();

// //     res.status(200).json({ message: 'Notice Period submitted successfully!', result: savedNoticePeriod });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error submitting Notice Period.', error: error.message });
// //   }
// // });

// // app.get('/categories', async (req, res) => {
// //   try {
// //     const categories = await Category.find({}, 'categoryName');
// //     res.status(200).json(categories);
// //   } catch (error) {
// //     console.error('Error fetching categories:', error);
// //     res.status(500).json({ error: 'Internal Server Error', message: error.message });
// //   }
// // });

// // app.get('/employees', async (req, res) => {
// //   try {
// //     let employees = await Employee.find().select('name email address salary category_id image');

// //     employees = await Promise.all(
// //       employees.map(async (employee) => {
// //         const category = await Category.findById(employee.category_id);
// //         employee.categoryName = category ? category.categoryName : 'Unknown';

// //         employee.imageUrl = `${req.protocol}://${req.headers.host}/uploads/${employee.image}`;
// //         return employee;
// //       })
// //     );

// //     res.status(200).json(employees);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: 'Server error', message: error.message });
// //   }
// // });

// // app.get('/ctcs', async (req, res) => {
// //   try {
// //     const ctcs = await Ctc.find({}, 'ctcValue');
// //     res.status(200).json(ctcs);
// //   } catch (error) {
// //     console.error('Error fetching CTCs:', error);
// //     res.status(500).json({ error: 'Internal Server Error', message: error.message });
// //   }
// // });

// // app.get('/notice-periods', async (req, res) => {
// //   try {
// //     const noticePeriods = await NoticePeriod.find({}, 'noticePeriodValue');
// //     res.status(200).json(noticePeriods);
// //   } catch (error) {
// //     console.error('Error fetching Notice Periods:', error);
// //     res.status(500).json({ error: 'Internal Server Error', message: error.message });
// //   }
// // });

// // app.listen(PORT, () => {
// //   console.log(`Server is running at http://localhost:${PORT}`);
// // });

// // mongoose.connect(mongodbConnection, { useNewUrlParser: true, useUnifiedTopology: true })
// //   .then(() => {
// //     console.log('Connected to MongoDB');
// //   })
// //   .catch((err) => {
// //     console.error('Error connecting to MongoDB:', err);
// //     process.exit(1);
// //   });



// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const cors = require('cors');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer')
// const bodyParser = require('body-parser');

// const app = express();
// const PORT = 5000;
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cors());
// app.use(express.urlencoded({ extended: true }));

// app.use('/uploads', express.static('uploads'));


// const mongodbConnection = 'mongodb://127.0.0.1:27017/MemePage';

// const fileSchema = new mongoose.Schema({
//   filename: String,
//   uploadDate: { type: Date, default: Date.now },
// });

// const File = mongoose.model('File', fileSchema);

// mongoose.connect(mongodbConnection)
//   .then(() => {
//     console.log('Connected to MongoDB');

//     const gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//       bucketName: 'uploads',
//     });

//     const storage = multer.memoryStorage();

//     const fileFilter = (req, file, cb) => {
//       if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//         cb(null, true);
//       } else {
//         cb(new Error('Only PDF and DOC files are allowed'), false);
//       }
//     };
//     const upload = multer({ storage, fileFilter });

//     app.post('/upload', upload.single('video'), async (req, res) => {
//       try {
//         if (!req.file) {
//           return res.status(400).send('No file uploaded');
//         }

//         const video = req.file;

//         const uploadStream = gridfsBucket.openUploadStream(video.originalname);
//         uploadStream.end(video.buffer);

//         uploadStream.on('error', () => {
//           return res.status(500).send('Error at uploading file');
//         });

//         uploadStream.on('finish', async () => {
//           const fileRecord = new File({
//             filename: video.originalname,
//           });
//           await fileRecord.save();

//           return res.status(201).send('File uploaded');
//         });
//       } catch (error) {
//         console.error('Error during file upload:', error);
//         return res.send('Internal Server Error');
//       }
//     });


//     app.get('/file/:filename', async (req, res) => {
//       try {
//         const file = await gridfsBucket.openDownloadStreamByName(req.params.filename);
//         file.pipe(res);
//       } catch (error) {
//         console.error('Error retrieving file:', error);
//         return res.send('File not found');
//       }
//     });


//     app.get('/files', async (req, res) => {
//       try {
//         const files = await File.find();
//         res.json(files);
//       } catch (error) {
//         console.error('Error fetching files:', error);
//         res.status(500).send('Internal Server Error');
//       }
//     });

//     const userSchema = new mongoose.Schema({
//       loginmail: {
//         type: String,
//         required: true,
//         unique: true,
//       },
//       loginpassword: {
//         type: String,
//         required: true,
//       },
//     });
//     const User = mongoose.model("Signin", userSchema);

//     app.post('/signin', async (req, resp) => {
//       try {
//         const { loginmail, loginpassword, forgottenpassword } = req.body;

//         if (forgottenpassword) {
//           const forgottenpasswordResponse = await handleForgottenPassword({ loginmail });
//           return resp.json(forgottenpasswordResponse);
//         }

//         const user = await User.findOne({ 'loginmail': loginmail });

//         if (user) {
//           const passwordMatch = await bcrypt.compare(loginpassword, user.loginpassword);

//           if (passwordMatch) {
//             const authToken = generateAuthToken(user, false);
//             return resp.json({ message: 'Log In successful', authToken });
//           } else {
//             return resp.json({ message: 'Incorrect password' });
//           }
//         } else {
//           const hashedPassword = await bcrypt.hash(loginpassword, 10);
//           const newUser = new User({ loginmail, loginpassword: hashedPassword });
//           await newUser.save();

//           const authToken = generateAuthToken(newUser, false);
//           return resp.json({ message: 'User created and logged in successfully', authToken });
//         }
//       } catch (error) {
//         resp.status(500).json({ error: 'Internal Server Error', message: error.message });
//       }
//     });

//     const generateAuthToken = (user, isReset) => {
//       const payload = {
//         loginmail: user.loginmail,
//         isReset: isReset,
//       };
//       const authToken = jwt.sign(payload, 'surya', { expiresIn: '1h' });
//       return authToken;
//     };

//     const handleForgottenPassword = async ({ loginmail }) => {
//       try {
//         const user = await User.findOne({ loginmail });

//         if (!user) {
//           return { message: 'User not found' };
//         }

//         const resetToken = jwt.sign({ loginmail: user.loginmail }, 'surya', { expiresIn: '1h', algorithm: 'HS256' });

//         user.resetToken = resetToken;
//         user.resetTokenExpiry = Date.now() + 3600000;
//         await user.save();

//         const transporter = nodemailer.createTransport({
//           host: 'smtp.googlemail.com',
//           port: 465,
//           secure: true,
//           auth: { user: 'ongurisuvarna67@gmail.com', pass: 'eavt pfzm ypcf rixd' },
//         });

//         const resetLink = `http://localhost:3000/resetpassword/${resetToken}`;
//         const mailOptions = {
//           from: 'ongurisuvarna67@gmail.com',
//           to: user.loginmail,
//           subject: 'Password Reset',
//           text: `Click the following link to reset your password: ${resetLink}`,
//         };

//         const info = await transporter.sendMail(mailOptions);

//         console.log('Email sent successfully');
//         return { message: 'Reset email sent successfully', token: resetToken };
//       } catch (error) {
//         console.log('Error sending email:', error.message);
//         return { message: 'Failed to send email', error: error.message };
//       }
//     };

//     app.post('/resetpassword/:token', async (req, resp) => {
//       try {
//         const { token } = req.params;
//         const { newpassword } = req.body;

//         const decodedToken = jwt.verify(token, 'surya');

//         if (!decodedToken) {
//           return resp.json({ message: 'Invalid or expired token' });
//         }

//         const user = await User.findOne({ loginmail: decodedToken.loginmail });

//         if (!user) {
//           return resp.status(404).json({ message: 'User not found' });
//         }

//         if (Date.now() > user.resetTokenExpiry) {
//           return resp.status(400).json({ message: 'Reset token has expired' });
//         }

//         const hashedPassword = await bcrypt.hash(newpassword, 10);
//         user.loginpassword = hashedPassword;
//         user.resetToken = undefined;
//         user.resetTokenExpiry = undefined;
//         await user.save();

//         const authToken = generateAuthToken(user, true);
//         return resp.json({ message: 'Password reset successfully', authToken });
//       } catch (error) {
//         resp.status(500).json({ error: 'Internal Server Error', message: error.message });
//       }
//     });

//     const ctcSchema=new mongoose.Schema({
//       ctc:{
//         type:String,
//       }
//     });
//     const Ctc = mongoose.model('Ctc', ctcSchema);
//     app.post('/ctc1', async (req, res) => {
//       try {
//         const newCtc = new Ctc(req.body);
//         await newCtc.save();
//         res.status(201).json(newCtc);
//       } catch (error) {
//         res.status(400).json({ error: error.message });
//       }
//     });
//     app.get('/ctc1', async (req, res) => {
//       try {
//         const ctcs = await Ctc.find();
//         res.json(ctcs);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//     });
//     const noticePeriodSchema = new mongoose.Schema({
//       noticePeriod: {
//         type: String,
//         default: "Immediate",
//       }
//     });
//     const NoticePeriod = mongoose.model('NoticePeriod', noticePeriodSchema);
//     app.post('/noticeperiod', async (req, res) => {
//       try {
//         const newNoticePeriod = new NoticePeriod(req.body);
//         await newNoticePeriod.save();
//         res.status(201).json(newNoticePeriod);
//       } catch (error) {
//         res.status(400).json({ error: error.message });
//       }
//     });
//     app.get('/noticeperiod', async (req, res) => {
//       try {
//         const noticePeriods = await NoticePeriod.find();
//         res.json(noticePeriods);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//     });
//     const recruiterSchema = new mongoose.Schema({
//       recruiter: {
//         type: String,
//         default: "Active",
//       }
//     });
//     const Recruiter = mongoose.model('Recruiter', recruiterSchema);
//     app.post('/recruiter', async (req, res) => {
//       try {
//         const newRecruiter = new Recruiter(req.body);
//         await newRecruiter.save();
//         res.status(201).json(newRecruiter);
//       } catch (error) {
//         res.status(400).json({ error: error.message });
//       }
//     });
//     app.get('/recruiter', async (req, res) => {
//       try {
//         const recruiters = await Recruiter.find();
//         res.json(recruiters);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//     });
//     const domainSchema = new mongoose.Schema({
//       domain: {
//         type: String
//       }
//     });
//     const Domain = mongoose.model('Domain', domainSchema);
//     app.post('/domain', async (req, res) => {
//       try {
//         const newDomain = new Domain(req.body);
//         await newDomain.save();
//         res.status(201).json(newDomain);
//       } catch (error) {
//         res.status(400).json({ error: error.message });
//       }
//     });
//     app.get('/domain', async (req, res) => {
//       try {
//         const domains = await Domain.find();
//         res.json(domains);
//       } catch (error) {
//         res.status(500).json({ error: error.message });
//       }
//     });


//     const userSchema1 = new mongoose.Schema({
//       categoryName: {
//         type: String,
//         required: true,
//       },
//     });
//     const Category = mongoose.model('Category', userSchema1);

//     app.post('/category', async (req, res) => {
//       try {
//         const newCategory = new Category(req.body);
//         const savedCategory = await newCategory.save();

//         res.status(200).json({ message: 'Category submitted successfully!', result: savedCategory });
//       } catch (error) {
//         res.json({ message: 'Error submitting category.' });
//       }
//     });

//     app.get('/categories', async (req, res) => {
//       try {
//         const categories = await Category.find();
//         res.status(200).json({ message: 'Categories retrieved successfully!', results: categories });
//       } catch (error) {
//         res.status(500).json({ message: 'Error retrieving categories.' });
//       }
//     });

//     const userDetailsSchema = new mongoose.Schema({
//       date: {
//         type: Date,
//         required: false,
//       },
//       recruiter: {
//         type: String,
//         default: "Active",
//         required: true,
//       },
//       domain: {
//         type: String,
//         default: "HTML/css",
//         required: true,
//       },
//       candidate: {
//         type: String,
//         required: true
//       },
//       mobile: {
//         type: String,
//         required: true
//       },
//       email: {
//         type: String,
//         required: true
//       },
//       experience: {
//         type: String,
//         default: "0",
//       },
//       ctc: {
//         type: String,
//         default: "2-3L.P.A",
//       },
//       ectc: {
//         type: String,
//         default: "2-3L.P.A",
//       },
//       noticePeriod: {
//         type: String,
//         default: "Immediate",
//       },
//       remarks: {
//         type: String,
//         required: true
//       },
//     });

//     const userDetailsModel = mongoose.model("UserDetails", userDetailsSchema);

//     const userDetailsSubmission = async (req, res) => {
//       try {
//         const data = { ...req.body };
//         console.log(data);

//         await new userDetailsModel(data).save();

//         res.json({ msg: "Successfully submitted" });
//       } catch (error) {
//         console.error(error);

//         res.json({ error: `please fill all the fields and reupload Resume,${error.message}` });
//       }
//     };

//     const getAllUserDetails = async (req, res) => {
//       try {
//         const allUserDetails = await userDetailsModel.find();

//         res.json(allUserDetails);
//       } catch (error) {
//         console.error(error);
//         res.json({ error: "Internal Server Error" });
//       }
//     };

//     app.post('/form', userDetailsSubmission);
//     app.get('/all', getAllUserDetails);


   
    
//     const employeeSchema = new mongoose.Schema({
//       employ_id: {
//         type: String,
//         required: true,
//         unique: true
//       },
//       name: {
//         type: String,
//         required: true,
//       },
//       email: {
//         type: String,
//         required: true,

//       },
//       address: {
//         type: String,
//         required: true,
//       },
//       salary: {
//         type: Number,
//         required: true,
//       },

//       password: {
//         type: String,
//         required: true
//       },
//       category:{
//         type:String,
//         required:true
//       },
//       image: {
//         data: Buffer,
//         contentType: String,
//       },
//     });
//     const Employee = mongoose.model('Employee', employeeSchema);


//     const storage1 = multer.diskStorage({
//       destination: function (req, file, cb) {
//         cb(null, './uploads');
//       },
//       filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + "." + file.mimetype.split("/")[1]);
//       },
//     });

//     const upload1 = multer({
//       storage: storage1,
//       limits: { fileSize: 1000000 },
//       fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//           return cb(new Error('Please upload an image'));
//         }
//         cb(null, true);
//       },
//     });



//     app.post('/employee', upload1.single('image'), async (req, res) => {
//       try {
//         if (!req.file) {
//           return res.status(400).send('No file uploaded');
//         }
//         const existingEmployee = await Employee.findOne({ "employ_id": req.body.employ_id });

//         if (existingEmployee) {

//           return res.status(400).json({ "message": "Employee with given id already exists" });
//         }

//         const employeeData = {
//           employ_id: req.body.employ_id,
//           name: req.body.name,
//           email: req.body.email,
//           password: req.body.password,
//           address: req.body.address,
//           salary: req.body.salary,
//           category:req.body.category,
//           image: req.file.filename,
//         };

//         const employee = new Employee(employeeData);

//         await employee.save();
//         await Employee.updateOne({
//           email: employee.employ_id
//         },
//           {
//             $set: {
//               image: req.file.filename
//             }
//           });

//         res.send({ message: 'Employee saved' });
//       } catch (error) {
//         console.error(error);
//         res.send({ error: 'Server Error' });
//       }
//     });


//     app.put('/employee/:employ_id', async (req, res) => {
//       try {
//         const employ_id = req.params.employ_id;
//         const existingEmployee = await Employee.findOne({ employ_id });

//         if (!existingEmployee) {
//           return res.status(404).json({ message: 'Employee not found' });
//         }

//         const updateFields = {
//           name: req.body.name || existingEmployee.name,
//           email: req.body.email || existingEmployee.email,
//           address: req.body.address || existingEmployee.address,
//           salary: req.body.salary || existingEmployee.salary,
//         };

//         await Employee.updateOne({ employ_id }, { $set: updateFields });

//         res.json({ message: 'Employee updated successfully' });
//       } catch (error) {
//         console.error(error);
//         res.json({ error: 'Server Error' });
//       }
//     });



//     app.get('/employees', async (req, res) => {

//       try {
//         let employees = await Employee.find()
//         employees = employees.map(employee => {
//           employee.imageUrl = `${req.protocol}://${req.headers.host}/uploads/${employee.image}`;
//           return employee;
//         });
//         res.json(employees);
//       } catch (error) {
//         console.error(error);
//         res.status(500).send({ error: 'Server error' });
//       }
//     });

    
//     app.get('/employee/:employ_id', async (req, res) => {
//       try {
//         const employ_id = req.params.employ_id;
//         const employee = await Employee.findOne({ employ_id });

//         if (!employee) {
//           return res.status(404).json({ message: 'Employee not found' });
//         }
//         res.json(employee);
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server Error' });
//       }
//     });


//     app.delete('/employee/:employ_id', async (req, res) => {
//       try {
//         const employ_id = req.params.employ_id;
//         const existingEmployee = await Employee.findOne({ employ_id });

//         if (!existingEmployee) {
//           return res.status(404).json({ message: 'Employee not found' });
//         }

//         await Employee.deleteOne({ employ_id });
//         res.json({ message: 'Employee deleted successfully' });
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server Error' });
//       }
//     });


//     app.listen(PORT, () => {
//       console.log(`Server is running at http://localhost:${PORT}`);
//     });

//   })
//   .catch((err) => {
//     console.error('Error connecting to MongoDB:', err);
//     process.exit(1);
//   });