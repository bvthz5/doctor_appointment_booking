const { body} = require('express-validator')
const loginValidator = (validationType) => {
    switch (validationType) {
        case 'login':
            return [
                body('email')
                    .trim()
                    .notEmpty()
                    .withMessage({errorCode : 1002 , message : "Email is required"})
                    .isEmail()
                    .withMessage({ errorCode : 1001 , message : "Invalid Email"}),

                body('password')
                    .trim()
                    .notEmpty()
                    .withMessage({errorCode : 1006 , message : "Password is required"})

                
            ]

        case 'accessToken':
            return [
                body('refreshToken')
                    .trim()
                    .notEmpty()
                    .withMessage({errorCode:1010, message : "Refresh token is required"})
            ]

        case 'forgotPassword':
            return[
                body('email')
                    .trim()
                    .notEmpty()
                    .withMessage({errorCode :1002 , message : "Email is required" })
                    .isEmail()
                    .withMessage({errorCode : 1001 , message : "Invalid Email"})
            ]

        case 'resetPassword':
            return[
                body('token')
                    .trim()
                    .notEmpty()
                    .withMessage({errorCode : 1012 , message : "Token is required"}),

                body('password')
                    .trim()
                    .notEmpty()
                    .withMessage({errorCode : 1006 , message : "Password is required"})
                    .isLength({min:6,max:15})
                    .withMessage({errorCode : 1004 , message : "Password length should be in between 6-15 characters"})
                    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
                    .withMessage({errorCode : 1005 , message : "Password must contain atleast one uppercase,lowercase,special character and digit"})
                    
            ]

    }
}

module.exports = { loginValidator }