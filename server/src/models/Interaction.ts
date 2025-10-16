import { model, Schema } from "mongoose";
import { IInteraction } from "../interfaces/IInteraction.js";

const interactionSchema = new Schema<IInteraction>({
    client : { type : Schema.Types.ObjectId, ref : 'Client', required : true },
    user : { type : Schema.Types.ObjectId, ref : 'User', required : true },
    type : { type : String, enum : ['email', 'phone', 'video', 'in-person', 'text'], required : true },
    summary : String,
    duration : Number,
    sentiment : { type : Number, min : -1, max : 1 },
    effectiveness : { type : Number, min : 1, max : 5 },
    clientEngagement : { type : Number, min : 1, max : 5 },
    followUpRequired : { type : Boolean, default : false },
    preferredAspects : [String],
    improvementAreas : [String]
}, {
    timestamps: true
});

interactionSchema.index({client: 1, createdAt: -1});
interactionSchema.index({user: 1, createdAt: -1});

export const Interaction = model<IInteraction>('Interaction', interactionSchema);