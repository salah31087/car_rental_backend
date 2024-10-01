import User from '../models/User.js';



export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        // Get the user by ID (from req.user set by the protect middleware)
        const user = await User.findById(req.user.userId).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        // Verify the current password
        const isPasswordValid = await user.matchPassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Set the new password using the custom setPassword method
        await user.setPassword(newPassword);

        // Explicitly mark the password as modified
        user.markModified('password');

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password', error });
    }
};



