import mongoose, { type HydratedDocument, type Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// In-memory fallback
let inMemoryUsers: Array<{ _id: number; name: string; email: string; passwordHash?: string }> = [];
let nextId = 1;

export type UserDoc = HydratedDocument<{
  name: string;
  email: string;
  passwordHash?: string;
}>;

export type UserModelType = Model<UserDoc> & {
  findInMemory: () => Promise<typeof inMemoryUsers>;
  findByIdInMemory: (id: string) => Promise<(typeof inMemoryUsers)[number] | null>;
  createInMemory: (data: { name: string; email: string; passwordHash?: string }) => Promise<(typeof inMemoryUsers)[number]>;
  findByIdAndUpdateInMemory: (id: string, update: Partial<{ name: string; email: string }>) => Promise<(typeof inMemoryUsers)[number] | null>;
  findByIdAndDeleteInMemory: (id: string) => Promise<(typeof inMemoryUsers)[number] | null>;
  findOneInMemory: (query: { email?: string }) => Promise<(typeof inMemoryUsers)[number] | null>;
};

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: false, select: false },
  },
  { timestamps: true }
);

const User = mongoose.model<UserDoc, UserModelType>('User', userSchema);

User.findInMemory = () => Promise.resolve(inMemoryUsers);
User.findByIdInMemory = (id) => Promise.resolve(inMemoryUsers.find((u) => String(u._id) === String(id)) || null);
User.findOneInMemory = (query) => {
  if (query.email) {
    return Promise.resolve(inMemoryUsers.find((u) => u.email === query.email) || null);
  }
  return Promise.resolve(null);
};
User.createInMemory = (data) => {
  const user = { _id: nextId++, ...data };
  inMemoryUsers.push(user);
  return Promise.resolve(user);
};
User.findByIdAndUpdateInMemory = (id, update) => {
  const user = inMemoryUsers.find((u) => String(u._id) === String(id));
  if (user) {
    Object.assign(user, update);
    return Promise.resolve(user);
  }
  return Promise.resolve(null);
};
User.findByIdAndDeleteInMemory = (id) => {
  const index = inMemoryUsers.findIndex((u) => String(u._id) === String(id));
  if (index !== -1) {
    const user = inMemoryUsers[index];
    inMemoryUsers.splice(index, 1);
    return Promise.resolve(user);
  }
  return Promise.resolve(null);
};

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export default User;
