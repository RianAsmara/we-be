import { User, UserRepository } from '../domain/user';
import { v4 as uuidv4 } from 'uuid';

// This is a simple in-memory implementation. In a real app, you'd use a database
export class InMemoryUserRepository implements UserRepository {
    private users: Map<string, User> = new Map();

    async findById(id: string): Promise<User | null> {
        return this.users.get(id) || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        for (const user of this.users.values()) {
            if (user.email === email) {
                return user;
            }
        }
        return null;
    }

    async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
        const now = new Date();
        const user: User = {
            ...userData,
            id: uuidv4(),
            createdAt: now,
            updatedAt: now,
        };
        this.users.set(user.id, user);
        return user;
    }

    async update(id: string, userData: Partial<User>): Promise<User> {
        const existingUser = await this.findById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }

        const updatedUser: User = {
            ...existingUser,
            ...userData,
            id,
            updatedAt: new Date(),
        };
        this.users.set(id, updatedUser);
        return updatedUser;
    }

    async delete(id: string): Promise<void> {
        this.users.delete(id);
    }
}
