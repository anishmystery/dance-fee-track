import { useNavigate } from "react-router-dom";
import { ConfirmationModal } from "./ConfirmationModal";
import { TransactionList } from "./TransactionList";
import { useEffect, useState } from "react";
import { deleteTransaction, getTransactions } from "../firestoreServices";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Add } from "@mui/icons-material";

export function TransactionManagement() {
  const [transactionType, setTransactionType] = useState("");
  const [transactionList, setTransactionList] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const initializeTransactions = async () => {
      const allTransactions = await getTransactions();
      setTransactionList(allTransactions);
    };
    initializeTransactions();
  }, []);

  function handleChangeTransactionType(e) {
    setTransactionType(e.target.value);
    if (e.target.value)
      setErrors((errors) => ({
        ...errors,
        transactionTypeRequired: undefined,
      }));
  }

  function handleBlurTransactionType(e) {
    if (!e.target.value)
      setErrors((errors) => ({
        ...errors,
        transactionTypeRequired: "Transaction type is required",
      }));
  }

  function validateForm() {
    const newErrors = {};
    if (!transactionType)
      newErrors.transactionTypeRequired = "Transaction type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleClickAddTransaction() {
    if (validateForm())
      navigate("/transactions/add", { state: { transactionType } });
  }

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
      <h2>Transactions</h2>
      <div className="action-btns">
        <FormControl
          fullWidth
          size="small"
          error={!!errors.transactionTypeRequired}
        >
          <InputLabel id="transaction-type-label">Transaction Type</InputLabel>
          <Select
            labelId="transaction-type-label"
            value={transactionType}
            onChange={handleChangeTransactionType}
            label="Transaction Type"
            onBlur={handleBlurTransactionType}
          >
            <MenuItem value="Ulpa's Dance Academy">
              Ulpa's Dance Academy
            </MenuItem>
            <MenuItem value="Geetha's Dance Academy">
              Geetha's Dance Academy
            </MenuItem>
          </Select>
          {errors.transactionTypeRequired && (
            <FormHelperText>{errors.transactionTypeRequired}</FormHelperText>
          )}
        </FormControl>
        <Button
          onClick={handleClickAddTransaction}
          variant="contained"
          startIcon={<Add></Add>}
          sx={{ marginTop: "16px" }}
        >
          Add Transaction
        </Button>
      </div>
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
