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
                createdAt: user.createdAt
            };
            return res.status(200).json(profile);
        }
        catch (error) {
            return res.status(500).json({ message: 'Error fetching profile' });
        }
    }
}
