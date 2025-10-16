import { Client } from "../models/Client.js";
export class ClientController {
    static async getClients(req, res) {
        try {
            // Example: Fetch clients from database
            const clients = await Client.find({ assignedTo: req.userId })
                .populate('assignedTo', 'name email')
                .sort({ createdAt: -1 });
            return res.status(200).json(clients);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
    static async getClientById(req, res) {
        try {
            const clientId = req.params.id;
            const client = await Client.findById(clientId).populate('assignedTo', 'name email');
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            return res.status(200).json(client);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
    static async createClient(req, res) {
        try {
            const clientData = {
                ...req.body,
                assignedTo: req.userId
            };
            const newClient = new Client(clientData);
            await newClient.save();
            await newClient.populate('assignedTo', 'name email');
            return res.status(201).json(newClient);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
    static async updateClient(req, res) {
        try {
            const { id } = req.params;
            const profileData = req.body;
            const client = await Client.findOne({ _id: id, assignedTo: req.userId });
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            client.neuroProfile = { ...client.neuroProfile, ...profileData };
            await client.save();
            await client.populate('assignedTo', 'name email');
            return res.status(200).json(client);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
    static async getRecommendations(req, res) {
        try {
            const { id } = req.params;
            const client = await Client.findOne({ _id: id, assignedTo: req.userId });
            if (!client) {
                return res.status(404).json({ message: 'Client not found' });
            }
            const recommendations = this.generateRecommendations(client.neuroProfile);
            return res.status(200).json(recommendations);
        }
        catch (error) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
    static generateRecommendations(neuroProfile) {
        const recommendations = [];
        const { communicationStyle, preferences } = neuroProfile;
        switch (communicationStyle.primary) {
            case 'autistic':
                recommendations.push('Provide detailed agendas before meetings', 'Use clear, literal language - avoid sarcasm', 'Allow processing time for responses', 'Send follow-up summaries in writing', 'Be consistent with communication patterns');
                break;
            case 'adhd':
                recommendations.push('Keep communications concise and engaging', 'Use visual aids and summaries', 'Schedule shorter, more frequent check-ins', 'Provide clear deadlines and reminders', 'Use bullet points instead of long paragraphs');
                break;
            case 'typical':
                recommendations.push('Balance detail with big-picture overview', 'Mix communication methods based on context', 'Maintain regular but flexible contact schedule');
                break;
            case 'mixed':
                recommendations.push('Offer multiple communication options', 'Check in regularly about preferred methods', 'Be adaptable to changing preferences');
                break;
        }
        if (communicationStyle.detailLevel === 'high') {
            recommendations.push('Provide comprehensive documentation and data');
        }
        else if (communicationStyle.detailLevel === 'low') {
            recommendations.push('Focus on key takeaways and executive summaries');
        }
        const bestMethod = preferences.contactMethods.sort((a, b) => b.effectiveness - a.effectiveness)[0];
        if (bestMethod) {
            recommendations.push(`Primary contact method ${bestMethod.method.toUpperCase()} (effectiveness: ${bestMethod.effectiveness}/10)`);
        }
        return recommendations;
    }
}
