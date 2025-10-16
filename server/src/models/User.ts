import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../interfaces/IUser.js';

const userSchema = new Schema<IUser>({
    name: { type: String, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['admin', 'sales', 'manager'],
        default: 'sales'
    },
    communicationStyle: {
        primary: { type: String, enum: ['direct', 'diplomatic', 'detailed', 'big_picture'], default: 'direct' },
        preferredChannels: { type: String, enum: ['email', 'phone', 'text', 'video', 'in-person'] },
        workingHours: {
            start: { type: String, default: '09:00' },
            end: { type: String, default: '17:00' },
            timezone: { type: String, default: 'UTC' }
        },
        sensoryPreferences: {
            videoCalls: { type: Boolean, default: true },
            backgroundNoise: { type: Boolean, default: false },
            breakFrequency: { type: Number, default: 60 }
        }
    }
}, {
    timestamps: true
});

userSchema.index({ email: 1 });

// Password hashing
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

export const User = model<IUser>('User', userSchema);