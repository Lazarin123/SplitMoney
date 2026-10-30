interface BalanceMap {
  [memberId: string]: number;
}

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export function calculateGroupBalances(expenses: any[], members: any[]) {
  const balances: BalanceMap = {};

  members.forEach((m) => {
    balances[m.id] = 0;
  });

  expenses.forEach((expense) => {
    const payerId = expense.payerId;
    balances[payerId] = (balances[payerId] || 0) + expense.amount;

    expense.splits.forEach((split: any) => {
      balances[split.memberId] = (balances[split.memberId] || 0) - split.amount;
    });
  });

  const debtors: { memberId: string; amount: number }[] = [];
  const creditors: { memberId: string; amount: number }[] = [];

  Object.entries(balances).forEach(([memberId, net]) => {
    const roundedNet = Math.round(net * 100) / 100;
    if (roundedNet < -0.01) {
      debtors.push({ memberId, amount: -roundedNet });
    } else if (roundedNet > 0.01) {
      creditors.push({ memberId, amount: roundedNet });
    }
  });

  const settlements: Settlement[] = [];

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const settledAmount = Math.min(debtor.amount, creditor.amount);

    settlements.push({
      from: debtor.memberId,
      to: creditor.memberId,
      amount: Number(settledAmount.toFixed(2)),
    });

    debtor.amount -= settledAmount;
    creditor.amount -= settledAmount;

    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  const memberMap = new Map(members.map((m) => [m.id, m.name]));

  return {
    netBalances: Object.entries(balances).map(([memberId, netAmount]) => ({
      memberId,
      memberName: memberMap.get(memberId) || 'Desconhecido',
      netAmount: Number(netAmount.toFixed(2)),
    })),
    settlements: settlements.map((s) => ({
      fromId: s.from,
      fromName: memberMap.get(s.from) || 'Desconhecido',
      toId: s.to,
      toName: memberMap.get(s.to) || 'Desconhecido',
      amount: s.amount,
    })),
  };
}
