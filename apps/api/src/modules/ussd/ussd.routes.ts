import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { handleUssdSession } from './ussd.service';

interface UssdBody {
  sessionId: string;
  serviceCode: string;
  phoneNumber: string;
  text: string;
}

export async function ussdRoutes(app: FastifyInstance) {
  app.post('/api/ussd', async (req: FastifyRequest<{ Body: UssdBody }>, reply: FastifyReply) => {
    const { sessionId, phoneNumber, text } = req.body;

    const response = await handleUssdSession({
      sessionId,
      phoneNumber,
      text: text || '',
    });

    // Africa's Talking requires this exact content type and plain-text body
    reply.header('Content-Type', 'text/plain');
    return reply.send(response);
  });
}
