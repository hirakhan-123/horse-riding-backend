const User = require('../model/user'); 
const Token = require('../model/token'); 
const { hashPassword ,generateVerificationToken} = require('../modules/auth/auth.service');
const sendEmail = require("../utils/send-email");

exports.createUser = async (userData) => {
    try {
        const hashedPassword = await hashPassword(userData.password);

        // Check for potential errors in hashing
        if (!hashedPassword) {
            throw new Error('Failed to hash password');
        }

        // Try creating the user
        const newUser = await User.create({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            phone: userData.phone,
            role: userData.role,
        });

        // Check if the user was created successfully
        if (!newUser) {
            throw new Error('User creation failed');
        }

        // Generate a verification token
        const token = await generateVerificationToken(newUser._id);
        if (!token) {
            throw new Error('Failed to generate verification token');
        }

        return { newUser, token };
    } catch (error) {
        console.error("Error in createUser function:", error.message || error);
        throw new Error(`Error creating user: ${error.message}`);
    }
};

exports.verifyUser = async (userId) => {
    try {
        const user = await User.findById(userId); // Find user by ID
        if (!user) {
            throw new Error('User not found');
        }

        user.verified = true; // Update the 'verified' field

        const savedUser = await user.save(); // Save the user

        return savedUser; // Return the saved user
    } catch (error) {
        throw new Error(`Verification failed: ${error.message}`);
    }
};


exports.checkIfUserExists = async (email) => {
    try {
        return await User.findOne({ email });  // Correct usage of 'Login'
    } catch (error) {
        console.error("Error in checkIfUserExists: ", error.message || error); // Log the error
        throw new Error('Error checking user existence');
    }
};
exports.updateUserById = async (userId, updateData) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData }, // Dynamically update fields
            { new: true, runValidators: true } // Return the updated document
        );
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error.message);
        throw new Error('Error updating user');
    }
};
exports.updateUserById = async (userId, updates) => {
    try {
        // Find the user by ID and update
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true } // Return the updated user
        );

        return updatedUser;
    } catch (error) {
        console.error('Error in updateUserById service:', error);
        throw error;
    }
};

