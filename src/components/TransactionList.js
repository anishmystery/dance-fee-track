import { Transaction } from "./Transaction";

export function TransactionList({ transactionList, onDelete }) {
  return (
    <div className="list-view">
      {transactionList.map((transaction) => (
        <Transaction
          key={transaction.id}
          transaction={transaction}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
