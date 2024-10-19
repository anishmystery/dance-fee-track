import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getOldestAndNewestTransactionYears,
  generateReport,
} from "../firestoreServices";

export function Reports() {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [reportType, setReportBy] = useState("");
  const [report, setReport] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchYears = async () => {
      const { oldestTransaction, newestTransaction } =
        await getOldestAndNewestTransactionYears();
      const yearRange = Array.from(
        new Array(newestTransaction - oldestTransaction + 1),
        (_, index) => oldestTransaction + index
      );
      setYears(yearRange);
    };
    fetchYears();
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      if (selectedYear && reportType) {
        setLoading(true);
        const reportData = await generateReport(selectedYear, reportType);
        setReport(reportData);
        setLoading(false);
      }
    };
    fetchReport();
  }, [selectedYear, reportType]);

  function handleChangeSelectedYear(e) {
    setSelectedYear(e.target.value);
    if (e.target.value)
      setErrors((errors) => ({ ...errors, yearRequired: undefined }));
  }

  function handleChangeReportType(e) {
    setReportBy(e.target.value);
    if (e.target.value)
      setErrors((errors) => ({ ...errors, reportTypeRequired: undefined }));
  }

  function handleBlurSelectedYear(e) {
    if (!e.target.value)
      setErrors((errors) => ({ ...errors, yearRequired: "Year is required" }));
  }

  function handleBlurReportType(e) {
    if (!e.target.value)
      setErrors((errors) => ({
        ...errors,
        reportTypeRequired: "Report type is required",
      }));
  }

  return (
    <div className="container">
      <h2>Reports</h2>
      <form className="form">
        <FormControl
          variant="outlined"
          fullWidth
          margin="normal"
          size="small"
          error={!!errors.yearRequired}
        >
          <InputLabel htmlFor="year-label">Year</InputLabel>
          <Select
            labelId="year-label"
            label="Year"
            value={selectedYear}
            onChange={handleChangeSelectedYear}
            onBlur={handleBlurSelectedYear}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
          {errors.yearRequired && (
            <FormHelperText>{errors.yearRequired}</FormHelperText>
          )}
        </FormControl>
        <FormControl
          variant="outlined"
          fullWidth
          margin="normal"
          size="small"
          error={!!errors.reportTypeRequired}
        >
          <InputLabel htmlFor="report-type-label">Report Type</InputLabel>
          <Select
            labelId="report-type-label"
            label="Report Type"
            value={reportType}
            onChange={handleChangeReportType}
            onBlur={handleBlurReportType}
          >
            <MenuItem value="Students">Students</MenuItem>
            <MenuItem value="Events">Events</MenuItem>
            <MenuItem value="Geetha's Dance Academy">
              Geetha's Dance Academy
            </MenuItem>
          </Select>
          {errors.reportTypeRequired && (
            <FormHelperText>{errors.reportTypeRequired}</FormHelperText>
          )}
        </FormControl>
      </form>
      {loading ? (
        <Box
          sx={{
            padding: "16px",
            marginTop: "16px",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        Object.keys(report).length !== 0 && (
          <Report
            reportData={report}
            reportType={reportType}
            year={selectedYear}
          />
        )
      )}
    </div>
  );
}

function Report({ reportData, reportType, year }) {
  const {
    report,
    verticalTotals,
    numberOfStudents = [],
    grandTotal,
  } = reportData;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState([]);

  function handleDialogOpen(paymentDetails) {
    setIsDialogOpen(true);
    setDialogData(paymentDetails);
  }

  function handleDialogClose() {
    setIsDialogOpen(false);
  }

  return (
    <div className="reports">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                {reportType === "Students" ? (
                  <strong>Student Name</strong>
                ) : reportType === "Events" ? (
                  <strong>Event Name</strong>
                ) : (
                  <strong>Year</strong>
                )}
              </TableCell>
              {months.map((month, i) => (
                <TableCell key={i}>
                  <strong>{month}</strong>
                </TableCell>
              ))}
              <TableCell>
                <strong>Total</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportType === "Students" ? (
              Object.entries(report).map(([studentName, data]) => (
                <TableRow key={studentName}>
                  <TableCell component="th" scope="row">
                    {studentName}
                  </TableCell>
                  {data.payments.map((amount, i) => (
                    <TableCell
                      key={i}
                      onClick={() =>
                        amount === null
                          ? {}
                          : handleDialogOpen(data.paymentDetails[i])
                      }
                      style={amount === null ? {} : { cursor: "pointer" }}
                    >
                      {amount === null
                        ? "-"
                        : isNaN(amount)
                        ? "N/A"
                        : `$${amount}`}
                    </TableCell>
                  ))}
                  <TableCell>
                    <strong>${data.total}</strong>
                  </TableCell>
                </TableRow>
              ))
            ) : reportType === "Events" ? (
              Object.entries(report).map(([eventName, data]) => (
                <TableRow key={eventName}>
                  <TableCell component="th" scope="row">
                    {eventName}
                  </TableCell>
                  {data.payments.map((amount, i) => (
                    <TableCell key={i}>
                      {amount === null ? "-" : `$${amount}`}
                    </TableCell>
                  ))}
                  <TableCell>
                    <strong>${data.total}</strong>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow key={year}>
                <TableCell component="th" scope="row">
                  {year}
                </TableCell>
                {verticalTotals.map((amount, index) => (
                  <TableCell key={index}>
                    ${amount} <br />
                    <small>({numberOfStudents[index]} students)</small>
                  </TableCell>
                ))}
                <TableCell>
                  <strong>${grandTotal}</strong>
                </TableCell>
              </TableRow>
            )}
            {reportType === "Students" || reportType === "Events" ? (
              <TableRow>
                <TableCell component="th" scope="row">
                  <strong>Totals</strong>
                </TableCell>
                {verticalTotals.map((total, i) => (
                  <TableCell key={i}>
                    <strong>${total}</strong>
                  </TableCell>
                ))}
                <TableCell>
                  <strong>${grandTotal}</strong>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>

      {reportType === "Students" && (
        <Dialog open={isDialogOpen} onClose={handleDialogClose}>
          <DialogTitle>
            <strong>Payment Details</strong>
          </DialogTitle>
          <DialogContent>
            {dialogData.length > 0 ? (
              dialogData.map((detail, i) => (
                <DialogContentText key={i}>
                  <strong>Event:</strong> {detail.eventName} <br />
                  <strong>Amount:</strong>{" "}
                  {isNaN(detail.amount) ? "N/A" : `$${detail.amount}`} <br />
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      detail.status === "Paid"
                        ? "paid"
                        : detail.status === "Paused"
                        ? "paused"
                        : detail.status === "Waived Off"
                        ? "waived-off"
                        : "not-paid"
                    }
                  >
                    {detail.status}
                  </span>{" "}
                  <br />
                  {detail.notes ? (
                    <>
                      {detail.notes} <br />
                    </>
                  ) : null}
                  <br />
                </DialogContentText>
              ))
            ) : (
              <DialogContentText>No details available</DialogContentText>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
