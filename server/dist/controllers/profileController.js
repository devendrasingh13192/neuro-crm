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
            //console.log('abc', req.userId, req.body);
            const profileData = req.body;
            const user = await User.findById(req.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (profileData.role && ['admin', 'sales', 'manager'].includes(profileData.role)) {
                user.role = profileData.role;
            }
            // Update other fields
            if (profileData.name)
                user.name = profileData.name;
            console.log(typeof profileData.communicationStyle.preferredChannels);
            if (profileData.communicationStyle) {
                user.communicationStyle = {
                    ...user.communicationStyle,
                    ...profileData.communicationStyle
                };
            }
            const savedUser = await user.save();
            console.log('saved user', savedUser);
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
            console.log(error);
            return res.status(500).json({ message: 'Error updating profile' });
        }
    }
}
