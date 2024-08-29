import { Student } from "./Student";

export function StudentList({ studentList, onDelete }) {
  return (
    <div className="list-view">
      {studentList.map((student) => (
        <Student key={student.id} student={student} onDelete={onDelete} />
      ))}
    </div>
  );
}
