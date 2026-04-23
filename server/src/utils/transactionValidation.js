export const validateTransactionPayload = ({ amount, type, category, date }) => {
  const normalizedCategory = category?.trim();

  if (amount === undefined || !type || !category || !date) {
    return { error: "Amount, type, category and date are required." };
  }

  if (!["income", "expense"].includes(type)) {
    return { error: "Type must be either income or expense." };
  }

  const parsedAmount = Number(amount);
  if (Number.isNaN(parsedAmount)) {
    return { error: "Amount must be a valid number." };
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return { error: "Date must be a valid date." };
  }

  if (!normalizedCategory) {
    return { error: "Category is required." };
  }

  return {
    parsedAmount,
    parsedDate,
    normalizedCategory
  };
};
