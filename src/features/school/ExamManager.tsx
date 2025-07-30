import React, { useEffect, useState } from "react";
import axios from "axios";

// Set base URL for API
axios.defaults.baseURL = "http://exam.localhost:5000/api";

interface Exam {
  _id: string;
  title: string;
  totalMarks: number;
  questions: string[];
  minToPass: number;
}

interface ExamInput {
  title: string;
  totalMarks: number;
  questions: string[];
  minToPass: number;
}

const emptyExam: ExamInput = {
  title: "",
  totalMarks: 100,
  questions: [],
  minToPass: 40,
};

const ExamManager: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [form, setForm] = useState<ExamInput>(emptyExam);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Exam[]>("/exams");
      setExams(res.data);
    } catch {
      setError("Failed to load exams.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "totalMarks" || name === "minToPass" ? parseInt(value) : value,
    }));
  };

  const handleQuestions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setForm((prev) => ({
      ...prev,
      questions: input.split(",").map((q) => q.trim()),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload = {
      ...form,
      questions: form.questions.filter(Boolean),
    };

    if (!payload.title || !payload.totalMarks || !payload.questions.length || !payload.minToPass) {
      setError("All fields are required.");
      return;
    }

    try {
      if (editId) {
        await axios.put(`/exams/${editId}`, payload);
      } else {
        await axios.post("/exams", payload);
      }
      setForm(emptyExam);
      setEditId(null);
      fetchExams();
    } catch {
      setError("Failed to save exam.");
    }
  };

  const startEdit = (exam: Exam) => {
    setEditId(exam._id);
    setForm({
      title: exam.title,
      totalMarks: exam.totalMarks,
      questions: exam.questions,
      minToPass: exam.minToPass,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/exams/${id}`);
      fetchExams();
    } catch {
      setError("Failed to delete exam.");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Exam Manager</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <input
          name="title"
          placeholder="Exam Title"
          value={form.title}
          onChange={handleChange}
          style={{ marginRight: 8 }}
        />

        <input
          type="number"
          name="totalMarks"
          placeholder="Total Marks"
          value={form.totalMarks}
          onChange={handleChange}
          style={{ marginRight: 8, width: 120 }}
          min={1}
        />

        <input
          name="questions"
          placeholder="Question IDs (comma-separated)"
          value={form.questions.join(",")}
          onChange={handleQuestions}
          style={{ marginRight: 8, minWidth: 250 }}
        />

        <input
          type="number"
          name="minToPass"
          placeholder="Min to Pass"
          value={form.minToPass}
          onChange={handleChange}
          style={{ marginRight: 8, width: 120 }}
          min={1}
        />

        <button type="submit">
          {editId ? "Update Exam" : "Create Exam"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm(emptyExam);
            }}
            style={{ marginLeft: 8 }}
          >
            Cancel
          </button>
        )}

        {error && (
          <div style={{ color: "red", marginTop: 8 }}>{error}</div>
        )}
      </form>

      <h3>Exams</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table border={1} cellPadding={6}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Total Marks</th>
              <th>Question IDs</th>
              <th>Min to Pass</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam._id}>
                <td>{exam.title}</td>
                <td>{exam.totalMarks}</td>
                <td>{exam.questions.join(", ")}</td>
                <td>{exam.minToPass}</td>
                <td>
                  <button onClick={() => startEdit(exam)}>Edit</button>
                  <button onClick={() => handleDelete(exam._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {!exams.length && (
              <tr>
                <td colSpan={5}>No exams found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExamManager;
