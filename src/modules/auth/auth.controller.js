const jwt = require('jsonwebtoken');
const { createUser, verifyUser, checkIfUserExists } = require('../../service/user-service');
const { hashPassword, generateVerificationToken } = require('../auth/auth.service');
const sendEmail = require("../../utils/send-email");
const bcrypt = require('bcrypt');
const User = require('../../model/user');
const Token = require('../../model/token');
const { updateUserById } = require('../../service/user-service');
exports.signup = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Check if the user already exists
        const existingUser = await checkIfUserExists(email);
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Create user and generate token
        const { newUser, token } = await createUser({ name, email, password, phone, role });
        const baseUrl = process.env.BASE_URL ? `${process.env.BASE_URL}/api/v1/auth` : '/api/v1/auth';
        const verificationUrl = `${baseUrl}/user/${newUser._id}/verify/${token}`;
        await sendEmail(newUser.email, "Verify Email", verificationUrl);

        // Respond with success
        return res.status(200).json({
            message: "An email has been sent to your account. Please verify.",
            log: newUser,
            token,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error. Please try again later.',
            error: error.message || error,
        });
    }
};

exports.verifyToken = async (req, res) => {
    try {
        const { token } = req.params; 

        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        // Decode the token in the controller
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Pass the decoded user ID to the service
        const user = await verifyUser(decoded.id);

        if (!user.verified) {
            return res.status(500).json({ message: 'Verification update failed' });
        }

        return res.status(200).json({
            message: 'User successfully verified',
            user: { id: user.id, email: user.email },
        });
    } catch (error) {
        console.error('Verification error:', error.message);

        if (error.message.includes('User not found')) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        return res.status(500).json({
            message: 'Internal Server Error. Please try again later.',
            error: error.message || error,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await checkIfUserExists(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        if (!user.verified) {
            let token = await Token.findOne({ userId: user._id });
            if (!token) {
                token = await generateVerificationToken(user._id);
                const url =  `${process.env.BASE_URL}/api/v1/auth/user/${user._id}/verify/${token}`;
                // Only send the email once when the user is not verified
                await sendEmail(user.email, "Verify Email", url);
                return res.status(400).json({ message: "An email has been sent to your account. Please verify." });
            }
            // If token already exists, no need to send another email
            return res.status(400).json({ message: "An email has already been sent. Please verify your account." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Email or Password" });
        }

        // Generate JWT token for login
        const jwtToken = jwt.sign(
            { id: user._id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: "User login successful",
            token: jwtToken, // Send the JWT token for authentication
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error. Please try again later.',
            error: error.message || error,
        });
    }
};

exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        // Check if the provided email and password match admin credentials
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Generate a JWT token for admin
            const token = jwt.sign(
                { username: 'admin', role: 'administrator' }, // Payload
                process.env.JWT_SECRET, // Secret
                { expiresIn: '1h' } // Token expiry
            );

            return res.status(200).json({
                message: "Admin login successful.",
                token: token, // Send the JWT token
            });
        } else {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }
    } catch (error) {
        console.error("Admin login error:", error);
        return res.status(500).json({
            message: "Internal Server Error. Please try again later."
        });
    }
};


exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);

    }
    catch (error) {
        return res.status(401).json({
            message: "Internal Server Error. Please try again later"
        })
    }
}
exports.getLoginUsers = async (req, res) => {
    try {
        const loginUser = await User.find({});
        if (!loginUser.length) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json(loginUser);
    } catch (error) {
        console.error("Error fetching users: ", error);
        return res.status(500).json({
            message: "Internal Server Error. Please try again later",
            error: error.message || error,
        });
    }
};

exports.deleteRider = async (req, res) => {
    try {
        const riderId = req.params.id;
        const result = await User.findOneAndDelete({ _id: riderId, role: "rider" });

        if (!result) {
            return res.status(404).json({
                message: "Rider not found or invalid role."
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Rider deleted successfully",
            rider: result,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error. Please try again later.",
            error: error.message,
        });
    }
};
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;

        // Ensure the user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        // Authorization: Only admin or the user themselves can update
        if (req.user.role !== 'administrator' && req.user.id !== userId) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }

        // Call the service to update the user
        const updatedUser = await updateUserById(userId, updates);

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            message: 'User updated successfully.',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            message: 'Internal Server Error. Please try again later.',
        });
    }
};

