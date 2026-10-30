import { FastifyInstance } from 'fastify';
import {
  createGroupHandler,
  listGroupsHandler,
  getGroupDetailsHandler,
  addMemberHandler,
  addExpenseHandler,
  getGroupBalancesHandler,
} from '../controllers/group.controller';

export async function groupRoutes(app: FastifyInstance) {
  app.post('/groups', createGroupHandler);
  app.get('/groups', listGroupsHandler);
  app.get('/groups/:id', getGroupDetailsHandler);
  app.post('/groups/:id/members', addMemberHandler);
  app.post('/groups/:id/expenses', addExpenseHandler);
  app.get('/groups/:id/balances', getGroupBalancesHandler);
}
