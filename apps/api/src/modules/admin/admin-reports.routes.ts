import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { listReports, updateReportStatus } from './admin-reports.service';

interface UpdateReportStatusBody {
  status: string;
}

export async function adminReportRoutes(app: FastifyInstance) {
  app.get('/api/admin/reports', async (_req, reply: FastifyReply) => {
    const reports = await listReports();
    return reply.send(reports);
  });

  app.patch('/api/admin/reports/:id/status', async (req: FastifyRequest<{ Params: { id: string }; Body: UpdateReportStatusBody }>, reply: FastifyReply) => {
    const { id } = req.params;
    const updated = await updateReportStatus(id, req.body.status);
    return reply.send(updated);
  });
}
