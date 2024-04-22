const { validationResult } = require('express-validator');
const { User } = require('../models/user');
const { Vendor } = require('../models/vendor');
const { EventOrganizer } = require('../models/eventOrganizer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Token } = require('../models/token');
const mailSender = require('../helpers/email_sender');
exports.register = async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.path,
            message: error.msg,
        }));
        return res.status(400).json({ errors: errorMessages });
    }

    // Assuming the decision to create a User or Vendor is based on a 'role' field in the request body.
    const role = req.body.role; // Example role could be 'user' or 'vendor'

    try {
        let entity;
        let passwordHash = await bcrypt.hash(req.body.password, 8);

        if (role === 'user') {
            entity = new User({
                ...req.body,
                passwordHash,
            });
        } else if (role === 'eventOrganizer') {
            entity = new EventOrganizer({
                ...req.body,
                passwordHash,
            });
        } else if (role === 'vendor') {
            entity = new Vendor({
                ...req.body,
                passwordHash,
            });

        } else {
            return res.status(400).json({
                message: 'Invalid role specified',
            });
        }

        entity = await entity.save(); // Saves either User or Vendor to the DB

        // Optionally, remove or modify sensitive information before returning the response.
        // e.g., delete entity.passwordHash;

        return res.status(201).json(entity);
    } catch (error) {
        if (error.message.includes('email_1 dup key')) {
            return res.status(409).json({
                type: 'AuthError',
                message: `${role} with that email already exists`
            });
        }
        return res.status(500).json({ type: error.name, message: error.message });
    }
};

// Other exports remain unchanged
exports.login = async function(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const vendor = await Vendor.findOne({ email });
        const eventOrganizer = await EventOrganizer.findOne({ email });

        if (!user && !vendor && !eventOrganizer) {
            return res.status(404).json({ message: 'User not found. Check your email and try again.' });
        }

        let entity = user || vendor || eventOrganizer;

        if (!bcrypt.compareSync(password, entity.passwordHash)) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        const accessToken = jwt.sign({
            id: entity.id,
            isAdmin: entity.isAdmin,
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });

        const refreshToken = jwt.sign({
            id: entity.id,
            isAdmin: entity.isAdmin,
        }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '60d' });

        const existingToken = await Token.findOne({ userId: entity.id, vendorId: entity.id, eventOrganizerId: entity.id });

        if (existingToken) await existingToken.deleteOne();

        await new Token({
            userId: entity.id,
            vendorId: entity.id,
            eventOrganizerId: entity.id,
            accessToken,
            refreshToken,
        }).save();

        entity.passwordHash = undefined;
        return res.json({
            ...entity._doc,
            accessToken
        });
    } catch (error) {
        return res.status(500).json({ type: error.name, message: error.message });
    }
};

exports.verifyToken = async function(req, res) { //verifyToken passes a token through login in postman in authentication bearer
    try {
        let accessToken = req.header.authorization;
        if (!accessToken) return res.json(false);
        accessToken = accessToken.replace('Barer', '').trim();

        const token = await Token.findOne({ accessToken })
        if (!token) return res.json(false);

        const tokenData = jwt.decode(token.refreshToken);

        const user = await User.findById(tokenData.id)
        if (!user) return res.json(false);

        const vendor = await Vendor.findById(tokenData.id)
        if (!vendor) return res.json(false);

        const eventOrganizer = await EventOrganizer.findById(tokenData.id)
        if (!eventOrganizer) return res.json(false);

        const isValid = jwt.verify(token.refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!isValid) return res.json(false);
        return res.json(true);

    } catch (error) {
        return res.status(500).json({ type: error.name, message: error.message }); //lets the user get into the platform with out needing to login since the token will be stored on the device memory this will save and a the server will check if allow the user if he's using the same device
    }
}
exports.verifyOtpResetPassword = async function(req, res) {

    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        const vendor = await Vendor.findOne({ email });
        const eventOrganizer = await EventOrganizer.findOne({ email });

        if (!user && !vendor && !eventOrganizer) {
            let entityType = '';
            // Assuming the URL contains information about the entity type being accessed
            if (req.url.includes('user')) entityType = 'User';
            else if (req.url.includes('vendor')) entityType = 'Vendor';
            else if (req.url.includes('eventOrganizer')) entityType = 'Event Organizer';
            else entityType = 'Entity';
        }
        const entity = user || vendor || eventOrganizer;
        if (entity.resetPasswordOtp !== +otp || Date.now() > entity.resetPasswordOtpExpires) { // + sign makes otp be an Int

            return res.status(401).json({ message: 'Invalid or expired OTP' })
        }


        entity.resetPasswordOtp = 1;
        entity
            .resetPasswordOtpExpires = undefined;

        await entity.save();
        return res.json({ message: 'OTP confirmed successfully.' })
    } catch (error) {
        return res.status(500).json({ type: error.name, message: error.message }); //lets the user get into the platform with out needing to login since the token will be stored on the device memory this will save and a the server will check if allow the user if he's using the same device
    }
};
exports.resetPassword = async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.path,
            message: error.msg,
        }));
        return res.status(400).json({ errors: errorMessages });
    }
    try {
        const { email, newPassword } = req.body;


        const user = await User.findOne({ email });
        const vendor = await Vendor.findOne({ email });
        const eventOrganizer = await EventOrganizer.findOne({ email });

        const entity = user || vendor || eventOrganizer;

        if (!entity) {
            return res.status(404).json({ message: `${entity} not found` });

        }
        if (entity.resetPasswordOtp !== 1) {
            return res.status(401).json({ message: 'Confirm OTP before resetting password' })
        }

        entity.passwordHash = bcrypt.hashSync(newPassword, 8);
        entity.resetPasswordOtp = undefined;
        await entity.save();

        return res.json({ message: 'Password reset successfully.' })
    } catch (error) {
        return res.status(500).json({ type: error.name, message: error.message }); //lets the user get into the platform with out needing to login since the token will be stored on the device memory this will save and a the server will check if allow the user if he's using the same device
    }
};
exports.forgotPassword = async function(req, res) {
    try {
        const { email } = req.body;

        // Querying all relevant models
        const user = await User.findOne({ email });
        const vendor = await Vendor.findOne({ email });
        const eventOrganizer = await EventOrganizer.findOne({ email });
        // Choosing the first found user type (user, vendor, or event organizer)
        const entity = user || vendor || eventOrganizer;

        // Generating OTP
        const otp = Math.floor(1000 + Math.random() * 9000);
        entity.resetPasswordOtp = otp;
        entity.resetPasswordOtpExpires = Date.now() + 600000; // OTP expires in 10 minutes

        await entity.save();

        // Assuming you have a mail sending function defined
        const response = await mailSender.sendmail(
            email,
            'Password Reset OTP',
            `Your OTP for password reset is: ${otp}`
        );

        return res.json({ message: response });
    } catch (error) {
        return res.status(500).json({ type: error.name, message: error.message });
    }
};