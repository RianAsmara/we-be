import { User, UserRepository } from '../domain/user';
import bcrypt from 'bcrypt';

export class UserService {
    constructor(private userRepository: UserRepository) {}

    async createUser(username: string, email: string, password: string): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        return this.userRepository.create({
            username,
            email,
            password: hashedPassword,
        });
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async updateUser(id: string, userData: Partial<User>): Promise<User> {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }
        return this.userRepository.update(id, userData);
    }

    async deleteUser(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }

    async validatePassword(email: string, password: string): Promise<boolean> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return false;
        }
        return bcrypt.compare(password, user.password);
    }
}
