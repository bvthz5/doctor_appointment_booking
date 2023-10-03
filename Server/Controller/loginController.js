const jwt = require('jsonwebtoken');
const {sendResetPasswordEmail} = require('../Util/mail')
const bcrypt = require('bcrypt')
const logger = require("../logger");
const tokenGeneration = require('../Util/auth')


const doctorService = require('../Service/doctorService');


/**
 * Generate a new access token using a valid refresh token.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const accessToken = async (req, res,next) => {


    try {
        const decodedRefreshToken = verifyToken(req.body.refreshToken, process.env.REFRESH_TOKEN_KEY)

        //check if the user with the email exists or not
        await doctorService.doctorLogin(decodedRefreshToken.payload)
        
        if (decodedRefreshToken.isValid) {

            const { accessTokenSign , refreshTokenSign } = await tokenGeneration.generateTokenValues(decodedRefreshToken.payload)

            res.send({ "accessToken": accessTokenSign, "refreshToken": refreshTokenSign })
        } else {
            res.status(401).send({ errorCode: 1907, message: "Authorization token expired" })
        }

    } catch (err) {
        logger.error(`Error occurred: ${err.message}`);
        next(err)

    }

}


/**
 * Initiates the process of resetting a user's password.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
const forgotPassword = async (req, res,next) => {


    try {

        //check if the user exists or not
        const user = await doctorService.doctorLogin(req.body)
        const token = jwt.sign({ email: user.dataValues.email }, process.env.ACCESS_TOKEN_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
        try{
            //function to send the reset password link
            sendResetPasswordEmail(user.dataValues.email, token,"Reset password")
            res.send({ message: "success" })

        }catch(emailError){
            logger.error(`Error occurred: ${emailError}`);
            res.status(500).send({ errorCode: 1905, message: "Email sending failed" })
        }
        

    } catch (err) {
        logger.error(`Error occurred: ${err.message}`);
        next(err)
    }

}

/**
 * Resets the user's password after verifying the token.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
const resetPassword = async (req, res,next) => {


    try {

        const verificationResult = verifyToken(req.body.token, process.env.ACCESS_TOKEN_KEY)
        if (verificationResult.isValid) {

            //check if user exists or not
            await doctorService.doctorLogin(verificationResult.payload)
           
            let hashPassword = await bcrypt.hash(req.body.password, 10);

            //change the password with new password
            await doctorService.resetPassword(verificationResult.payload.email, hashPassword)
            res.send({ message: "Password changed successfully" })


        } else {
            res.status(401).send({ errorCode: 1907, message: "Authorization token expired" })
        }

    } catch (err) {
        logger.error(`Error occurred: ${err.message}`);
        next(err)
    }

}


/**
 * Verify a JWT token using the provided secret key.
 *
 * @function
 * @param {string} token - The JWT token to verify.
 * @param {string} secret - The secret key used for verification.
 * @returns {Object} - An object indicating whether the token is valid and the payload if valid.
 */
function verifyToken(token, secret) {
    try {
        const decoded = jwt.verify(token, secret);
        return {
            isValid: true,
            payload: decoded
        };
    } catch (err) {
        return {
            isValid: false,
            error: err.message
        };
    }
}




module.exports = {
    accessToken,
    forgotPassword,
    resetPassword
}