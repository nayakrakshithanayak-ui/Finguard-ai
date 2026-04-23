const normalizeComparableTransaction = (transaction) => ({
  ...transaction,
  amount: Number(transaction.amount) || 0,
  date: transaction.date ? new Date(transaction.date) : null
});

export const getFraudReason = (transaction, transactions) => {
  const normalizedTransaction = normalizeComparableTransaction(transaction);
  const normalizedTransactions = transactions.map(normalizeComparableTransaction);

  if (normalizedTransaction.amount > 10000) return "High Amount";

  const sameCategoryCount = normalizedTransactions.filter(
    (candidate) => candidate.category === normalizedTransaction.category
  ).length;
  if (sameCategoryCount > 3) return "Repeated Category";

  const avg =
    normalizedTransactions.reduce((sum, candidate) => sum + candidate.amount, 0) /
    (normalizedTransactions.length || 1);
  if (normalizedTransaction.amount > avg * 3) return "Unusual Spike";

  return null;
};

export const annotateTransactions = (transactions) =>
  transactions.map((transaction) => {
    const fraudReason = getFraudReason(transaction, transactions);
    return {
      ...transaction,
      suspicious: Boolean(fraudReason),
      fraudReason
    };
  });
