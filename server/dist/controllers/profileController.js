import { User } from '../models/User.js';
export class ProfileController {
    static async getProfile(req, res) {
        try {
            const user = await User.findById(req.userId).select('-password');
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            const profile = {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                communicationStyle: user.communicationStyle,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
            return res.status(200).json(profile);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error fetching profile' });
        }
    }
    static async updateProfile(req, res) {
        try {
            const profileData = req.body;
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user.communicationStyle = {
                ...user.communicationStyle,
                ...profileData.communicationStyle
            };
            await user.save();
            const updatedProfile = {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                communicationStyle: user.communicationStyle,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
            return res.status(200).json(updatedProfile);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error updating profile' });
        }
    }
}
