import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { addEvidence, getEvidenceForCase, deleteEvidence } from './evidence.service';

export async function evidenceRoutes(app: FastifyInstance) {
  // Upload evidence for a case
  app.post('/api/cases/:id/evidence', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id: caseId } = req.params;

    const data = await req.file();
    if (!data) {
      return reply.status(400).send({ error: 'No file uploaded' });
    }

    const buffer = await data.toBuffer();
    const description = (data.fields.description as any)?.value as string | undefined;

    const evidence = await addEvidence(caseId, buffer, description);
    return reply.status(201).send(evidence);
  });

  // List evidence for a case
  app.get('/api/cases/:id/evidence', async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id: caseId } = req.params;
    const evidence = await getEvidenceForCase(caseId);
    return reply.send(evidence);
  });

  // Delete a piece of evidence
  app.delete('/api/evidence/:evidenceId', async (req: FastifyRequest<{ Params: { evidenceId: string } }>, reply: FastifyReply) => {
    const { evidenceId } = req.params;
    await deleteEvidence(evidenceId);
    return reply.status(204).send();
  });
}
