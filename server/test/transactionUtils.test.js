import test from "node:test";
import assert from "node:assert/strict";
import { annotateTransactions, getFraudReason } from "../src/utils/transactionAnalysis.js";
import { validateTransactionPayload } from "../src/utils/transactionValidation.js";

test("validateTransactionPayload normalizes valid input", () => {
  const result = validateTransactionPayload({
    amount: "1200.50",
    type: "expense",
    category: "  Food  ",
    date: "2026-04-15"
  });

  assert.equal(result.error, undefined);
  assert.equal(result.parsedAmount, 1200.5);
  assert.equal(result.normalizedCategory, "Food");
  assert.ok(result.parsedDate instanceof Date);
});

test("validateTransactionPayload rejects invalid type", () => {
  const result = validateTransactionPayload({
    amount: "100",
    type: "refund",
    category: "Bonus",
    date: "2026-04-15"
  });

  assert.equal(result.error, "Type must be either income or expense.");
});

test("getFraudReason flags high amount transactions", () => {
  const transactions = [
    { amount: 4000, category: "Food", date: "2026-04-01" },
    { amount: 12000, category: "Bills", date: "2026-04-02" }
  ];

  assert.equal(getFraudReason(transactions[1], transactions), "High Amount");
});

test("getFraudReason flags repeated category transactions", () => {
  const transactions = [
    { amount: 200, category: "Food", date: "2026-04-01" },
    { amount: 250, category: "Food", date: "2026-04-02" },
    { amount: 300, category: "Food", date: "2026-04-03" },
    { amount: 350, category: "Food", date: "2026-04-04" }
  ];

  assert.equal(getFraudReason(transactions[0], transactions), "Repeated Category");
});

test("annotateTransactions adds suspicious metadata", () => {
  const transactions = [
    { _id: "1", amount: 300, category: "Food", date: "2026-04-01" },
    { _id: "2", amount: 20000, category: "Travel", date: "2026-04-02" }
  ];

  const annotatedTransactions = annotateTransactions(transactions);

  assert.equal(annotatedTransactions[0].suspicious, false);
  assert.equal(annotatedTransactions[0].fraudReason, null);
  assert.equal(annotatedTransactions[1].suspicious, true);
  assert.equal(annotatedTransactions[1].fraudReason, "High Amount");
});
