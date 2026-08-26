import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { listAllCases, updateCaseStatus } from './admin-cases.service';

interface UpdateStatusBody {
  status: string;
}

export async function adminCaseRoutes(app: FastifyInstance) {
  app.get('/api/admin/cases', async (_req, reply: FastifyReply) => {
    const cases = await listAllCases();
    return reply.send(cases);
  });

  app.patch('/api/admin/cases/:id/status', async (req: FastifyRequest<{ Params: { id: string }; Body: UpdateStatusBody }>, reply: FastifyReply) => {
    const { id } = req.params;
    const updated = await updateCaseStatus(id, req.body.status);
    return reply.send(updated);
  });
}
