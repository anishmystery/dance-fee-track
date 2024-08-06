import { Transaction } from "./Transaction";

export function TransactionList({ transactionList, onDelete }) {
  return (
    <>
      <h1>Transaction List</h1>
      {transactionList.map((transaction) => (
        <Transaction
          key={transaction.id}
          transaction={transaction}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}
