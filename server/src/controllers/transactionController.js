import Transaction from "../models/Transaction.js";
import { annotateTransactions } from "../utils/transactionAnalysis.js";
import { validateTransactionPayload } from "../utils/transactionValidation.js";

export const createTransaction = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Not authorized." });
    }

    const validation = validateTransactionPayload(req.body);
    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const transaction = await Transaction.create({
      user: userId,
      amount: validation.parsedAmount,
      type: req.body.type,
      category: validation.normalizedCategory,
      date: validation.parsedDate
    });

    const transactions = await Transaction.find({ user: userId }).sort({ date: -1, createdAt: -1 }).lean();
    const annotatedTransactions = annotateTransactions(transactions);
    const annotatedTransaction = annotatedTransactions.find(
      (candidate) => candidate._id.toString() === transaction._id.toString()
    );

    return res.status(201).json(annotatedTransaction || transaction.toObject());
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
