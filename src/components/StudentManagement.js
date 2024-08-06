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
      <h1>Student Management</h1>
      <Link to="/students/add">
        <button>Add Student</button>
      </Link>
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
