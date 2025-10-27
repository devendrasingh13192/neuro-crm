import { Request, Response } from "express";
import { Types } from "mongoose";
import { Interaction } from "../models/Interaction.js";
import { IInteractionCreate, IInteractionUpdate } from "../interfaces/IInteraction.js";

export class InteractionController {
    public static async getClientInteractions(req: Request, res: Response): Promise<Response> {
        try {
            const { clientId } = req.params;
            if (!Types.ObjectId.isValid(clientId)) {
                return res.status(404).json({ message: 'Client not found' });
            }
            const interactions = await Interaction.find({ client: clientId })
                .sort({ createdAt: -1 })
                .populate('client', 'name email company')
                .populate('user', 'name email');

            return res.status(200).json(interactions);
        } catch (error: any) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    public static async getInteractionById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            if (!Types.ObjectId.isValid(id)) {
                return res.status(404).json({ message: 'Client not found' });
            }
            const interaction = await Interaction.findById(id)
                .populate('client', 'name email company')
                .populate('user', 'name email');

            if (!interaction) {
                return res.status(404).json({ message: 'interaction not found' });
            }
            return res.status(200).json(interaction);
        } catch (error: any) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    public static async createInteraction(req: Request, res: Response): Promise<Response> {
        try {
            const interactionData: IInteractionCreate = req.body;
            const requiredFields = ['client', 'user', 'type', 'summary', 'duration', 'sentiment', 'effectiveness', 'clientEngagement'];
            for (const field of requiredFields) {
                if (!interactionData[field as keyof IInteractionCreate]) {
                    return res.status(400).json({ message: `${field} is required` });
                }
            }
            if (!Types.ObjectId.isValid(interactionData.client.toString()) ||
                !Types.ObjectId.isValid(interactionData.user.toString())) {
                return res.status(400).json({ message: 'Invalid client or user ID format' });
            }
            const interaction = new Interaction(interactionData);
            const savedInteraction = await interaction.save();

            await savedInteraction.populate('client', 'name email company');
            await savedInteraction.populate('user', 'name email');
            return res.status(201).json(savedInteraction);
        } catch (error: any) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    public static async updateInteraction(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const updateData: IInteractionUpdate = req.body;
            if (!Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid interaction ID format' });
            }
            const interaction = await Interaction.findByIdAndUpdate(
                id,
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            )
                .populate('client', 'name email company')
                .populate('user', 'name email');
            if (!interaction) {
                return res.status(404).json({ message: 'Interaction not found' });
            }
            return res.status(200).json(interaction);

        } catch (error : any) {
            return res.status(500).json({ message: 'Server error', error: error.message });
        }
    }

    public static async deleteInteraction(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({message: 'Invalid interaction ID format'});
      }

      const interaction = await Interaction.findByIdAndDelete(id);

      if (!interaction) {
        return res.status(404).json({message: 'Interaction not found'});
      }

      return res.status(200).json({message: 'Interaction deleted successfully'});
    } catch (error : any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}