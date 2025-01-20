import { Elysia, t } from 'elysia';
import { UserService } from '../services/userService';

export class UserHandler {
    constructor(private userService: UserService) {}

    registerRoutes(app: Elysia) {
        return app
            .post('/users', 
                async ({ body }) => {
                    const { username, email, password } = body;
                    return await this.userService.createUser(username, email, password);
                }, {
                    body: t.Object({
                        username: t.String(),
                        email: t.String(),
                        password: t.String()
                    })
                }
            )
            .get('/users/:id', 
                async ({ params: { id } }) => {
                    return await this.userService.getUserById(id);
                }
            )
            .patch('/users/:id', 
                async ({ params: { id }, body }) => {
                    return await this.userService.updateUser(id, body);
                }, {
                    body: t.Object({
                        username: t.Optional(t.String()),
                        email: t.Optional(t.String()),
                        password: t.Optional(t.String())
                    })
                }
            )
            .delete('/users/:id', 
                async ({ params: { id } }) => {
                    await this.userService.deleteUser(id);
                    return null;
                }
            );
    }
}
