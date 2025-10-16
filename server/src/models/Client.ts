import { model, Schema } from "mongoose";
import { IClient } from "../interfaces/IClient.js";

const clientSchema = new Schema<IClient>({
    name: { type: String, required: true, trim: true, unique: true },
    company : String,
    email : { type : String, lowercase : true, trim : true, unique : true },
    phone : String,
    assignedTo : { type : Schema.Types.ObjectId, ref : 'User' },
    neuroProfile : {
        communicationStyle : {
            primary : { type : String, enum : ['autistic', 'adhd', 'typical', 'mixed', 'unknown'], default : 'unknown' },
            detailLevel : { type : String, enum : ['high', 'medium', 'low'], default : 'medium' },
            responseTime : { type : String, enum : ['immediate', 'hours', 'days'], default : 'hours' }
        },
        preferences : {
            contactMethods : [{
                method : { type : String, enum : ['email', 'phone', 'text', 'video', 'in-person'], required : true },
                effectiveness : { type : Number, min : 1, max : 10, default : 5 }
            }],
            meetingPreferences : {
                duration : { type : Number, default : 30 },
                agendaRequired : { type : Boolean, default : true },
                cameraOn : { type : Boolean, default : false },
                breakFrequency : { type : Number, default : 45 }
            },
            communicationTips : [String]
        },
        stressTriggers : [String],
        strengths : [String]

    },
    relationshipScore : { type : Number,min : 0, max : 100, default : 50 }, 
    lastInteraction : Date,
    status : { type : String, enum : ['active', 'prospect', 'inactive'], default : 'prospect' }
}, {
    timestamps: true
});

clientSchema.index({assignedTo: 1, status: 1});
clientSchema.index({'neuroProfile.communicationStyle.primary': 1});

export const Client = model<IClient>('Client', clientSchema);

