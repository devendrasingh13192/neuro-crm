import { Request, Response } from "express";
import { Client } from "../models/Client.js";
import { Interaction } from "../models/Interaction.js";
import { DashboardStats, IDashboardData, RecentActivity } from "../interfaces/IDashboard.js";

interface AuthRequest extends Request {
    userId?: string
}

export class DashboardController {
    static async getDashboardData(req: AuthRequest, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const clients = await Client.find({ assignedTo: userId });
            const totalClients = clients.length;
            const activeClients = clients.filter(c => c.status === 'active').length;
            const prospectClients = clients.filter(c => c.status === 'prospect').length;
            const averageRelationshipScore = clients.length > 0 ? clients.reduce((sum, c) => sum + (c.relationshipScore || 0), 0) / clients.length : 0;
            const neurodiversityDistribution = {
                autistic: clients.filter(c => c.neuroProfile.communicationStyle.primary === 'autistic').length,
                adhd: clients.filter(c => c.neuroProfile.communicationStyle.primary === 'adhd').length,
                typical: clients.filter(c => c.neuroProfile.communicationStyle.primary === 'typical').length,
                mixed: clients.filter(c => c.neuroProfile.communicationStyle.primary === 'mixed').length,
                unknown: clients.filter(c => c.neuroProfile.communicationStyle.primary === 'unknown').length,
            }

            const recentInteractions = await Interaction.find({ user: userId })
                .populate('client', 'name')
                .sort({ createdAt: -1 })
                .limit(5);

            const recentActivities : RecentActivity[] = recentInteractions.map(interaction => ({
                _id: interaction._id.toString(),
                clientName: (interaction.client as any).name,
                clientId: interaction.client.toString(),
                type:  interaction.type,
                summary : interaction.summary || `${interaction.type} interaction`,
                date : interaction.createdAt
            }));

            const stats : DashboardStats = {
                totalClients,
                activeClients,
                prospectClients,
                averageRelationshipScore : Math.round(averageRelationshipScore),
                neurodiversityDistribution
            }

            const dashboardData : IDashboardData = {
                stats,
                recentActivities,
                upcomingInteractions : []
            }

            return res.status(200).json(dashboardData);
        } catch (error: any) {
            return res.status(500).json({ message: 'Error fetching dashboard data' });
        }
    }
}