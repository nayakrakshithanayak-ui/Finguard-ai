import Transaction from "../models/Transaction.js";
import { annotateTransactions } from "../utils/transactionAnalysis.js";
import { validateTransactionPayload } from "../utils/transactionValidation.js";

const AUTO_SPLIT_THRESHOLD = 5000;
const MANDATORY_SPLIT_CATEGORIES = ["Food", "Health", "Bills"];

export const createTransaction = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized." });
    }

    const requestedAmount = Number(req.body?.amount);
    const isLargeExpenseRequest =
      req.body?.type === "expense" && !Number.isNaN(requestedAmount) && requestedAmount >= AUTO_SPLIT_THRESHOLD;

    if (isLargeExpenseRequest && !req.body?.category?.trim()) {
      return res.status(400).json({ message: "Select only one additional category" });
    }

    const validation = validateTransactionPayload(req.body);
    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const shouldAutoSplit = req.body.type === "expense" && validation.parsedAmount >= AUTO_SPLIT_THRESHOLD;
    const baseTransaction = {
      user: userId,
      type: req.body.type,
      date: validation.parsedDate
    };

    if (shouldAutoSplit) {
      if (!validation.normalizedCategory || MANDATORY_SPLIT_CATEGORIES.includes(validation.normalizedCategory)) {
        return res.status(400).json({ message: "Select only one additional category" });
      }
    }

    const createdTransactions = shouldAutoSplit
      ? await Transaction.insertMany(
          [...MANDATORY_SPLIT_CATEGORIES, validation.normalizedCategory].map((category) => ({
            ...baseTransaction,
            category,
            amount: validation.parsedAmount / 4
          }))
        )
      : [
          await Transaction.create({
            ...baseTransaction,
            amount: validation.parsedAmount,
            category: validation.normalizedCategory
          })
        ];

    const transactions = await Transaction.find({ user: userId }).sort({ date: -1, createdAt: -1 }).lean();
    const annotatedTransactions = annotateTransactions(transactions);
    const createdTransactionIds = new Set(createdTransactions.map((transaction) => transaction._id.toString()));
    const matchingTransactions = annotatedTransactions.filter((transaction) =>
      createdTransactionIds.has(transaction._id.toString())
    );

    return res.status(201).json({
      splitApplied: shouldAutoSplit,
      transactions: matchingTransactions
    });
  } catch (error) {
    return next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized." });
    }

    const transactions = await Transaction.find({ user: userId }).sort({ date: -1, createdAt: -1 }).lean();
    return res.status(200).json(annotateTransactions(transactions));
  } catch (error) {
    return next(error);
  }
};

export const getTransactionById = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized." });
    }

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: userId
    }).lean();

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    const transactions = await Transaction.find({ user: userId }).sort({ date: -1, createdAt: -1 }).lean();
    const annotatedTransactions = annotateTransactions(transactions);
    const annotatedTransaction = annotatedTransactions.find(
      (candidate) => candidate._id.toString() === transaction._id.toString()
    );

    return res.status(200).json(annotatedTransaction || transaction);
  } catch (error) {
    return next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized." });
    }

    const validation = validateTransactionPayload(req.body);
    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        user: userId
      },
      {
        amount: validation.parsedAmount,
        type: req.body.type,
        category: validation.normalizedCategory,
        date: validation.parsedDate
      },
      {
        new: true
      }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    const transactions = await Transaction.find({ user: userId }).sort({ date: -1, createdAt: -1 }).lean();
    const annotatedTransactions = annotateTransactions(transactions);
    const annotatedTransaction = annotatedTransactions.find(
      (candidate) => candidate._id.toString() === transaction._id.toString()
    );

    return res.status(200).json(annotatedTransaction || transaction.toObject());
  } catch (error) {
    return next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized." });
    }

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: userId
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    await transaction.deleteOne();
    return res.status(200).json({ message: "Transaction deleted successfully." });
  } catch (error) {
    return next(error);
  }
};
