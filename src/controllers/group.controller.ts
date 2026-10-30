import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../prisma';
import { createGroupSchema, addMemberSchema, createExpenseSchema } from '../schemas/group.schema';
import { calculateGroupBalances } from '../utils/calculator';

export async function createGroupHandler(request: FastifyRequest, reply: FastifyReply) {
  const body = createGroupSchema.parse(request.body);
  const group = await prisma.group.create({ data: body });
  return reply.status(201).send(group);
}

export async function listGroupsHandler(request: FastifyRequest, reply: FastifyReply) {
  const groups = await prisma.group.findMany({
    include: { _count: { select: { members: true, expenses: true } } },
  });
  return reply.send(groups);
}

export async function getGroupDetailsHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      members: true,
      expenses: {
        include: {
          payer: true,
          splits: true,
        },
      },
    },
  });

  if (!group) return reply.status(404).send({ message: 'Grupo não encontrado' });
  return reply.send(group);
}

export async function addMemberHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id: groupId } = request.params as { id: string };
  const body = addMemberSchema.parse(request.body);

  const groupExists = await prisma.group.findUnique({ where: { id: groupId } });
  if (!groupExists) return reply.status(404).send({ message: 'Grupo não encontrado' });

  const member = await prisma.member.create({
    data: { ...body, groupId },
  });

  return reply.status(201).send(member);
}

export async function addExpenseHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id: groupId } = request.params as { id: string };
  const body = createExpenseSchema.parse(request.body);

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: { members: true },
  });

  if (!group) return reply.status(404).send({ message: 'Grupo não encontrado' });

  const payerExists = group.members.some((m) => m.id === body.payerId);
  if (!payerExists) return reply.status(400).send({ message: 'O pagador deve pertencer ao grupo' });

  let splits = body.splits;

  if (!splits || splits.length === 0) {
    const splitAmount = body.amount / group.members.length;
    splits = group.members.map((m) => ({
      memberId: m.id,
      amount: Number(splitAmount.toFixed(2)),
    }));
  } else {
    const totalSplits = splits.reduce((sum, item) => sum + item.amount, 0);
    if (Math.abs(totalSplits - body.amount) > 0.05) {
      return reply.status(400).send({
        message: `A soma das divisões (${totalSplits.toFixed(2)}) difere do valor total da despesa (${body.amount.toFixed(2)})`,
      });
    }
  }

  const expense = await prisma.expense.create({
    data: {
      description: body.description,
      amount: body.amount,
      groupId,
      payerId: body.payerId,
      splits: {
        create: splits.map((s) => ({
          memberId: s.memberId,
          amount: s.amount,
        })),
      },
    },
    include: { splits: true },
  });

  return reply.status(201).send(expense);
}

export async function getGroupBalancesHandler(request: FastifyRequest, reply: FastifyReply) {
  const { id: groupId } = request.params as { id: string };

  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      members: true,
      expenses: {
        include: { splits: true },
      },
    },
  });

  if (!group) return reply.status(404).send({ message: 'Grupo não encontrado' });

  const balanceReport = calculateGroupBalances(group.expenses, group.members);
  return reply.send({
    groupId: group.id,
    groupName: group.name,
    ...balanceReport,
  });
}
