import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  listLegalDocuments,
  createLegalDocument,
  markVerified,
  deleteLegalDocument,
} from './admin-legal-documents.service';

interface CreateDocumentBody {
  content: string;
  title: string;
  source: string;
  sourceUrl?: string;
  documentType: string;
  jurisdiction?: string;
  version?: string;
}

export async function adminLegalDocumentRoutes(app: FastifyInstance) {
  app.get('/api/admin/legal-documents', async (_req, reply: FastifyReply) => {
    const docs = await listLegalDocuments();
    return reply.send(docs);
  });

  app.post('/api/admin/legal-documents', async (req: FastifyRequest<{ Body: CreateDocumentBody }>, reply: FastifyReply) => {
    const { content, ...meta } = req.body;
    const document = await createLegalDocument(content, meta);
    return reply.status(201).send(document);
  });

  app.patch('/api/admin/legal-documents/:id/verify', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = req.params;
    const document = await markVerified(id);
    return reply.send(document);
  });

  app.delete('/api/admin/legal-documents/:id', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = req.params;
    await deleteLegalDocument(id);
    return reply.status(204).send();
  });
}
