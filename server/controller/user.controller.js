import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { hashPassword, hasConfrimPassword, comparePassword, hashOtp, compareOtp } from '../security/security.js'
import { db } from '../index.js'
import nodemailer from 'nodemailer'
import genOTP from 'otp-generator'

export const register = async (req, res) => {

    const { profilePicture, fullName, lastName, email, telNo, addressLine1, addressLine2, gender, role, dob, password, confirmPassword } = req.body

    try {

        if (!fullName) {
            return res.status(200).json({ error: 'FullName is required!', success: false })
        }

        if (!lastName) {
            return res.status(200).json({ error: 'LastName is required!', success: false })
        }

        if (!email) {
            return res.status(200).json({ error: 'email is required!', success: false })
        }

        if (!telNo) {
            return res.status(200).json({ error: 'Telephone Number is required!', success: false })
        }

        if (!addressLine1) {
            return res.status(200).json({ error: 'Address Line 1 is required!', success: false })
        }

        if (!gender) {
            return res.status(200).json({ error: 'Gender is required!', success: false })
        }

        if (!dob) {
            return res.status(200).json({ error: 'Date of birth is required!', success: false })
        }

        if (!password || password.length < 6) {
            return res.status(200).json({ error: 'password is required and must be atleast 6 characters!', success: false })
        }

        if (!confirmPassword || confirmPassword.length < 6) {
            return res.status(200).json({ error: 'confirm password is required and must be atleast 6 characters!', success: false })
        }


        if (password !== confirmPassword) {
            return res.status(200).json({ error: 'Passwords do not match!', success: false })
        }

        // const match = await userModel.findOne({ email })

        //check if email already exists

        const checkEmail = () => {

            return new Promise((resolve, reject) => {

                const checkSql = "SELECT * FROM users WHERE email = ?"

                db.query(checkSql, [email], (err, results) => {

                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(results)
                    }

                })

            })

        }

        const results = await checkEmail()

        if (results.length > 0) {
            return res.status(200).json({ error: 'Email already exists!', success: false })
        }

        /*if (match) {
            return res.status(200).json({ error: 'Email already exists!', success: false })
        }
            */



        //Increase security
        const hashPass = await hashPassword(password)
        const hashConfirmPass = await hasConfrimPassword(confirmPassword)

        // const user = await userModel.create({ name: name, email: email, password: hashPass, confirmPassword: hashConfirmPass })


        const createUser = () => {

            return new Promise((resolve, reject) => {

                const sql = 'INSERT INTO users (profilePicture, fullName, lastName, email, telNo, addressLine1, addressLine2, gender, role, dob, password, confirmPassword) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

                db.query(sql, [profilePicture, fullName, lastName, email, telNo, addressLine1, addressLine2, gender, 'user', dob, hashPass, hashConfirmPass], (err, result) => {

                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }

                })


            })


        }


        await createUser()

        //JWT stores user information


        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {

            expiresIn: '1d'

        })


        //lets store the token in a cookie

        res.cookie('token', token, {
            httpOnly: true,
            //secure: false
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'Strict' : 'Lax' // Use 'Strict' in production, 'Lax' otherwise
        })


        return res.status(200).json({
            message: 'Successfully registered!', success: true, data: {
                token
            }
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to register', success: false })
    }

}


export const authUser = async (req, res) => {

    try {


        const checkEmail = () => {
            return new Promise((resolve, reject) => {

                const checkSql = "SELECT * FROM users WHERE email = ?"

                db.query(checkSql, [req.user.email], (err, result) => {

                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }

                })

            })
        }

        const results = await checkEmail()


        //  const user = await userModel.findOne({ email: req.user.email })

        /* if (!user) {
             return res.status(200).json({ error: 'User not found!', success: false })
 
     }
             */


        if (results.length === 0) {
            return res.status(200).json({ error: 'User not found!', success: false })
        }

        const user = results[0]

        return res.status(200).json({
            message: 'User Found!', success: true, data: {
                user: user
            }
        })


    } catch (error) {
        console.log(error);
        return res.status(200).json({ error: 'Failed Authenticating User!', success: false })
    }


}


export const loginUser = async (req, res) => {

    const { password, email } = req.body

    try {

        if (!email) {
            return res.status(200).json({ error: 'Email is required!', success: false })
        }

        if (!password) {
            return res.status(200).json({ error: 'Password is required!', success: false })
        }

        //const user = await userModel.findOne({ email: email })

        const checkUser = () => {

            return new Promise((resolve, reject) => {

                const checkUserSql = "SELECT * FROM users WHERE email = ?"

                db.query(checkUserSql, [email], (err, result) => {

                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }

                })

            })
        }



        const results = await checkUser()

        console.log(`Hello ${results}`);



        //checks if the array isempty
        if (results.length === 0) {
            return res.status(200).json({ error: 'Invalid login details!', success: false })
        }

        const user = results[0]

        /*if (!user) {
            return res.status(200).json({ error: 'invalid login details!', success: false })
        }
            */

        //Used to store user info
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })

        //Store token in cookie

        res.cookie('token', token, {

            httpOnly: true,
            // secure: false
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'Strict' : 'Lax' // Use 'Strict' in production, 'Lax' otherwise

            //   sameSite: 'none'
        })

        //compare passwords

        const isMatch = await comparePassword(password, user.password)

        if (!isMatch) {
            return res.status(200).json({ error: 'Wrong Password!', success: false })
        }

        return res.status(200).json({
            message: 'logged in successfull', success: true, data: {
                user: user,
                token
            }
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error!' })
    }


}


export const logout = async (req, res) => {

    try {

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none"
        })

        return res.status(200).json({ message: 'logged out successfully', success: true })

    } catch (error) {
        console.log(error);
    }
}


export const addDoctor = async (req, res) => {

    const { profilePicture, doctorName, doctorEmail, doctorExperience, doctorFee, doctorAddressLine1, doctorQualification, doctorSpeciality, doctorAddressLine2, aboutDoctor, password, confirmPassword } = req.body

    try {

        if (!doctorName) {
            return res.status(200).json({ error: 'Doctor name is required!', success: false })
        }


        if (!doctorEmail) {
            return res.status(200).json({ error: 'Doctor email is required!', success: false })
        }


        if (!doctorExperience) {
            return res.status(200).json({ error: 'Doctor experience is required!', success: false })
        }


        if (!doctorFee) {
            return res.status(200).json({ error: 'Doctor fee is required!', success: false })
        }


        if (!doctorAddressLine1) {
            return res.status(200).json({ error: 'Doctor address line 1 is required!', success: false })
        }


        if (!doctorQualification) {
            return res.status(200).json({ error: 'Doctor qualification is required!', success: false })
        }


        if (!doctorSpeciality) {
            return res.status(200).json({ error: 'Doctor speciality is required!', success: false })
        }



        if (!aboutDoctor) {
            return res.status(200).json({ error: 'About doctor field is required!', success: false })
        }

        if (!password || password.length < 6) {
            return res.status(200).json({ error: 'password is required and must be atleast 6 characters!', success: false })
        }

        if (!confirmPassword || confirmPassword.length < 6) {
            return res.status(200).json({ error: 'confirm password is required and must be atleast 6 characters!', success: false })
        }


        if (password !== confirmPassword) {
            return res.status(200).json({ error: 'Passwords do not match!', success: false })
        }


        //check if email exixts before you add a doctor


        const chckEmailExists = () => {

            return new Promise((resolve, reject) => {

                const chckEmailExistsSql = "SELECT * FROM doctor WHERE doctorEmail = ?"
                db.query(chckEmailExistsSql, [doctorEmail], (err, result) => {
                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }
                })


            })

        }

        const results = await chckEmailExists()

        //which means it exists
        if (results.length > 0) {
            return res.status(200).json({ error: 'Doctor email already exists!', success: false })
        }


        // bcrypt passwords before you add them

        const hashDoctorPassword = await hashPassword(password)
        const hashConfirmDoctorPassword = await hasConfrimPassword(confirmPassword)

        //Then you can add the doctor

        const addDoctor_ = () => {
            return new Promise((resolve, reject) => {

                const addDoctorSql = "INSERT INTO doctor (profilePicture, doctorName, doctorEmail, doctorExperience, doctorFee, doctorAddressLine1, doctorQualification, doctorSpeciality, doctorAddressLine2, aboutDoctor, password, confirmPassword ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
                db.query(addDoctorSql, [profilePicture, doctorName, doctorEmail, doctorExperience, doctorFee, doctorAddressLine1, doctorQualification, doctorSpeciality, doctorAddressLine2, aboutDoctor, hashDoctorPassword, hashConfirmDoctorPassword], (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })

            })
        }

        await addDoctor_()

        return res.status(200).json({ message: 'Successfully added doctor!', success: true })

    } catch (error) {
        console.log(error);
    }


}

export const getAllDoctor = async (req, res) => {

    try {

        const getAllDoctor_ = () => {

            return new Promise((resolve, reject) => {

                const getAllDoctorSql = "SELECT * FROM doctor"
                db.query(getAllDoctorSql, (err, result) => {
                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }
                })

            })

        }

        const results = await getAllDoctor_()

        if (results.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false })
        }



        const doctors = results



        return res.status(200).json({
            message: '', success: true, data: {
                doctors: doctors
            }
        })

    } catch (error) {
        console.log(error);
    }

}

//


export const getDoctorById = async (req, res) => {

    const { id } = req.query

    console.log(`Hello ${id}`);


    try {

        const getDoctorById_ = () => {

            return new Promise((resolve, reject) => {
                const getDoctorByIdSql = "SELECT * FROM doctor WHERE id = ?"
                db.query(getDoctorByIdSql, [id], (err, result) => {
                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }
                })
            })

        }

        const results = await getDoctorById_()

        if (results.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false })
        }

        const doctor = results[0]

        return res.status(200).json({
            message: '', success: true, data: {
                doctor: doctor
            }
        })

    } catch (error) {
        console.log(error);
    }

}


export const removeDoctor = async (req, res) => {

    const { id } = req.query


    try {

        const removeDoctor_ = () => {

            return new Promise((resolve, reject) => {
                const removeDoctorSql = "DELETE FROM doctor WHERE id = ?"
                db.query(removeDoctorSql, [id], (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })
            })

        }

        const results = await removeDoctor_()

        if (results.affectedRows === 0) {
            return res.status(200).json({ error: 'No changes were made!', success: false })
        }

        return res.status(200).json({
            message: 'Deleted successfully!', success: true
        })

    } catch (error) {
        console.log(error);
    }

}

export const updateDoctor = async (req, res) => {


    const { id, profilePicture, doctorName, doctorEmail, doctorExperience, doctorFee, doctorAddressLine1, doctorQualification, doctorSpeciality, doctorAddressLine2, aboutDoctor, password, confirmPassword } = req.body


    if (!doctorName) {
        return res.status(200).json({ error: 'doctor name is required!', success: false })
    }

    if (!doctorEmail) {
        return res.status(200).json({ error: 'doctor email is required!', success: false })
    }

    if (!doctorExperience) {
        return res.status(200).json({ error: 'doctor experience is required!', success: false })
    }

    if (!doctorFee) {
        return res.status(200).json({ error: 'doctor fee is required!', success: false })
    }

    if (!doctorAddressLine1) {
        return res.status(200).json({ error: 'doctor addressline1 is required!', success: false })
    }

    if (!doctorQualification) {
        return res.status(200).json({ error: 'doctor qualification is required!', success: false })
    }

    if (!doctorSpeciality) {
        return res.status(200).json({ error: 'doctor speciality is required!', success: false })
    }

    if (!aboutDoctor) {
        return res.status(200).json({ error: 'about doctor is required!', success: false })
    }


    try {


        const getDocById = () => {

            return new Promise((resolve, reject) => {

                const getDocByIdSql_ = "SELECT * FROM services WHERE id = ?"
                db.query(getDocByIdSql_, [id], (err, result) => {

                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })

            })

        }

        const results = await getDocById()

        if (results.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false })
        }

        const doctor = results

        const updateDoctor_ = () => {
            return new Promise((resolve, reject) => {

                const updateDoctorSql = "UPDATE doctor SET profilePicture = ?, doctorName = ?, doctorEmail = ?, doctorExperience = ?, doctorFee = ?, doctorAddressLine1 = ?, doctorQualification = ?, doctorSpeciality = ?, doctorAddressLine2 = ?, aboutDoctor = ?, password = ?, confirmPassword = ?  WHERE id = ? "
                db.query(updateDoctorSql, [profilePicture || doctor[0].profilePicture, doctorName || doctor[0].doctorName, doctorEmail || doctor[0].doctorEmail, doctorExperience || doctor[0].doctorExperience, doctorFee || doctor[0].doctorFee, doctorAddressLine1 || doctor[0].doctorAddressLine1, doctorQualification || doctor[0].doctorQualification, doctorSpeciality || doctor[0].doctorSpeciality, doctorAddressLine2 || doctor[0].doctorAddressLine2, aboutDoctor || doctor[0].aboutDoctor, password || doctor[0].password, confirmPassword || doctor[0].confirmPassword, id], (err, result) => {
                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }
                })

            })
        }

        const updateResults = await updateDoctor_()

        if (updateResults.affectedRows === 0) {
            return res.status(200).json({ error: 'No changes were made!', success: false })
        }

        return res.status(200).json({
            message: 'Updated successfully', success: true, data: {
                id: id,
                profilePicture: profilePicture || doctor[0].profilePicture,
                doctorName: doctorName || doctor[0].doctorName,
                doctorEmail: doctorEmail || doctor[0].doctorEmail,
                doctorExperience: doctorExperience || doctor[0].doctorExperience,
                doctorFee: doctorFee || doctor[0].doctorFee,
                doctorAddressLine1: doctorAddressLine1 || doctor[0].doctorAddressLine1,
                doctorQualification: doctorQualification || doctor[0].doctorQualification,
                doctorSpeciality: doctorSpeciality || doctor[0].doctorSpeciality,
                doctorAddressLine2: doctorAddressLine2 || doctor[0].doctorAddressLine2,
                aboutDoctor: aboutDoctor || doctor[0].aboutDoctor,
                password: password || doctor[0].password,
                confirmPassword: confirmPassword || doctor[0].confirmPassword,
            }
        })

    } catch (error) {
        console.log(error);
    }

}

export const addDoctorAvailability = async (req, res) => {
    const { entries } = req.body;

    try {
        if (!entries || !Array.isArray(entries) || entries.length === 0) {
            return res.status(400).json({ error: 'No availability entries provided', success: false });
        }

        const invalidEntries = entries.filter(entry =>
            !entry.doctorName || !entry.Date || !entry.availableStatus
        );

        if (invalidEntries.length > 0) {
            return res.status(400).json({ error: 'Invalid entries', success: false, invalidEntries });
        }

        const addDocAvailabilities = () => {
            return new Promise((resolve, reject) => {
                const addDocAvailabilitySql = "INSERT INTO doctorAvailability (doctorName, Date, timeSlot, availableStatus) VALUES ?";

                const values = entries.map(entry => [
                    entry.doctorName,
                    entry.Date,
                    entry.timeSlot || null, // Insert NULL if no time slot is provided
                    entry.availableStatus
                ]);

                db.query(addDocAvailabilitySql, [values], (err, result) => {
                    if (err) {
                        console.error('Database insertion error:', err);
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        const result = await addDocAvailabilities();

        return res.status(200).json({
            message: `Successfully added ${result.affectedRows} availability entries`,
            success: true,
            insertedCount: result.affectedRows
        });

    } catch (error) {
        console.error('Unhandled error in addDoctorAvailability:', error);
        return res.status(500).json({ error: 'Internal server error', success: false, details: error.message });
    }
};


export const addServices = async (req, res) => {


    const { profilePicture, serviceHeading, serviceDescription } = req.body

    if (!profilePicture) {
        return res.status(200).json({ error: 'profile picture is required!', success: false })
    }

    if (!serviceHeading) {
        return res.status(200).json({ error: 'service heading is required!', success: false })
    }

    if (!serviceDescription) {
        return res.status(200).json({ error: 'service description is required!', success: false })
    }


    try {

        const addService_ = () => {
            return new Promise((resolve, reject) => {
                const addServiceSql = "INSERT INTO services (profilePicture, serviceHeading, serviceDescription) VALUES (?, ?, ?)"
                db.query(addServiceSql, [profilePicture, serviceHeading, serviceDescription], (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })
            })
        }

        await addService_()

        return res.status(200).json({ message: 'successfully added!', success: true })

    } catch (error) {
        console.log(error);

    }

}


export const getAllServices = async (req, res) => {

    try {

        const getAllServices_ = () => {

            return new Promise((resolve, reject) => {

                const getAllServicesSql = "SELECT * FROM services"
                db.query(getAllServicesSql, (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })

            })

        }

        const results = await getAllServices_()

        if (results.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false })
        }

        const services = results

        return res.status(200).json({
            message: '', success: true, data: {
                services: services
            }
        })

    } catch (error) {
        console.log(error);
    }

}


export const getServicesById = async (req, res) => {

    const { id } = req.query

    try {

        const getServicesById_ = () => {

            return new Promise((resolve, reject) => {
                const getServicesByIdSql = "SELECT * FROM services WHERE id = ?"
                db.query(getServicesByIdSql, [id], (err, result) => {
                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }
                })
            })

        }

        const results = await getServicesById_()

        if (results.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false })
        }

        const services = results[0]

        return res.status(200).json({
            message: '', success: true, data: {
                services: services
            }
        })

    } catch (error) {
        console.log(error);
    }

}


export const removeServices = async (req, res) => {

    const { id } = req.query


    try {

        const removeServices_ = () => {

            return new Promise((resolve, reject) => {
                const removeServicesSql = "DELETE FROM services WHERE id = ?"
                db.query(removeServicesSql, [id], (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })
            })

        }

        const results = await removeServices_()

        if (results.affectedRows === 0) {
            return res.status(200).json({ error: 'No changes were made!', success: false })
        }

        return res.status(200).json({
            message: 'Deleted successfully!', success: true
        })

    } catch (error) {
        console.log(error);
    }

}

export const updateServices = async (req, res) => {


    const { id, profilePicture, serviceHeading, serviceDescription } = req.body

    if (!profilePicture) {
        return res.status(200).json({ error: 'profile picture is required!', success: false })
    }

    if (!serviceHeading) {
        return res.status(200).json({ error: 'service heading is required!', success: false })
    }

    if (!serviceDescription) {
        return res.status(200).json({ error: 'service description is required!', success: false })
    }



    try {


        const getServicesById = () => {

            return new Promise((resolve, reject) => {

                const getServicesByIdSql_ = "SELECT * FROM services WHERE id = ?"
                db.query(getServicesByIdSql_, [id], (err, result) => {

                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })

            })

        }

        const results = await getServicesById()

        if (results.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false })
        }

        const service = results

        const updateServices_ = () => {
            return new Promise((resolve, reject) => {

                const updateServicesSql = "UPDATE services SET profilePicture = ?, serviceHeading = ?, serviceDescription = ? WHERE id = ? "
                db.query(updateServicesSql, [profilePicture || service[0].profilePicture, serviceHeading || service[0].serviceHeading, serviceDescription || service[0].serviceDescription, id], (err, result) => {
                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }
                })

            })
        }

        const updateResults = await updateServices_()

        if (updateResults.affectedRows === 0) {
            return res.status(200).json({ error: 'No changes were made!', success: false })
        }

        return res.status(200).json({
            message: 'Updated successfully', success: true, data: {
                id: id,
                profilePicture: profilePicture || service[0].profilePicture,
                serviceHeading: serviceHeading || service[0].serviceHeading,
                serviceDescription: serviceDescription || service[0].serviceDescription
            }
        })

    } catch (error) {
        console.log(error);
    }

}


export const addAboutUs = async (req, res) => {


    const { profilePicture, aboutUsHeading, aboutUsDescription } = req.body

    if (!profilePicture) {
        return res.status(200).json({ error: 'profile picture is required!', success: false })
    }

    if (!aboutUsHeading) {
        return res.status(200).json({ error: 'about us heading is required!', success: false })
    }

    if (!aboutUsDescription) {
        return res.status(200).json({ error: 'about us description is required!', success: false })
    }


    try {

        const addAboutUs_ = () => {
            return new Promise((resolve, reject) => {
                const addAboutUsSql = "INSERT INTO aboutUs (profilePicture, aboutUsHeading, aboutUsDescription) VALUES (?, ?, ?)"
                db.query(addAboutUsSql, [profilePicture, aboutUsHeading, aboutUsDescription], (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })
            })
        }

        await addAboutUs_()

        return res.status(200).json({ message: 'successfully added!', success: true })

    } catch (error) {
        console.log(error);

    }

}


export const getAllAboutUs = async (req, res) => {

    try {

        const getAllAboutUs_ = () => {

            return new Promise((resolve, reject) => {

                const getAllAboutUsSql = "SELECT * FROM aboutUs"
                db.query(getAllAboutUsSql, (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })

            })

        }

        const results = await getAllAboutUs_()


        const aboutUs = results

        return res.status(200).json({
            message: '', success: true, data: {
                aboutUs: aboutUs
            }
        })

    } catch (error) {
        console.log(error);
    }

}


export const getAboutUsById = async (req, res) => {

    const { id } = req.query

    try {

        const getAboutUsById_ = () => {

            return new Promise((resolve, reject) => {
                const getAboutUsByIdSql = "SELECT * FROM aboutUs WHERE id = ?"
                db.query(getAboutUsByIdSql, [id], (err, result) => {
                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }
                })
            })

        }

        const results = await getAboutUsById_()

        if (results.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false })
        }

        const aboutUs = results[0]

        return res.status(200).json({
            message: '', success: true, data: {
                aboutUs: aboutUs
            }
        })

    } catch (error) {
        console.log(error);
    }

}


export const removeAboutUs = async (req, res) => {

    const { id } = req.query


    try {

        const removeAboutUs_ = () => {

            return new Promise((resolve, reject) => {
                const removeAboutUsSql = "DELETE FROM aboutUs WHERE id = ?"
                db.query(removeAboutUsSql, [id], (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })
            })

        }

        const results = await removeAboutUs_()

        if (results.affectedRows === 0) {
            return res.status(200).json({ error: 'No changes were made!', success: false })
        }

        return res.status(200).json({
            message: 'Deleted successfully!', success: true
        })

    } catch (error) {
        console.log(error);
    }

}

export const updateAboutUs = async (req, res) => {


    const { id, profilePicture, aboutUsHeading, aboutUsDescription } = req.body

    if (!profilePicture) {
        return res.status(200).json({ error: 'profile picture is required!', success: false })
    }

    if (!aboutUsHeading) {
        return res.status(200).json({ error: 'about us heading is required!', success: false })
    }

    if (!aboutUsDescription) {
        return res.status(200).json({ error: 'about us description is required!', success: false })
    }



    try {


        const getAboutUsById = () => {

            return new Promise((resolve, reject) => {

                const getAboutUsByIdSql_ = "SELECT * FROM aboutUs WHERE id = ?"
                db.query(getAboutUsByIdSql_, [id], (err, result) => {

                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })

            })

        }

        const results = await getAboutUsById()

        if (results.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false })
        }

        const about = results

        const updateAboutUs_ = () => {
            return new Promise((resolve, reject) => {

                const updateAboutUsSql = "UPDATE aboutUs SET profilePicture = ?, aboutUsHeading = ?, aboutUsDescription = ? WHERE id = ? "
                db.query(updateAboutUsSql, [profilePicture || about[0].profilePicture, aboutUsHeading || about[0].aboutUsHeading, aboutUsDescription || about[0].aboutUsDescription, id], (err, result) => {
                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }
                })

            })
        }

        const updateResults = await updateAboutUs_()

        if (updateResults.affectedRows === 0) {
            return res.status(200).json({ error: 'No changes were made!', success: false })
        }

        return res.status(200).json({
            message: 'Updated successfully', success: true, data: {
                id: id,
                profilePicture: profilePicture || about[0].profilePicture,
                aboutUsHeading: aboutUsHeading || about[0].aboutUsHeading,
                aboutUsDescription: aboutUsDescription || about[0].aboutUsDescription
            }
        })

    } catch (error) {
        console.log(error);
    }

}

export const getDocAvailabilityByName = async (req, res) => {

    const { doctorName } = req.query

    console.log(`Hello ${doctorName}`);


    try {

        const getDocAvailByDocName = () => {
            return new Promise((resolve, reject) => {
                const getDocAvailByDocNameSql = "SELECT DISTINCT date FROM doctorAvailability WHERE doctorName = ?"
                db.query(getDocAvailByDocNameSql, [doctorName], (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })
            })
        }

        const results = await getDocAvailByDocName()

        const doctorAvailability = results

        return res.status(200).json({
            message: '', success: true, data: {
                doctorAvailability: doctorAvailability
            }
        })


    } catch (error) {
        console.log(error);
    }

}

export const getDocAvailabilityTimeByDocName = async (req, res) => {

    const { doctorName } = req.query

    try {

        const getDocAvailabilityTimeByDocName_ = () => {
            return new Promise((resolve, reject) => {
                const getDocAvailabilityTimeByDocName_sql = "SELECT DISTINCT timeSlot from doctorAvailability WHERE doctorName = ?"
                db.query(getDocAvailabilityTimeByDocName_sql, [doctorName], (err, result) => {
                    if (err) {
                        reject(error)
                    }
                    else {
                        resolve(result)
                    }
                })
            })
        }

        const results = await getDocAvailabilityTimeByDocName_()

        if (results.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false })
        }

        const docTimeSlot = results

        return res.status(200).json({
            message: '', success: true, data: {
                docTimeSlot: docTimeSlot
            }
        })


    } catch (error) {
        console.log(error);
    }

}


// Create email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use another service like SendGrid, Mailgun, etc.
    auth: {
        user: "tinisthera@gmail.com",
        pass: "atubsombqjecgvjm" // Use app-specific password for Gmail
    }
});

export const addAppointment = async (req, res) => {


    const { doctorName, userName, email, appointmentDate, appointmentTime, appointmentType, reasonForVisit } = req.body

    console.log(appointmentTime);


    try {

        if (!appointmentDate) {
            return res.status(200).json({ error: 'appointment date is required!', success: false })
        }

        if (!appointmentTime) {
            return res.status(200).json({ error: 'appointment time is required!', success: false })
        }

        if (!appointmentType) {
            return res.status(200).json({ error: 'appointment type is required!', success: false })
        }

        if (!reasonForVisit) {
            return res.status(200).json({ error: 'reason for visit field is required!', success: false })
        }

        //Check if appointment is already booked before you book it

        const checkIsBooked = () => {
            return new Promise((resolve, reject) => {

                const checkIsBookedSql = "SELECT * FROM appointment WHERE appointmentTime = ?"
                db.query(checkIsBookedSql, [appointmentTime], (err, result) => {
                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }
                })

            })
        }

        const appResults = await checkIsBooked()


        if (appResults.length > 0) {
            return res.status(200).json({ error: 'This timeslot is already booked. Please choose another!', success: false })
        }

        const addAppointment_ = () => {

            return new Promise((resolve, reject) => {
                const addAppointment_Sql = "INSERT INTO appointment (doctorName, userName, appointmentDate, appointmentTime, appointmentType, status, reasonForVisit) VALUES (?, ?, ?, ?, ?, ?, ?)"
                db.query(addAppointment_Sql, [doctorName, userName, appointmentDate, appointmentTime, appointmentType, "pending", reasonForVisit], (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })
            })

        }

        await addAppointment_()

        // Format date for email
        const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Compose email
        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: 'Your Appointment Confirmation',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2196F3;">Appointment Confirmation</h2>
          <p>Your appointment has been successfully booked!</p>
          
          <div style="background-color: #f9f9f9; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0;">
            <p><strong>Doctor:</strong> ${doctorName}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${appointmentTime}</p>
            <p><strong>Type:</strong> ${appointmentType}</p>
          </div>
          
          <p>If you need to reschedule or cancel, please contact our office at least 24 hours in advance.</p>
          <p>Thank you for choosing our services!</p>

          <br />
          <p style="font-size: 14px; color: #fff;">Regards,</p>
          <p style="font-size: 14px; color: #fff;">The Clear Vision Clinic Team</p>

        </div>
      `
        };

        // Send email
        await transporter.sendMail(mailOptions);


        return res.status(200).json({ message: 'Appointment booked successfully! A confirmation email has been sent.', success: true })


    } catch (error) {
        console.log(error);

    }

}

// Expert Eye Care with a Personal Touch
//Clear Vision Clinic has been providing exceptional eye care services to our community since 2005. Our team of highly skilled optometrists and ophthalmologists combine their expertise with state-of-the-art technology to deliver comprehensive eye examinations and personalized treatment plans. We believe that everyone deserves clear vision and healthy eyes. Our mission is to provide accessible, high-quality eye care in a comfortable and friendly environment. We take the time to understand your unique visual needs and develop tailored solutions that enhance your quality of life.


export const getAppointmentByUser = async (req, res) => {

    const { userName } = req.query

    try {

        const getAppointmentByUser_ = () => {
            return new Promise((resolve, reject) => {

                const getAppointmentByUserSql = "SELECT * FROM appointment WHERE userName = ?"
                db.query(getAppointmentByUserSql, [userName], (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })

            })
        }

        const results = await getAppointmentByUser_()

        if (results.length === 0) {
            return res.status(200).json({ error: 'no information found!', success: false })
        }

        const appointments = results


        return res.status(200).json({
            message: '', success: true, data: {
                appointments: appointments
            }
        })

    } catch (error) {
        console.log(error);
    }
}


export const getDocProfilePic = async (req, res) => {

    const { doctorName } = req.query

    console.log(doctorName);

    try {

        const getDocProfile_ = () => {
            return new Promise((resolve, reject) => {
                const getDocProfile_sql = "SELECT * FROM doctor WHERE doctorName = ?"
                db.query(getDocProfile_sql, [doctorName], (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })
            })
        }

        const results = await getDocProfile_()



        if (results.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false })
        }

        const doctor = results

        return res.status(200).json({
            message: '', success: true, data: {
                doctor: doctor
            }
        })

    } catch (error) {
        console.log(error);
    }

}

export const getAppointmentById = async (req, res) => {

    const { id } = req.query

    try {

        const editAppointment_ = () => {

            return new Promise((resolve, reject) => {
                const editAppointment_sql = "SELECT * FROM appointment WHERE id = ?"
                db.query(editAppointment_sql, [id], (err, result) => {
                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }
                })

            })

        }

        const results = await editAppointment_()


        const appointment = results[0]

        return res.status(200).json({
            message: '', success: true, data: {
                appointment: appointment
            }
        })


    } catch (error) {
        console.log(error);
    }
}

export const updateAppointment = async (req, res) => {

    const { id, appointmentDate, appointmentTime, email, doctorName, appointmentType } = req.body

    console.log(doctorName);


    const formattedDate = new Date(appointmentDate).toISOString().split('T')[0];

    try {

        const editAppointment_ = () => {

            return new Promise((resolve, reject) => {
                const editAppointment_sql = "SELECT * FROM appointment WHERE id = ?"
                db.query(editAppointment_sql, [id], (err, result) => {
                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }
                })

            })

        }

        const results = await editAppointment_()

        if (results.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false })
        }

        const appoint = results

        const updateMyAppointment = () => {
            return new Promise((resolve, reject) => {

                const updateMyAppointmentSql = "UPDATE appointment SET appointmentDate = ?, appointmentTime = ? WHERE id = ?"
                db.query(updateMyAppointmentSql, [formattedDate || appoint[0].appointmentDate, appointmentTime || appoint[0].appointmentTime, id], (err, result) => {
                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }
                })

            })
        }

        const result = await updateMyAppointment()

        if (result.affectedRows === 0) {
            return res.status(200).json({ error: 'No changes made!', success: false })
        }

        // Format date for email
        const formattedDates = new Date(appointmentDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Compose email
        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: 'Your Appointment Has Been Rescheduled',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2196F3;">Appointment Confirmation</h2>
          <p>Your appointment has been successfully rescheduled!</p>
          
          <div style="background-color: #f9f9f9; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0;">
            <p><strong>Doctor:</strong> ${doctorName}</p>
            <p><strong>New Date:</strong> ${formattedDates}</p>
            <p><strong>New Time:</strong> ${appointmentTime}</p>
            <p><strong>Type:</strong> ${appointmentType}</p>
          </div>
          
          <p>If you have any questions or need further changes, please contact our office as soon as possible.</p>
          <p>Thank you for choosing our services!</p>

          <br />
          <p style="font-size: 14px; color: #fff;">Regards,</p>
          <p style="font-size: 14px; color: #fff;">The Clear Vision Clinic Team</p>

        </div>
      `
        };


        //fetch doctor email

        const fetch_doc_email_by_doc_name = () => {
            return new Promise((resolve, reject) => {
                const fetch_doc_email_by_doc_name_Sql = "SELECT doctorEmail FROM doctor WHERE doctorName = ?"
                db.query(fetch_doc_email_by_doc_name_Sql, [doctorName], (err, result) => {
                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }
                })
            })
        }

        const docEmail = await fetch_doc_email_by_doc_name()

        if (!docEmail) {
            return res.status(200).json({ error: 'No information found!', success: false })
        }


        // doctor email
        const doctorMailOptions = {
            from: process.env.USER,
            to: docEmail[0].doctorEmail,
            subject: 'Patient Rescheduled Appointment',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #FF9800;">Appointment Rescheduled</h2>
                  <p>A patient has rescheduled their appointment.</p>
                  
                  <div style="background-color: #f9f9f9; border-left: 4px solid #FF9800; padding: 15px; margin: 20px 0;">
                    <p><strong>Patient Email:</strong> ${email}</p>
                    <p><strong>New Date:</strong> ${formattedDates}</p>
                    <p><strong>New Time:</strong> ${appointmentTime}</p>
                    <p><strong>Type:</strong> ${appointmentType}</p>
                  </div>
                  
                  <p>Please review your updated schedule.</p>

                  <br />
                  <p style="font-size: 14px; color: #555;">Best Regards,</p>
                  <p style="font-size: 14px; color: #555;">The Clear Vision Clinic Team</p>
                </div>
            `
        };

        // Send doctor email
        await transporter.sendMail(doctorMailOptions);


        // Send user email
        await transporter.sendMail(mailOptions);


        return res.status(200).json({
            message: 'Appointment rescheduled successfully!', success: true, data: {

                id: id,
                appointmentDate: formattedDate || appoint[0].appointmentDate,
                appointmentTime: appointmentTime || appoint[0].appointmentTime
            }
        })


    } catch (error) {
        console.log(error);
    }
}

export const getUserInfoByEmail = async (req, res) => {

    const { email } = req.query

    console.log(email);


    try {

        const getUserInfoByEmail_ = () => {
            return new Promise((resolve, reject) => {
                const getUserInfoByEmail_sql = "SELECT * FROM users WHERE email = ?"
                db.query(getUserInfoByEmail_sql, [email], (err, result) => {

                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }

                })
            })
        }

        const results = await getUserInfoByEmail_()

        if (results.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false })
        }

        const userEmail = results[0]

        return res.status(200).json({
            message: '', success: true, data: {

                userEmail: userEmail
            }
        })


    } catch (error) {
        console.log(error);
    }

}

export const getUserInfoById = async (req, res) => {

    const { id } = req.query

    try {

        const getUserInfoById_ = () => {
            return new Promise((resolve, reject) => {
                const getUserInfoById_sql = "SELECT * FROM users WHERE id = ?"
                db.query(getUserInfoById_sql, [id], (err, result) => {
                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }
                })
            })
        }

        const results = await getUserInfoById_()

        if (results.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false })
        }

        const userInfo = results[0]

        return res.status(200).json({
            message: '', success: true, data: {
                userInfo: userInfo
            }
        })


    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', success: false })
    }
}

export const updateUserProfile = async (req, res) => {

    const { id, fullName, lastName, email, telNo, addressLine1, addressLine2, gender, role, dob } = req.body

    try {

        if (!fullName) {
            return res.status(200).json({ error: 'fullname is required!', success: false })
        }

        if (!lastName) {
            return res.status(200).json({ error: 'lastname is required!', success: false })
        }

        if (!email) {
            return res.status(200).json({ error: 'email is required!', success: false })
        }

        if (!telNo) {
            return res.status(200).json({ error: 'telNo is required!', success: false })
        }

        if (!addressLine1) {
            return res.status(200).json({ error: 'addressline 1 is required!', success: false })
        }

        if (!addressLine2) {
            return res.status(200).json({ error: 'addressline 2 is required!', success: false })
        }

        if (!gender) {
            return res.status(200).json({ error: 'gender is required!', success: false })
        }

        if (!role) {
            return res.status(200).json({ error: 'role is required!', success: false })
        }

        if (!dob) {
            return res.status(200).json({ error: 'date of birth is required!', success: false })
        }

        const getUserInfoBtId_ = () => {
            return new Promise((resolve, reject) => {

                const getUserInfoBtId_SQL = "SELECT * FROM users WHERE id = ?"
                db.query(getUserInfoBtId_SQL, [id], (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })

            })
        }

        const userResult = await getUserInfoBtId_()

        if (userResult.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false })
        }

        const userInf = userResult[0]

        const updateUserProfile_ = () => {
            return new Promise((resolve, reject) => {
                const updateUserProfile_sql = "UPDATE users SET fullName = ?, lastName = ?, email = ?, telNo = ?, addressLine1 = ?, addressLine2 = ?, gender = ?, role = ?, dob = ? WHERE id = ?"
                db.query(updateUserProfile_sql, [fullName || userInf[0].fullName, lastName || userInf[0].lastName, email || userInf[0].email, telNo || userInf[0].telNo, addressLine1 || userInf[0].addressLine1, addressLine2 || userInf[0].addressLine2, gender || userInf[0].gender, role || userInf[0].role, dob || userInf[0].dob, id], (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                }

                )
            })
        }

        const results = await updateUserProfile_()

        if (results.affectedRows === 0) {
            return res.status(200).json({ error: 'No changes were made!', success: false })
        }

        return res.status(200).json({
            message: 'updated successfully', success: true, data: {

                id: id,
                fullName: fullName || userInf[0].fullName,
                lastName: lastName || userInf[0].lastName,
                email: email || userInf[0].email,
                telNo: telNo || userInf[0].telNo,
                addressLine1: addressLine1 || userInf[0].addressLine1,
                addressLine2: addressLine2 || userInf[0].addressLine2,
                gender: gender || userInf[0].gender,
                role: role || userInf[0].role,
                dob: dob || userInf[0].dob
            }
        })

    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', success: false })
    }
}


export const getAllAppointments = async (req, res) => {

    try {

        const getAllAppointments_ = () => {

            return new Promise((resolve, reject) => {

                const getAllAppointmentsSql = "SELECT * FROM appointment"
                db.query(getAllAppointmentsSql, (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })

            })

        }

        const results = await getAllAppointments_()


        const appointment = results

        return res.status(200).json({
            message: '', success: true, data: {
                appointment: appointment
            }
        })

    } catch (error) {
        console.log(error);
    }

}


export const getAllAllUsers = async (req, res) => {

    try {

        const getAllUsers_ = () => {

            return new Promise((resolve, reject) => {

                const getAllUsersSql = "SELECT * FROM users"
                db.query(getAllUsersSql, (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })

            })

        }

        const results = await getAllUsers_()


        const users = results

        return res.status(200).json({
            message: '', success: true, data: {
                users: users
            }
        })

    } catch (error) {
        console.log(error);
    }

}


export const updateUserAppointment = async (req, res) => {

    const { id, Status, doctorName, appointmentDate, appointmentTime, appointmentType, fullName, email } = req.body

    console.log(`Hello ${email}`);

    try {

        const editAppointment_ = () => {

            return new Promise((resolve, reject) => {
                const editAppointment_sql = "SELECT * FROM appointment WHERE id = ?"
                db.query(editAppointment_sql, [id], (err, result) => {
                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }
                })

            })

        }

        const results = await editAppointment_()

        if (results.length === 0) {
            return res.status(200).json({ error: 'No information found!', success: false })
        }

        const appoint = results

        const updateMyAppointment = () => {
            return new Promise((resolve, reject) => {

                const updateMyAppointmentSql = "UPDATE appointment SET Status = ? WHERE id = ?"
                db.query(updateMyAppointmentSql, [Status || appoint[0].Status, id], (err, result) => {
                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }
                })

            })
        }

        const result = await updateMyAppointment()

        if (result.affectedRows === 0) {
            return res.status(200).json({ error: 'No changes made!', success: false })
        }

        // Format date for email
        const formattedDates = new Date(appointmentDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Compose email

        // Admin Approval Notification

        //fetch user email

        const fetch_user_email_by_user_name = () => {
            return new Promise((resolve, reject) => {
                const fetch_user_email_by_user_name_Sql = "SELECT email FROM users WHERE fullName = ?"
                db.query(fetch_user_email_by_user_name_Sql, [fullName], (err, result) => {
                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }
                })
            })
        }

        const userEmail = await fetch_user_email_by_user_name()

        if (!userEmail) {
            return res.status(200).json({ error: 'No information found!', success: false })
        }

        const userEm = userEmail[0]


        let userMailOptions, adminMailOptions;

        if (Status === 'Approved') {

            // User Approval Email
            userMailOptions = {
                from: process.env.USER,
                to: userEm.email,
                subject: 'Appointment Approved',
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #4CAF50;">Appointment Approved</h2>
                  <p>Great news! Your appointment has been approved.</p>
                  
                  <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
                    <p><strong>Doctor:</strong> ${doctorName}</p>
                    <p><strong>Date:</strong> ${formattedDates}</p>
                    <p><strong>Time:</strong> ${appointmentTime}</p>
                    <p><strong>Type:</strong> ${appointmentType}</p>
                  </div>
                  
                  <p>We look forward to seeing you!</p>

                    <br />
          <p style="font-size: 14px; color: #fff;">Regards,</p>
          <p style="font-size: 14px; color: #fff;">The Clear Vision Clinic Team</p>


                </div>
                `
            };

            // Admin Approval Notification
            adminMailOptions = {
                from: process.env.USER,
                to: email, // You'll need to set this in your environment variables
                subject: 'Appointment Approved',
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #4CAF50;">Appointment Approved Notification</h2>
                  <p>An appointment has been approved.</p>
                  
                  <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
                    <p><strong>Patient Email:</strong> ${userEm.email}</p>
                    <p><strong>Doctor:</strong> ${doctorName}</p>
                    <p><strong>Date:</strong> ${formattedDates}</p>
                    <p><strong>Time:</strong> ${appointmentTime}</p>
                    <p><strong>Type:</strong> ${appointmentType}</p>
                    
                  </div>
                </div>
                `
            };

        }

        else if (Status === 'Rejected') {

            // User Rejection Email
            userMailOptions = {
                from: process.env.USER,
                to: userEm.email,
                subject: 'Appointment Rejected',
                html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #F44336;">Appointment Rejected</h2>
              <p>We regret to inform you that your appointment has been rejected.</p>
              
              <div style="background-color: #f9f9f9; border-left: 4px solid #F44336; padding: 15px; margin: 20px 0;">
                <p><strong>Doctor:</strong> ${doctorName}</p>
                <p><strong>Date:</strong> ${formattedDates}</p>
                <p><strong>Time:</strong> ${appointmentTime}</p>
                <p><strong>Type:</strong> ${appointmentType}</p>
              </div>
              
              <p>Please contact our office for more information.</p>

                        <br />
          <p style="font-size: 14px; color: #fff;">Regards,</p>
          <p style="font-size: 14px; color: #fff;">The Clear Vision Clinic Team</p>


            </div>
            `
            };

            // Admin Rejection Notification
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
                <p><strong>Doctor:</strong> ${doctorName}</p>
                <p><strong>Date:</strong> ${formattedDates}</p>
                <p><strong>Time:</strong> ${appointmentTime}</p>
                <p><strong>Type:</strong> ${appointmentType}</p>
              </div>
            </div>
            `
            };
        }

        // Send emails if status is Approved or Rejected
        if (Status === 'Approved' || Status === 'Rejected') {
            // Send user email
            await transporter.sendMail(userMailOptions);

            // Send admin email
            await transporter.sendMail(adminMailOptions);
        }


        return res.status(200).json({
            message: 'Appointment status updated successfully!', success: true, data: {

                id: id,
                Status: Status || appoint[0].Status
            }
        })


    } catch (error) {
        console.log(error);
    }
}

export const searchDoc = async (req, res) => {
    try {
        const search = req.query.search || ""; // Get search query
        const query = `
          SELECT * FROM doctor 
          WHERE doctorName LIKE ? 
        `;
        const values = [`%${search}%`]; // Wildcard for partial matching

        // Use async/await with db.promise()
        const [results] = await db.promise().query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ message: "No doctors found" });
        }

        res.json(results); // Return the list of doctors
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const searchAppointment = async (req, res) => {
    try {
        const search = req.query.search || ""; // Get search query
        const query = `
          SELECT * FROM appointment 
          WHERE userName LIKE ? 
        `;
        const values = [`%${search}%`]; // Wildcard for partial matching

        // Use async/await with db.promise()
        const [results] = await db.promise().query(query, values);

        if (results.length === 0) {
            return res.status(404).json({ message: "No users found!" });
        }

        res.json(results); // Return the list of doctors
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Server error" });
    }
};


export const verifyEmail = async (req, res) => {

    const { email } = req.body

    if (!email) {
        return res.status(200).json({ error: 'Email is required!', success: false })
    }

    try {


        const otpGen = genOTP.generate(6, {

            digits: true,
            upperCase: false,
            lowerCase: false,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false

        })

        const hashedOtp = await hashOtp(otpGen)


        /* const user_email = await userModel.findOne({ email })
 
         if (!user_email) {
             return res.status(200).json({ error: 'Please first register email address!', success: false })
         }
 
         */


        const checkEmailExists = () => {

            return new Promise((resolve, reject) => {

                const checkEmailExistsSql = "SELECT * FROM users WHERE email = ?"
                db.query(checkEmailExistsSql, [email], (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })

            })

        }

        const results = await checkEmailExists()

        if (results.length === 0) {
            return res.status(200).json({ error: 'Email address not registered!', success: false })
        }

        const user_email = results[0]


        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'tinisthera@gmail.com',
                pass: 'atubsombqjecgvjm'
            }
        })

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
                    <p style="font-size: 16px; color: #333;">Best regards,<br><strong>Clear Vision Clinic Team</strong></p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions)

        const insertOtp = () => {
            return new Promise((resolve, reject) => {

                const insertOtpSql = "INSERT INTO otp (otp, userEmail) VALUES (?, ?)"
                db.query(insertOtpSql, [hashedOtp, email], (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })

            })
        }

        await insertOtp()

        console.log(hashedOtp);

        return res.status(200).json({
            message: 'OTP sent to your email address!', success: true, data: {
                user_email: user_email
            }
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error!' })
    }


}


export const verifyOtp = async (req, res) => {

    const { otp, email } = req.body

    if (!otp) {
        return res.status(200).json({ error: 'OTP is required!', success: false })
    }

    if (otp.length != 6) {
        return res.status(200).json({ error: 'OTP must be 6 digits!', success: false })
    }

    try {

        //  const otp_ = await otpModel.findOne({ userEmail: email })


        const findEmail = () => {

            return new Promise((resolve, reject) => {

                const findEmailSql = "SELECT * FROM otp WHERE userEmail = ?"
                db.query(findEmailSql, [email], (err, result) => {

                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }

                })

            })

        }

        const results = await findEmail()

        if (results.length === 0) {
            return res.status(200).json({ error: 'Email not found!', success: false })
        }

        const otp_ = results[0]

        const findUserEmail = () => {
            return new Promise((resolve, reject) => {

                const findUserEmailSql = "SELECT * FROM users WHERE email = ?"
                db.query(findUserEmailSql, [email], (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })

            })
        }

        const emailResults = await findUserEmail()

        if (emailResults.length === 0) {
            return res.status(200).json({ error: 'Email not found in users!', success: false })
        }

        //  const user = emailResults[0]

        //  const user = await userModel.findOne({ email: email })

        //  user.isVerified = true

        // await user.save()

        // console.log(`Hello ${otp_}`);


        const userUpdate = () => {

            return new Promise((resolve, reject) => {

                const userUpdateSql = "UPDATE users SET isVerified = ?  WHERE email = ?"
                db.query(userUpdateSql, [1, email], (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })

            })

        }


        const udpateResults = await userUpdate()

        if (udpateResults.affectedRows === 0) {
            return res.status(200).json({ error: 'No changes made!', success: false })
        }


        const isMatch = await compareOtp(otp, otp_.otp)


        if (!isMatch) {
            return res.status(200).json({ error: 'OTP Do Not Match!', success: false })
        }

        // await otpModel.deleteOne({ otp: otp_.otp })

        //

        const otpRemove = () => {
            return new Promise((resolve, reject) => {

                const otpRemoveSql = "DELETE FROM otp WHERE otp = ?"
                db.query(otpRemoveSql, [otp_.otp], (err, result) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(result)
                    }
                })

            })
        }

        const otpResults = await otpRemove()

        if (otpResults.affectedRows === 0) {
            return res.status(200).json({ error: 'No changes made!', success: false })
        }


        return res.status(200).json({
            message: 'OTP Verified!', success: true, data: {
                otp_: otp_
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error!' })
    }

}


export const change_password = async (req, res) => {

    const { password, confirmPassword, email } = req.body


    if (!password || !confirmPassword.length > 6) {
        return res.status(200).json({ error: 'New password is required and must be atleast 6 characters long!', success: false })
    }

    if (!password || !password.length > 6) {
        return res.status(200).json({ error: 'Confirm password is required and must be atleast 6 characters long!!', success: false })
    }


    try {

        //        const user = await userModel.findOne({ email: email })


        const findUserEmaill = () => {
            return new Promise((resolve, reject) => {
                const findUserEmaillSql = "SELECT * FROM users WHERE email = ?"
                db.query(findUserEmaillSql, [email], (err, result) => {

                    if (err) {
                        reject(err)
                    }

                    else {
                        resolve(result)
                    }

                })
            })
        }

        const results = await findUserEmaill()

        if (results.length === 0) {
            return res.status(200).json({ error: 'user not found!', success: false })
        }

        const user = results[0]

        //////////

        if (user.isVerified) {

            if (password === confirmPassword) {

                const hashCurrentPassword = await hashPassword(password)
                const hashNewPassword = await hasConfrimPassword(confirmPassword)

                /*   user.password = hashCurrentPassword || user.password
                   user.confirmPassword = hashNewPassword || user.confirmPassword
   
                   await user.save()
   
                   */

                const updateUserDetaiils = () => {

                    return new Promise((resolve, reject) => {

                        const updateUserDetaiilsSql = "UPDATE users SET password = ?, confirmPassword = ? WHERE email = ?"
                        db.query(updateUserDetaiilsSql, [hashCurrentPassword || user.password, hashNewPassword || user.confirmPassword, email], (err, result) => {

                            if (err) {
                                reject(err)
                            }

                            else {
                                resolve(result)
                            }

                        })

                    })

                }


                const confResults = await updateUserDetaiils()

                if(confResults.affectedRows === 0){
                    return res.status(200).json({error: 'No changes were made!', success: false})
                }


                return res.status(200).json({ message: 'Password changed successfully!', success: true })
            }

            else {
                return res.status(200).json({ error: 'Passwords Do Not Match!', success: false })
            }

        }

        else {
            return res.status(200).json({ error: 'Please verify your OTP sent to your email!', success: false })
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error!' })
    }


}