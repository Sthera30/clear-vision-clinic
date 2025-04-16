import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { hashPassword, hasConfrimPassword, comparePassword, hashOtp, compareOtp } from '../security/security.js'
import nodemailer from 'nodemailer'
import genOTP from 'otp-generator'
import pool from './db.js'


export const register = async (req, res) => {
    const { profilepicture, fullname, lastname, email, telno, addressline1, addressline2, gender, role, dob, password, confirmpassword } = req.body;

    try {
        // Input validation
        if (!fullname) return res.status(200).json({ error: 'FullName is required!', success: false });
        if (!lastname) return res.status(200).json({ error: 'LastName is required!', success: false });
        if (!email) return res.status(200).json({ error: 'email is required!', success: false });
        if (!telno) return res.status(200).json({ error: 'Telephone Number is required!', success: false });
        if (!addressline1) return res.status(200).json({ error: 'Address Line 1 is required!', success: false });
        if (!gender) return res.status(200).json({ error: 'Gender is required!', success: false });
        if (!dob) return res.status(200).json({ error: 'Date of birth is required!', success: false });
        if (!password || password.length < 6) return res.status(200).json({ error: 'Password must be at least 6 characters!', success: false });
        if (password !== confirmpassword) return res.status(200).json({ error: 'Passwords do not match!', success: false });

        // Check if email already exists in the database
        const checkEmail = async (email) => {
            const query = "SELECT * FROM users WHERE email = $1"; // Using parameterized query ($1) for PostgreSQL
            const result = await pool.query(query, [email]);
            return result.rows; // Returns the rows of the result
        };

        const results = await checkEmail(email);

        if (results.length > 0) {
            return res.status(200).json({ error: 'Email already exists!', success: false });
        }

        // Hash password for security
        const hashPass = await hashPassword(password);
        const hashConfirmPass = await hasConfrimPassword(confirmpassword);

        // Insert new user into the database
        const createUser = async () => {
            const sql = `
                INSERT INTO users (profilepicture, fullname, lastname, email, telno, addressline1, addressline2, gender, role, dob, password, confirmpassword) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            `;
            await pool.query(sql, [profilepicture, fullname, lastname, email, telno, addressline1, addressline2, gender, 'user', dob, hashPass, hashConfirmPass]);
        };

        await createUser();

        // JWT stores user information
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        // Store the token in a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,  // Use 'secure' in production
            sameSite: 'None'
        });

        return res.status(200).json({
            message: 'Successfully registered!', success: true, data: {
                token
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to register', success: false });
    }
};

export const authUser = async (req, res) => {
    try {
        const checkSql = "SELECT * FROM users WHERE email = $1";
        const { rows } = await pool.query(checkSql, [req.user.email]);

        if (rows.length === 0) {
            return res.status(200).json({ error: 'User not found!', success: false });
        }

        const user = rows[0];

        return res.status(200).json({
            message: 'User Found!',
            success: true,
            data: {
                user: user
            }
        });

    } catch (error) {
        console.error("Error authenticating user:", error);
        return res.status(200).json({ error: 'Failed Authenticating User!', success: false });
    }
};

export const loginUser = async (req, res) => {
    const { password, email } = req.body;

    try {
        if (!email || !password) {
            return res.status(200).json({ error: 'Email and Password are required!', success: false });
        }

        const checkUserSql = "SELECT * FROM users WHERE email = $1";
        const { rows } = await pool.query(checkUserSql, [email]);

        if (rows.length === 0) {
            return res.status(200).json({ error: 'Invalid login details!', success: false });
        }

        const user = rows[0];
        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(200).json({ error: 'Wrong Password!', success: false });
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        return res.status(200).json({
            message: 'logged in successfully', success: true, data: { user, token }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error!' });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: "Strict"
        });
        return res.status(200).json({ message: 'logged out successfully', success: true });
    } catch (error) {
        console.log(error);
    }
};


export const addDoctor = async (req, res) => {
    const {
        profilepicture, doctorname, doctoremail, doctorexperience, doctorfee,
        doctoraddressline1, doctorqualification, doctorspeciality,
        doctoraddressline2, aboutdoctor, password, confirmpassword
    } = req.body;

    try {
        if (!doctorname || !doctoremail || !doctorexperience || !doctorfee ||
            !doctoraddressline1 || !doctorqualification || !doctorspeciality ||
            !aboutdoctor || !password || password.length < 6 ||
            !confirmpassword || confirmpassword.length < 6 ||
            password !== confirmpassword) {
            return res.status(200).json({ error: 'All fields are required and passwords must match!', success: false });
        }

        const chckEmailExistsSql = "SELECT * FROM doctor WHERE doctoremail = $1";
        const { rows } = await pool.query(chckEmailExistsSql, [doctoremail]);

        if (rows.length > 0) {
            return res.status(200).json({ error: 'Doctor email already exists!', success: false });
        }

        const hashDoctorPassword = await hashPassword(password);
        const hashConfirmDoctorPassword = await hasConfrimPassword(confirmpassword);

        const addDoctorSql = `INSERT INTO doctor (
            profilepicture, doctorname, doctoremail, doctorexperience,
            doctorfee, doctoraddressline1, doctorqualification,
            doctorspeciality, doctoraddressline2, aboutdoctor,
            password, confirmpassword
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;

        await pool.query(addDoctorSql, [
            profilepicture, doctorname, doctoremail, doctorexperience,
            doctorfee, doctoraddressline1, doctorqualification,
            doctorspeciality, doctoraddressline2, aboutdoctor,
            hashDoctorPassword, hashConfirmDoctorPassword
        ]);

        return res.status(200).json({ message: 'Successfully added doctor!', success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to add doctor', success: false });
    }
};


export const getAllDoctor = async (req, res) => {
    try {
        const getAllDoctorSql = "SELECT * FROM doctor";
        const { rows: doctors } = await pool.query(getAllDoctorSql);

        if (doctors.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false });
        }

        return res.status(200).json({
            message: '', success: true, data: {
                doctors: doctors
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to fetch doctors', success: false });
    }
};


//

export const getDoctorById = async (req, res) => {
    const { id } = req.query;

    try {
        const { rows } = await pool.query("SELECT * FROM doctor WHERE id = $1", [id]);

        if (rows.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false });
        }

        return res.status(200).json({
            message: '', success: true, data: {
                doctor: rows[0]
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to get doctor by ID', success: false });
    }
};

export const removeDoctor = async (req, res) => {
    const { id } = req.query;

    try {
        const result = await pool.query("DELETE FROM doctor WHERE id = $1", [id]);

        if (result.rowCount === 0) {
            return res.status(200).json({ error: 'No changes were made!', success: false });
        }

        return res.status(200).json({ message: 'Deleted successfully!', success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to delete doctor', success: false });
    }
};

export const updateDoctor = async (req, res) => {
    const { id, profilepicture, doctorname, doctoremail, doctorexperience, doctorfee, doctoraddressline1, doctorqualification, doctorspeciality, doctoraddressline2, aboutdoctor, password, confirmpassword } = req.body;

    if (!doctorname || !doctoremail || !doctorexperience || !doctorfee || !doctoraddressline1 || !doctorqualification || !doctorspeciality || !aboutdoctor) {
        return res.status(200).json({ error: 'All required fields must be filled', success: false });
    }

    try {
        const { rows } = await pool.query("SELECT * FROM doctor WHERE id = $1", [id]);

        if (rows.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false });
        }

        const doctor = rows[0];

        const updateDoctorSql = `
            UPDATE doctor SET 
                profilepicture = $1,
                doctorname = $2,
                doctoremail = $3,
                doctorexperience = $4,
                doctorfee = $5,
                doctoraddressline1 = $6,
                doctorqualification = $7,
                doctorspeciality = $8,
                doctoraddressline2 = $9,
                aboutdoctor = $10,
                password = $11,
                confirmpassword = $12
            WHERE id = $13
        `;

        const result = await pool.query(updateDoctorSql, [
            profilepicture || doctor.profilepicture,
            doctorname || doctor.doctorname,
            doctoremail || doctor.doctoremail,
            doctorexperience || doctor.doctorexperience,
            doctorfee || doctor.doctorfee,
            doctoraddressline1 || doctor.doctoraddressline1,
            doctorqualification || doctor.doctorqualification,
            doctorspeciality || doctor.doctorspeciality,
            doctoraddressline2 || doctor.doctoraddressline2,
            aboutdoctor || doctor.aboutdoctor,
            password || doctor.password,
            confirmpassword || doctor.confirmpassword,
            id
        ]);

        if (result.rowCount === 0) {
            return res.status(200).json({ error: 'No changes were made!', success: false });
        }

        return res.status(200).json({
            message: 'Updated successfully', success: true, data: {
                id: id,
                profilepicture: profilepicture || doctor.profilepicture,
                doctorname: doctorname || doctor.doctorname,
                doctoremail: doctoremail || doctor.doctoremail,
                doctorexperience: doctorexperience || doctor.doctorexperience,
                doctorfee: doctorfee || doctor.doctorfee,
                doctoraddressline1: doctoraddressline1 || doctor.doctoraddressline1,
                doctorqualification: doctorqualification || doctor.doctorqualification,
                doctorspeciality: doctorspeciality || doctor.doctorspeciality,
                doctoraddressline2: doctoraddressline2 || doctor.doctoraddressline2,
                aboutdoctor: aboutdoctor || doctor.aboutdoctor,
                password: password || doctor.password,
                confirmpassword: confirmpassword || doctor.confirmpassword,
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to update doctor', success: false });
    }
};

export const addDoctorAvailability = async (req, res) => {
    const { entries } = req.body;

    try {
        if (!entries || !Array.isArray(entries) || entries.length === 0) {
            return res.status(400).json({ error: 'No availability entries provided', success: false });
        }

        const invalidEntries = entries.filter(entry =>
            !entry.doctorname || !entry.date || !entry.availablestatus
        );

        if (invalidEntries.length > 0) {
            return res.status(400).json({ error: 'Invalid entries', success: false, invalidEntries });
        }

        const values = entries.map(entry => [
            entry.doctorname,
            entry.date,
            entry.timeslot || null,
            entry.availablestatus
        ]);

        const placeholders = values.map(
            (_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`
        ).join(', ');

        const flatValues = values.flat();

        const sql = `
            INSERT INTO "doctorAvailability" (doctorname, date, timeslot, availablestatus)
            VALUES ${placeholders}
        `;

        const result = await pool.query(sql, flatValues);

        return res.status(200).json({
            message: `Successfully added ${result.rowCount} availability entries`,
            success: true,
            insertedCount: result.rowCount
        });

    } catch (error) {
        console.error('Unhandled error in addDoctorAvailability:', error);
        return res.status(500).json({ error: 'Internal server error', success: false, details: error.message });
    }
};

export const addServices = async (req, res) => {
    const { profilePicture, serviceHeading, serviceDescription } = req.body;

    if (!profilePicture || !serviceHeading || !serviceDescription) {
        return res.status(400).json({ error: 'All fields are required!', success: false });
    }

    try {
        const sql = `
            INSERT INTO services (profilePicture, serviceHeading, serviceDescription)
            VALUES ($1, $2, $3)
        `;
        await pool.query(sql, [profilePicture, serviceHeading, serviceDescription]);

        return res.status(200).json({ message: 'Successfully added!', success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
};

export const getAllServices = async (req, res) => {
    try {
        const sql = "SELECT * FROM services";
        const { rows } = await pool.query(sql);

        if (rows.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false });
        }

        return res.status(200).json({ success: true, data: { services: rows } });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
};

export const getServicesById = async (req, res) => {
    const { id } = req.query;

    try {
        const sql = "SELECT * FROM services WHERE id = $1";
        const { rows } = await pool.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false });
        }

        return res.status(200).json({ success: true, data: { services: rows[0] } });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
};

export const removeServices = async (req, res) => {
    const { id } = req.query;

    try {
        const sql = "DELETE FROM services WHERE id = $1";
        const result = await pool.query(sql, [id]);

        if (result.rowCount === 0) {
            return res.status(200).json({ error: 'No changes were made!', success: false });
        }

        return res.status(200).json({ message: 'Deleted successfully!', success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
};

export const updateServices = async (req, res) => {
    const { id, profilepicture, serviceheading, servicedescription } = req.body;

    if (!profilepicture || !serviceheading || !servicedescription) {
        return res.status(400).json({ error: 'All fields are required!', success: false });
    }

    try {
        const findSql = "SELECT * FROM services WHERE id = $1";
        const { rows } = await pool.query(findSql, [id]);

        if (rows.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false });
        }

        const updateSql = `
            UPDATE services
            SET profilepicture = $1, serviceheading = $2, servicedescription = $3
            WHERE id = $4
        `;
        const updateResult = await pool.query(updateSql, [profilepicture, serviceheading, servicedescription, id]);

        if (updateResult.rowCount === 0) {
            return res.status(200).json({ error: 'No changes were made!', success: false });
        }

        return res.status(200).json({
            message: 'Updated successfully',
            success: true,
            data: { id, profilepicture, serviceheading, servicedescription }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
};


export const addAboutUs = async (req, res) => {
    const { profilePicture, aboutUsHeading, aboutUsDescription } = req.body;

    if (!profilePicture || !aboutUsHeading || !aboutUsDescription) {
        return res.status(400).json({ error: 'All fields are required!', success: false });
    }

    try {
        const sql = `
            INSERT INTO aboutUs (profilePicture, aboutUsHeading, aboutUsDescription)
            VALUES ($1, $2, $3)
        `;
        await pool.query(sql, [profilePicture, aboutUsHeading, aboutUsDescription]);

        return res.status(200).json({ message: 'Successfully added!', success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
};


export const getAllAboutUs = async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM \"aboutUs\"");
        return res.status(200).json({ message: '', success: true, data: { aboutUs: rows } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error', success: false });
    }
};

export const getAboutUsById = async (req, res) => {
    const { id } = req.query;
    try {
        const { rows } = await pool.query("SELECT * FROM \"aboutUs\" WHERE id = $1", [id]);
        if (rows.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false });
        }
        return res.status(200).json({ message: '', success: true, data: { aboutUs: rows[0] } });
    } catch (error) {
        console.error(error);
    }
};



export const removeAboutUs = async (req, res) => {
    const { id } = req.query;
    try {
        const result = await pool.query("DELETE FROM \"aboutUs\" WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(200).json({ error: 'No changes were made!', success: false });
        }
        return res.status(200).json({ message: 'Deleted successfully!', success: true });
    } catch (error) {
        console.error(error);
    }
};

export const updateAboutUs = async (req, res) => {
    const { id, profilepicture, aboutusheading, aboutusdescription } = req.body;

    if (!profilepicture || !aboutusheading || !aboutusdescription) {
        return res.status(200).json({ error: 'All fields are required!', success: false });
    }

    try {
        const { rows } = await pool.query("SELECT * FROM \"aboutUs\" WHERE id = $1", [id]);
        if (rows.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false });
        }

        const existing = rows[0];

        const result = await pool.query(
            "UPDATE \"aboutUs\" SET \"profilepicture\" = $1, \"aboutusheading\" = $2, \"aboutusdescription\" = $3 WHERE id = $4",
            [
                profilepicture || existing.profilepicture,
                aboutusheading || existing.aboutusheading,
                aboutusdescription || existing.aboutusdescription,
                id
            ]
        );

        if (result.rowCount === 0) {
            return res.status(200).json({ error: 'No changes were made!', success: false });
        }

        return res.status(200).json({
            message: 'Updated successfully',
            success: true,
            data: {
                id,
                profilepicture: profilepicture || existing.profilepicture,
                aboutusheading: aboutusheading || existing.aboutusheading,
                aboutusdescription: aboutusdescription || existing.aboutusdescription
            }
        });
    } catch (error) {
        console.error(error);
    }
};

export const getDocAvailabilityByName = async (req, res) => {
    const { doctorname } = req.query;
    try {
        const { rows } = await pool.query(
            "SELECT DISTINCT date FROM \"doctorAvailability\" WHERE \"doctorname\" = $1",
            [doctorname]
        );
        return res.status(200).json({ message: '', success: true, data: { doctorAvailability: rows } });
    } catch (error) {
        console.error(error);
    }
};

export const getDocAvailabilityTimeByDocName = async (req, res) => {
    const { doctorname } = req.query;
    try {
        const { rows } = await pool.query(
            "SELECT DISTINCT \"timeslot\" FROM \"doctorAvailability\" WHERE \"doctorname\" = $1",
            [doctorname]
        );
        if (rows.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false });
        }
        return res.status(200).json({ message: '', success: true, data: { docTimeSlot: rows } });
    } catch (error) {
        console.error(error);
    }
};

// Create email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use another service like SendGrid, Mailgun, etc.
    auth: {
        user: "tinisthera@gmail.com",
        pass: "atubsombqjecgvjm" // Use app-specific password for Gmail
    }
});

export const addAppointment = async (req, res) => {
    const { doctorname, username, email, appointmentdate, appointmenttime, appointmenttype, reasonforvisit } = req.body;

    try {
        if (!appointmentdate || !appointmenttime || !appointmenttype || !reasonforvisit) {
            return res.status(200).json({ error: 'All fields are required!', success: false });
        }

        const checkQuery = `SELECT * FROM appointment WHERE appointmentTime = $1`;
        const { rows: appResults } = await pool.query(checkQuery, [appointmenttime]);

        if (appResults.length > 0) {
            return res.status(200).json({ error: 'This timeslot is already booked. Please choose another!', success: false });
        }

        const insertQuery = `
            INSERT INTO appointment (doctorname, username, appointmentdate, appointmenttime, appointmenttype, status, reasonforvisit)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await pool.query(insertQuery, [doctorname, username, appointmentdate, appointmenttime, appointmenttype, "pending", reasonforvisit]);

        const formattedDate = new Date(appointmentdate).toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: 'Your Appointment Confirmation',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #2196F3;">Appointment Confirmation</h2>
                    <p>Your appointment has been successfully booked!</p>
                    <div style="background-color: #f9f9f9; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0;">
                        <p><strong>Doctor:</strong> ${doctorname}</p>
                        <p><strong>Date:</strong> ${formatteddate}</p>
                        <p><strong>Time:</strong> ${appointmenttime}</p>
                        <p><strong>Type:</strong> ${appointmenttype}</p>
                    </div>
                    <p>Thank you for choosing our services!</p>
                    <p style="color: #fff;">The Clear Vision Clinic Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Appointment booked successfully! A confirmation email has been sent.', success: true });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server Error', success: false });
    }
};

export const getAppointmentByUser = async (req, res) => {
    const { username } = req.query;


    try {
        const query = 'SELECT * FROM appointment WHERE username = $1';
        const { rows } = await pool.query(query, [username]);

        return res.status(200).json({
            message: '', success: true, data: {
                appointments: rows
            }
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const getDocProfilePic = async (req, res) => {
    const { doctorname } = req.query;

    try {
        const getDocProfile_sql = "SELECT * FROM doctor WHERE \"doctorname\" = $1";
        const { rows } = await pool.query(getDocProfile_sql, [doctorname]);

        if (rows.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false });
        }

        return res.status(200).json({
            message: '', success: true, data: {
                doctor: rows
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Server error', success: false });
    }
}
export const getAppointmentById = async (req, res) => {
    const { id } = req.query;

    try {
        const editAppointment_sql = 'SELECT * FROM "appointment" WHERE id = $1';
        const { rows } = await pool.query(editAppointment_sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Appointment not found', success: false });
        }

        return res.status(200).json({
            message: '',
            success: true,
            data: {
                appointment: rows[0]
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error', success: false });
    }
};

export const updateAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const { appointmentDate, appointmentTime, appointmentType, reasonForVisit } = req.body;

    try {
        const query = `
            UPDATE appointment
            SET appointmentDate = $1, appointmentTime = $2, appointmentType = $3, reasonForVisit = $4
            WHERE appointmentId = $5
        `;
        await pool.query(query, [appointmentDate, appointmentTime, appointmentType, reasonForVisit, appointmentId]);

        res.status(200).json({ message: 'Appointment updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const getUserInfoByEmail = async (req, res) => {
    const { email } = req.query;

    console.log(email);

    try {
        const getUserInfoByEmail_sql = "SELECT * FROM users WHERE email = $1";
        const { rows } = await pool.query(getUserInfoByEmail_sql, [email]);

        if (rows.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false });
        }

        return res.status(200).json({
            message: '', success: true, data: {
                userEmail: rows[0]
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Server error', success: false });
    }
}


export const getUserInfoById = async (req, res) => {
    const { id } = req.query;

    try {
        const query = 'SELECT * FROM users WHERE id = $1';
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'user info not found', success: false });
        }

        return res.status(200).json({
            message: '', success: true, data: {
                userInfo: rows[0]
            }
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};


export const updateUserProfile = async (req, res) => {

    const { id, fullname, email, telno, gender, dob } = req.body;

    try {
        const query = `
            UPDATE users
            SET fullname = $1, email = $2, telno = $3, gender = $4, dob = $5
            WHERE id = $6
        `;
        await pool.query(query, [fullname, email, telno, gender, dob, id]);

        res.status(200).json({ message: 'User profile updated successfully!', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const getAllAppointments = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM appointment");
        return res.status(200).json({
            message: '', success: true, data: { appointment: result.rows }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error!' });
    }
};

export const getAllAllUsers = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        return res.status(200).json({
            message: '', success: true, data: { users: result.rows }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error!' });
    }
};
export const updateUserAppointment = async (req, res) => {
    const {
        id,
        status,
        doctorname,
        appointmentdate,
        appointmenttime,
        appointmenttype,
        fullname,
        email
    } = req.body;

    console.log(`Hello ${email}`);

    try {
        const { rows: results } = await pool.query(
            "SELECT * FROM appointment WHERE id = $1",
            [id]
        );

        if (results.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false });
        }

        const appoint = results[0];

        const { rowCount } = await pool.query(
            "UPDATE appointment SET status = $1 WHERE id = $2",
            [status || appoint.status, id]
        );

        if (rowCount === 0) {
            return res.status(200).json({ error: 'No changes made!', success: false });
        }

        const formattedDates = new Date(appointmentdate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Fetch user email
        const { rows: userEmailRows } = await pool.query(
            "SELECT email FROM users WHERE fullName = $1",
            [fullname]
        );

        if (userEmailRows.length === 0) {
            return res.status(200).json({ error: 'No user email found!', success: false });
        }

        const userEm = userEmailRows[0];

        let userMailOptions, adminMailOptions;

        if (status === 'Approved') {
            userMailOptions = {
                from: process.env.USER,
                to: userEm.email,
                subject: 'Appointment Approved',
                html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #4CAF50;">Appointment Approved</h2>
              <p>Great news! Your appointment has been approved.</p>
              <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
                <p><strong>Doctor:</strong> ${doctorname}</p>
                <p><strong>Date:</strong> ${formattedDates}</p>
                <p><strong>Time:</strong> ${appointmenttime}</p>
                <p><strong>Type:</strong> ${appointmenttype}</p>
              </div>
              <p>We look forward to seeing you!</p>
              <br />
              <p style="font-size: 14px; color: #fff;">Regards,</p>
              <p style="font-size: 14px; color: #fff;">The Clear Vision Clinic Team</p>
            </div>`
            };

            adminMailOptions = {
                from: process.env.USER,
                to: email,
                subject: 'Appointment Approved',
                html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #4CAF50;">Appointment Approved Notification</h2>
              <p>An appointment has been approved.</p>
              <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
                <p><strong>Patient Email:</strong> ${userEm.email}</p>
                <p><strong>Doctor:</strong> ${doctorname}</p>
                <p><strong>Date:</strong> ${formattedDates}</p>
                <p><strong>Time:</strong> ${appointmenttime}</p>
                <p><strong>Type:</strong> ${appointmenttype}</p>
              </div>
            </div>`
            };
        } else if (status === 'Rejected') {
            userMailOptions = {
                from: process.env.USER,
                to: userEm.email,
                subject: 'Appointment Rejected',
                html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #F44336;">Appointment Rejected</h2>
              <p>We regret to inform you that your appointment has been rejected.</p>
              <div style="background-color: #f9f9f9; border-left: 4px solid #F44336; padding: 15px; margin: 20px 0;">
                <p><strong>Doctor:</strong> ${doctorname}</p>
                <p><strong>Date:</strong> ${formattedDates}</p>
                <p><strong>Time:</strong> ${appointmenttime}</p>
                <p><strong>Type:</strong> ${appointmenttype}</p>
              </div>
              <p>Please contact our office for more information.</p>
              <br />
              <p style="font-size: 14px; color: #fff;">Regards,</p>
              <p style="font-size: 14px; color: #fff;">The Clear Vision Clinic Team</p>
            </div>`
            };

            adminMailOptions = {
                from: process.env.USER,
                to: email,
                subject: 'Appointment Rejected',
                html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #F44336;">Appointment Rejected Notification</h2>
              <p>An appointment has been rejected.</p>
              <div style="background-color: #f9f9f9; border-left: 4px solid #F44336; padding: 15px; margin: 20px 0;">
                <p><strong>Patient Email:</strong> ${userEm.email}</p>
                <p><strong>Doctor:</strong> ${doctorname}</p>
                <p><strong>Date:</strong> ${formattedDates}</p>
                <p><strong>Time:</strong> ${appointmenttime}</p>
                <p><strong>Type:</strong> ${appointmenttype}</p>
              </div>
            </div>`
            };
        }

        if (status === 'Approved' || status === 'Rejected') {
            await transporter.sendMail(userMailOptions);
            await transporter.sendMail(adminMailOptions);
        }

        return res.status(200).json({
            message: 'Appointment status updated successfully!',
            success: true,
            data: {
                id: id,
                status: status || appoint.status
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong!', success: false });
    }
};


export const searchDoc = async (req, res) => {
    try {
        const search = req.query.search || "";
        const result = await pool.query(
            "SELECT * FROM doctor WHERE doctorname ILIKE $1",
            [`%${search}%`]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No doctors found" });
        }

        res.json(result.rows);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const searchAppointment = async (req, res) => {
    try {
        const search = req.query.search || "";
        const result = await pool.query(
            "SELECT * FROM appointment WHERE username ILIKE $1",
            [`%${search}%`]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No users found!" });
        }

        res.json(result.rows);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Server error" });
    }
};


export const verifyEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(200).json({ error: 'Email is required!', success: false });

    try {
        const otpGen = genOTP.generate(6, {
            digits: true, upperCase: false, lowerCase: false,
            upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false
        });

        const hashedOtp = await hashOtp(otpGen);

        const checkEmailExistsSql = "SELECT * FROM users WHERE email = $1";
        const { rows } = await pool.query(checkEmailExistsSql, [email]);

        if (rows.length === 0) {
            return res.status(200).json({ error: 'Email address not registered!', success: false });
        }

        const user_email = rows[0];

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'tinisthera@gmail.com',
                pass: 'atubsombqjecgvjm'
            }
        });

        const mailOptions = {
            from: '"Clear Vision Clinic" <tinisthera@gmail.com>',
            to: email,
            subject: 'Your OTP Verification Code - Clear Vision Clinic',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <h2 style="text-align: center; color: #007BFF;">Clear Vision Clinic</h2>
                    <p style="font-size: 16px; color: #333;">Dear Valued Patient,</p>
                    <p style="font-size: 16px; color: #333;">
                        Thank you for choosing Clear Vision Clinic. To complete your verification, please use the OTP below:
                    </p>
                    <div style="text-align: center; font-size: 24px; font-weight: bold; color: #007BFF; padding: 10px; border: 2px dashed #007BFF; display: inline-block;">
                        ${otpGen}
                    </div>
                    <p style="font-size: 16px; color: #333;">
                        This OTP is valid for **5 minutes**. Please do not share it with anyone for security reasons.
                    </p>
                    <p style="font-size: 16px; color: #333;">
                        If you did not request this, please ignore this email.
                    </p>
                    <p style="font-size: 16px; color: #333;">Best regards,<br /><strong>Clear Vision Clinic Team</strong></p>
                </div>
              `
        };

        await transporter.sendMail(mailOptions);

        const insertOtpSql = "INSERT INTO otp (otp, userEmail) VALUES ($1, $2)";
        await pool.query(insertOtpSql, [hashedOtp, email]);

        return res.status(200).json({
            message: 'OTP sent to your email address!',
            success: true,
            data: { user_email }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error!' });
    }
};


export const verifyOtp = async (req, res) => {
    const { otp, email } = req.body;

    if (!otp || otp.length !== 6) {
        return res.status(200).json({ error: 'OTP must be 6 digits!', success: false });
    }

    try {
        const otpQuery = "SELECT * FROM otp WHERE userEmail = $1";
        const { rows: otpResults } = await pool.query(otpQuery, [email]);

        if (otpResults.length === 0) {
            return res.status(200).json({ error: 'Email not found!', success: false });
        }

        const otp_ = otpResults[0];

        const userQuery = "SELECT * FROM users WHERE email = $1";
        const { rows: userResults } = await pool.query(userQuery, [email]);

        if (userResults.length === 0) {
            return res.status(200).json({ error: 'Email not found in users!', success: false });
        }

        const isMatch = await compareOtp(otp, otp_.otp);
        if (!isMatch) {
            return res.status(200).json({ error: 'OTP Do Not Match!', success: false });
        }

        const updateUserSql = "UPDATE users SET isVerified = $1 WHERE email = $2";
        const { rowCount: updateCount } = await pool.query(updateUserSql, [1, email]);
        if (updateCount === 0) {
            return res.status(200).json({ error: 'No changes made!', success: false });
        }

        const deleteOtpSql = "DELETE FROM otp WHERE otp = $1";
        await pool.query(deleteOtpSql, [otp_.otp]);

        return res.status(200).json({
            message: 'OTP Verified!',
            success: true,
            data: { otp_: otp_ }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error!' });
    }
};


export const change_password = async (req, res) => {
    const { password, confirmpassword, email } = req.body;

    if (!password || password.length < 6 || !confirmpassword || confirmpassword.length < 6) {
        return res.status(200).json({ error: 'Passwords must be at least 6 characters long!', success: false });
    }

    try {
        const userQuery = "SELECT * FROM users WHERE email = $1";
        const { rows: results } = await pool.query(userQuery, [email]);

        if (results.length === 0) {
            return res.status(200).json({ error: 'User not found!', success: false });
        }

        const user = results[0];

        if (!user.isverified) {
            return res.status(200).json({ error: 'Please verify your OTP sent to your email!', success: false });
        }

        if (password !== confirmpassword) {
            return res.status(200).json({ error: 'Passwords Do Not Match!', success: false });
        }

        const hashCurrentPassword = await hashPassword(password);
        const hashNewPassword = await hasConfrimPassword(confirmpassword);

        const updatePasswordSql = "UPDATE users SET password = $1, confirmPassword = $2 WHERE email = $3";
        const { rowCount } = await pool.query(updatePasswordSql, [hashCurrentPassword, hashNewPassword, email]);

        if (rowCount === 0) {
            return res.status(200).json({ error: 'No changes were made!', success: false });
        }

        return res.status(200).json({ message: 'Password changed successfully!', success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error!' });
    }
};


///Hey guys, i'm so excited. I've never been this excited in my life! This coming friday i'll be launching
// my business website called sthe digital agency. Stay tuned!