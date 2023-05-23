const bcrypt = require('bcrypt');

const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
require('dotenv').config();

const upload = require('../config/multerConfig');

const {
    s3UploadGet
} = require('../config/awsService-get');


module.exports = (app, User) => {

    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // Add session middleware
    app.use(session({
        secret: 'mysecret',
        resave: false,
        saveUninitialized: false
    }));

    // Add flash middleware
    app.use(flash());


    app.post('/upload/:userId', upload.array('file', 6), async (req, res) => {
        try {
            const userId = req.params.userId;
            const results = await s3UploadGet.uploadFile(req.files, userId);

            // Iterate inside files and get the original name
            const photoPaths = req.files.map(file => file.originalname);

            console.table(photoPaths);

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }
            user.profile_image = photoPaths[0] || user.profile_image;
            user.profile_image2 = photoPaths[1] || user.profile_image2;
            user.profile_image3 = photoPaths[2] || user.profile_image3;
            user.profile_image4 = photoPaths[3] || user.profile_image4;
            user.profile_image5 = photoPaths[4] || user.profile_image5;
            user.profile_image6 = photoPaths[5] || user.profile_image6;

            await user.save();
            res.redirect('/success');
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                error: 'Internal server error'
            });
        }
    });


    app.get('/success', (req, res) => {
        res.render('success');
    });

    app.get('/contact', (req, res) => {
        res.render('contact');
    });


    app.get('/About', (req, res) => {
        res.render('About');
    });



    // Route to render the upload form
    app.get('/upload/:userId', async (req, res) => {
        const userId = req.params.userId;
        res.render('upload', {
            userId
        });
    });


    // Route to serve the user profile image
    app.get('/profile-image/:userId', (req, res, next) => {
        const userId = req.params.userId; // Retrieve the userId from the request parameters

        // Modify the S3 upload get request to filter by userId
        s3UploadGet.listObjects({
                Prefix: userId + '/'
            })
            .then((data) => {
                console.log(data);
                const baseURL = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/`;
                let urlArray = data.Contents ? data.Contents.map(e => baseURL + e.Key) : [];
                console.log(urlArray);
                console.log(userId);

                // Render the testImg.ejs file with the URL array as data
                res.render('testImg.ejs', {
                    urlArray,
                    userId
                }, (err, html) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            error: 'Internal Server Error'
                        }); // Handle the error and send an appropriate response
                    } else {
                        // Set the response content type to "text/html"
                        res.setHeader('Content-Type', 'text/html');
                        // Send the rendered HTML response
                        res.send(html);
                    }
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({
                    error: 'Internal Server Error'
                }); // Handle the error and send an appropriate response
            });
    });

    app.get('/', (req, res) => {
        res.render('welcome');
    });

    app.post('/register', async (req, res) => {
        const {
            email,
            password,
            confirmPassword,
            fullName,
            phoneNumber,
            locationOrAddress,
            dateOfBirth,
            bloodType,
            gender,
            diabetes,
            hyperTension,
            asthma,
            heartDisease,
            surgeries,
            allergies,
            drugs,
            weight,
            height,
            other,
            facebook,
            instagram,
            snapchat,
            telegram,
        } = req.body;


        if (password !== confirmPassword) {
            return res.status(400).send('Password and confirm password do not match.');
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 8);

        try {
            // Create a new user with the hashed password and additional fields
            const user = await User.create({
                email,
                password: hashedPassword,
                FullName: fullName,
                PhoneNumber: phoneNumber,
                LocationOrAddress: locationOrAddress,
                DateOfBirth: dateOfBirth,
                BloodType: bloodType,
                gender,
                diabetes,
                hyperTension,
                asthma,
                heartDisease,
                surgeries,
                allergies,
                drugs,
                Weight: weight,
                Height: height,
                other,
                facebook,
                instagram,
                snapchat,
                telegram,
            });

            res.render('upload', {
                userId: user.id
            });
        } catch (error) {
            console.error(error);
            req.flash('error', 'An error occurred while registering the user.');
            res.redirect('/register');
        }
    });

    app.post('/login', async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        try {
            const user = await User.findOne({
                where: {
                    email
                }
            });

            if (!user) {
                req.flash('error', 'User not found.');
                return res.redirect('/login');
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                req.flash('error', 'Incorrect password.');
                return res.redirect('/login');
            }

            const userId = user.id;
            const userData = await User.findByPk(userId);

            s3UploadGet.listObjects({
                    Prefix: `uploads/userID:${userId}/`
                })
                .then((data) => {
                    const baseURL = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/`;
                    const urlArray = data.Contents ? data.Contents.map(e => baseURL + e.Key) : [];

                    // Render the index.ejs file with the userData, userId, user, and urlArray as data
                    res.render('index', {
                        userData: userData,
                        userId: userId,
                        user: user,
                        urlArray: urlArray
                    });
                })

                .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                        error: 'Internal Server Error'
                    });
                });
        } catch (error) {
            console.error(error);
            req.flash('error', 'An error occurred while logging in.');
            res.redirect('/login');
        }
    });



    app.get('/login', (req, res) => {
        res.render('login');
    });

    app.get('/register', (req, res) => {
        res.render('register');
    });




};