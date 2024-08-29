import { useState, useEffect } from "react";
import { StudentList } from "./StudentList";
import {
  deleteStudent,
  deleteStudentEventMapping,
  getStudentEventMappingByStudentId,
  getStudents,
} from "../firestoreServices";
import { Link } from "react-router-dom";
import { ConfirmationModal } from "./ConfirmationModal";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

export function StudentManagement() {
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const initializeStudents = async () => {
      const allStudents = await getStudents();
      setStudentList(allStudents);
    };
    initializeStudents();
  }, []);

  function handleOnDelete(student) {
    setIsModalOpen(true);
    setSelectedStudent(student);
  }

  function handleModalClose() {
    setIsModalOpen(false);
    setSelectedStudent();
  }

  async function handleModalConfirm() {
    if (selectedStudent) {
      await deleteStudent(selectedStudent.id);
      const mappings = await getStudentEventMappingByStudentId(
        selectedStudent.id
      );
      for (const mapping of mappings) {
        await deleteStudentEventMapping(mapping.id);
      }
      setStudentList((studentList) =>
        studentList.filter((student) => student.id !== selectedStudent.id)
      );
      handleModalClose();
    }
  }

  return (
    <div className="container">
      <h2>Students</h2>
      <div className="action-btns">
        <Link to="/students/add">
          <Button variant="contained" startIcon={<AddIcon></AddIcon>}>
            Add Student
          </Button>
        </Link>
      </div>
      <StudentList studentList={studentList} onDelete={handleOnDelete} />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        message={`Are you sure you want to delete ${
          selectedStudent ? selectedStudent.name : ""
        }`}
      />
    </div>
  );
}
