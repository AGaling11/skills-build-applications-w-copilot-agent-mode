import mongoose, { Schema } from 'mongoose';

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    points: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
);

export const leaderboard =
  mongoose.models.LeaderboardEntry ||
  mongoose.model('LeaderboardEntry', leaderboardSchema);
export const LeaderboardEntry = leaderboard;
