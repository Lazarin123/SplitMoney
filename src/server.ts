import Fastify from 'fastify';
import dotenv from 'dotenv';
import { groupRoutes } from './routes/group.routes';

dotenv.config();

const app = Fastify({ logger: true });

app.get('/health', async () => {
  return { status: 'OK', service: 'SplitMoney API', version: '1.0.0' };
});

app.register(groupRoutes, { prefix: '/api' });

const PORT = Number(process.env.PORT) || 3333;

const start = async () => {
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🚀 SplitMoney API rodando na porta ${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
