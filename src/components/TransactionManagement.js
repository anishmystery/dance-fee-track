import { Link } from "react-router-dom";
import { ConfirmationModal } from "./ConfirmationModal";
import { TransactionList } from "./TransactionList";
import { useEffect, useState } from "react";
import { deleteTransaction, getTransactions } from "../firestoreServices";

export function TransactionManagement() {
  const [transactionList, setTransactionList] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const initializeTransactions = async () => {
      const allTransactions = await getTransactions();
      // setTransactionList(
      //   allTransactions.filter(
      //     (transaction) => transaction.status !== "Cancelled"
      //   )
      // );
      setTransactionList(allTransactions);
    };
    initializeTransactions();
  }, []);

  function handleOnDelete(student) {
    setIsModalOpen(true);
    setSelectedTransaction(student);
  }

  function handleModalClose() {
    setIsModalOpen(false);
    setSelectedTransaction();
  }

  async function handleModalConfirm() {
    if (selectedTransaction) {
      await deleteTransaction(selectedTransaction.id);
      setTransactionList((transactionList) =>
        transactionList.filter(
          (transaction) => transaction.id !== selectedTransaction.id
        )
      );
      handleModalClose();
    }
  }

  return (
    <div className="container">
      <h1>Transaction Management</h1>
      <Link to="/transactions/add">
        <button>Add Transaction</button>
      </Link>
      <TransactionList
        transactionList={transactionList}
        onDelete={handleOnDelete}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        message="Are you sure you want to delete this transaction?"
      />
    </div>
  );
}
