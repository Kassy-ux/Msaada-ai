import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  listProviders,
  createProvider,
  verifyProvider,
  deleteProvider,
} from './admin-providers.service';

interface CreateProviderBody {
  name: string;
  organization?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  categories?: string[];
}

interface VerifyBody {
  verified: boolean;
}

export async function adminProviderRoutes(app: FastifyInstance) {
  app.get('/api/admin/providers', async (_req, reply: FastifyReply) => {
    const providers = await listProviders();
    return reply.send(providers);
  });

  app.post('/api/admin/providers', async (req: FastifyRequest<{ Body: CreateProviderBody }>, reply: FastifyReply) => {
    const provider = await createProvider(req.body);
    return reply.status(201).send(provider);
  });

  app.patch('/api/admin/providers/:id/verify', async (req: FastifyRequest<{ Params: { id: string }; Body: VerifyBody }>, reply: FastifyReply) => {
    const { id } = req.params;
    const provider = await verifyProvider(id, req.body.verified);
    return reply.send(provider);
  });

  app.delete('/api/admin/providers/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = req.params;
    await deleteProvider(id);
    return reply.status(204).send();
  });
}
