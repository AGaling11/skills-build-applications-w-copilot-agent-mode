import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true, select: false },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_document, record) => {
        const { passwordHash: _passwordHash, ...publicRecord } = record;
        return publicRecord;
      },
    },
  },
);

export const user = mongoose.models.User || mongoose.model('User', userSchema);
export const User = user;
