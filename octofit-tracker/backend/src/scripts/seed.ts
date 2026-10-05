import { randomBytes, scryptSync } from 'node:crypto';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models/index.js';

/**
 * Seed the octofit_db database with test data.
 * The upserts make this safe to run repeatedly without duplicating sample records.
 */
async function seedDatabase() {
  try {
    await connectDatabase();

    const members = [
      { name: 'Alex Morgan', email: 'alex.morgan@example.test' },
      { name: 'Jordan Lee', email: 'jordan.lee@example.test' },
      { name: 'Sam Rivera', email: 'sam.rivera@example.test' },
      { name: 'Taylor Kim', email: 'taylor.kim@example.test' },
      { name: 'Casey Patel', email: 'casey.patel@example.test' },
      { name: 'Riley Chen', email: 'riley.chen@example.test' },
    ];

    const users = await Promise.all(
      members.map(async (member) => {
        const salt = randomBytes(16);
        const passwordHash = `${salt.toString('hex')}:${scryptSync(randomBytes(32), salt, 64).toString('hex')}`;
        return User.findOneAndUpdate(
          { email: member.email },
          { $setOnInsert: { ...member, passwordHash } },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );
      }),
    );

    const teamDefinitions = [
      { name: 'Trail Blazers', memberIndexes: [0, 1, 2] },
      { name: 'Peak Performers', memberIndexes: [3, 4, 5] },
    ];

    for (const definition of teamDefinitions) {
      const teamMembers = definition.memberIndexes.map((index) => users[index]!);
      const team = await Team.findOneAndUpdate(
        { name: definition.name },
        { $set: { members: teamMembers.map((user) => user._id) } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      await User.updateMany(
        { _id: { $in: teamMembers.map((user) => user._id) } },
        { $set: { team: team._id } },
      );
    }

    const activityDefinitions = [
      { userIndex: 0, type: 'Running', durationMinutes: 30, points: 30 },
      { userIndex: 1, type: 'Walking', durationMinutes: 45, points: 20 },
      { userIndex: 2, type: 'Strength training', durationMinutes: 40, points: 35 },
      { userIndex: 3, type: 'Cycling', durationMinutes: 50, points: 40 },
      { userIndex: 4, type: 'Running', durationMinutes: 25, points: 25 },
      { userIndex: 5, type: 'Yoga', durationMinutes: 35, points: 20 },
    ];
    const completedAt = new Date('2026-10-01T12:00:00.000Z');

    for (const [index, activity] of activityDefinitions.entries()) {
      const user = users[activity.userIndex]!;
      await Activity.findOneAndUpdate(
        { user: user._id, type: activity.type, completedAt },
        {
          $set: {
            user: user._id,
            type: activity.type,
            durationMinutes: activity.durationMinutes,
            points: activity.points,
            completedAt,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      await LeaderboardEntry.findOneAndUpdate(
        { user: user._id },
        { $set: { points: activity.points + index * 5 } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    const workouts = [
      {
        title: 'Beginner Interval Run',
        description: 'Alternate easy jogging and walking to build endurance.',
        activityType: 'Running',
        durationMinutes: 25,
        difficulty: 'beginner',
      },
      {
        title: 'Bodyweight Strength Circuit',
        description: 'Complete a balanced circuit of squats, push-ups, and planks.',
        activityType: 'Strength training',
        durationMinutes: 30,
        difficulty: 'intermediate',
      },
      {
        title: 'Recovery Flow',
        description: 'Use gentle mobility poses and breathing to recover after training.',
        activityType: 'Yoga',
        durationMinutes: 20,
        difficulty: 'beginner',
      },
      {
        title: 'Steady-State Cycling',
        description: 'Ride at a steady, conversational pace to improve aerobic fitness.',
        activityType: 'Cycling',
        durationMinutes: 40,
        difficulty: 'intermediate',
      },
      {
        title: 'Advanced Tempo Run',
        description: 'Combine a warm-up with sustained tempo intervals and a cool-down.',
        activityType: 'Running',
        durationMinutes: 45,
        difficulty: 'advanced',
      },
    ];

    for (const workout of workouts) {
      await Workout.findOneAndUpdate(
        { title: workout.title },
        { $set: workout },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    const counts = await Promise.all([
      User.countDocuments(),
      Team.countDocuments(),
      Activity.countDocuments(),
      LeaderboardEntry.countDocuments(),
      Workout.countDocuments(),
    ]);
    console.log(
      `Database seeding complete: ${counts[0]} users, ${counts[1]} teams, ${counts[2]} activities, ${counts[3]} leaderboard entries, ${counts[4]} workouts.`,
    );
  } catch (error) {
    console.error('Error seeding octofit_db:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
