import { Student } from "./Student";

export function StudentList({ studentList, onDelete }) {
  return (
    <>
      <h1>Student List</h1>
      {studentList.map((student) => (
        <Student key={student.id} student={student} onDelete={onDelete} />
      ))}
    </>
  );
}
