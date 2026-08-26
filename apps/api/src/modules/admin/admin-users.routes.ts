import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { listUsers, updateUserRole, deleteUser } from './admin-users.service';

interface UpdateRoleBody {
  role: string;
}

export async function adminUserRoutes(app: FastifyInstance) {
  app.get('/api/admin/users', async (_req, reply: FastifyReply) => {
    const users = await listUsers();
    return reply.send(users);
  });

  app.patch('/api/admin/users/:id/role', async (req: FastifyRequest<{ Params: { id: string }; Body: UpdateRoleBody }>, reply: FastifyReply) => {
    const { id } = req.params;
    const user = await updateUserRole(id, req.body.role);
    return reply.send(user);
  });

  app.delete('/api/admin/users/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = req.params;
    await deleteUser(id);
    return reply.status(204).send();
  });
}
