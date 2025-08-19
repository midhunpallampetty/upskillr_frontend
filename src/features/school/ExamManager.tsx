import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Users, 
  Award, 
  FileText, 
  Settings,
  GraduationCap,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  Edit,
  Search
} from 'lucide-react';
import useSchoolAuthGuard from './hooks/useSchoolAuthGuard';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE = 'https://exam.upskillr.online/api';

const ExamManager = () => {
  useSchoolAuthGuard();

  const [examName, setExamName] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState(0);
  const [selectedExam, setSelectedExam] = useState('');
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  // New state for search, filter, and pagination
  const [examSearch, setExamSearch] = useState('');
  const [questionSearch, setQuestionSearch] = useState('');
  const [examFilter, setExamFilter] = useState('all');
  const [currentExamPage, setCurrentExamPage] = useState(1);
  const [currentQuestionPage, setCurrentQuestionPage] = useState(1);
  const itemsPerPage = 5;

  const dbName = Cookies.get('dbname');

  const getAnswerIndex = (q) => {
    if (typeof q.answer === 'number') return q.answer;
    if (typeof q.answerIndex === 'number') return q.answerIndex;
    if (typeof q.correctAnswer === 'string')
      return q.options?.indexOf(q.correctAnswer);
    return -1;
  };

  const handleEditQuestion = (questionObj) => {
    setEditingQuestionId(questionObj._id);
    setQuestion(questionObj.questionText || questionObj.question || '');
    setOptions(questionObj.options || ['', '', '', '']);
    setAnswer(getAnswerIndex(questionObj) >= 0 ? getAnswerIndex(questionObj) : 0);
    setSelectedExam(questionObj.exam || '');
    setActiveTab('create-question');
    setIsEditing(true);
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestionId) return toast.error('No question selected for editing.');
    if (!question.trim() || options.some(opt => !opt.trim())) {
      return toast.error('Please fill out all fields.');
    }

    try {
      await axios.put(`${API_BASE}/question/${editingQuestionId}/${dbName}`, {
        question,
        options,
        correctAnswer: options[answer],
        examId: selectedExam,
      });
      toast.success('✅ Question updated successfully!');
      fetchQuestions();
      fetchExams();
      resetForm();
    } catch (err) {
      console.error('Update error:', err);
      toast.error('❌ Failed to update question.');
    }
  };

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/exam/all-exams`, {
        params: { schoolName: dbName },
      });
      setExams(res.data);
    } catch (err) {
      console.error('Error fetching exams');
      toast.error('❌ Error fetching exams');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/question/get-all`, {
        params: { schoolName: dbName },
      });
      setQuestions(res.data);
    } catch (err) {
      console.error('Error fetching questions', err);
      toast.error('❌ Error fetching questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!dbName) {
      toast.error('No school database selected!');
      return;
    }
    fetchExams();
    fetchQuestions();
  }, [dbName]);

  const handleCreateExam = async () => {
    if (!examName.trim()) return toast.error('Exam name is required!');
    if (!dbName) return toast.error('No school database selected!');

    try {
      await axios.post(`${API_BASE}/exam`, {
        schoolName: dbName,
        title: examName,
      });
      setExamName('');
      fetchExams();
      toast.success('✅ Exam created successfully');
    } catch (err) {
      console.error('Error creating exam');
      toast.error('❌ Error creating exam');
    }
  };

  const handleCreateQuestion = async () => {
    if (!question.trim() || options.some(opt => !opt.trim())) {
      return toast.error('Please fill out all question fields and options.');
    }

    if (answer < 0 || answer >= options.length) {
      return toast.error('Answer index is out of range.');
    }

    if (!selectedExam) {
      return toast.error('Please select an exam to assign the question.');
    }

    try {
      await axios.post(`${API_BASE}/question`, {
        schoolName: dbName,
        question,
        options,
        answer,
        examId: selectedExam,
      });
      setQuestion('');
      setOptions(['', '', '', '']);
      setAnswer(0);
      fetchQuestions();
      fetchExams();
      toast.success('✅ Question created successfully');
    } catch (err) {
      console.error('Error creating question:', err?.response?.data || err);
      toast.error(err?.response?.data?.message || '❌ Failed to create question');
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;

    try {
      await axios.delete(`${API_BASE}/exam/${examId}/${dbName}`);
      fetchExams();
      toast.success('✅ Exam deleted successfully');
    } catch (err) {
      console.error('Delete exam error:', err);
      toast.error('❌ Failed to delete exam');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await axios.delete(`${API_BASE}/question/${questionId}/${dbName}`);
      fetchQuestions();
      fetchExams();
      toast.success('✅ Question deleted successfully');
    } catch (err) {
      console.error('Delete question error:', err);
      toast.error('❌ Failed to delete question');
    }
  };

  const resetForm = () => {
    setQuestion('');
    setOptions(['', '', '', '']);
    setAnswer(0);
    setSelectedExam('');
    setEditingQuestionId(null);
    setIsEditing(false);
  };

  // Search and Filter Logic
  const filteredExams = exams.filter(exam => 
    exam.title.toLowerCase().includes(examSearch.toLowerCase()) &&
    (examFilter === 'all' || (examFilter === 'hasQuestions' && exam.questions?.length > 0))
  );

  const filteredQuestions = questions.filter(q => 
    (q.questionText || q.question || '').toLowerCase().includes(questionSearch.toLowerCase())
  );

  // Pagination Logic
  const totalExamPages = Math.ceil(filteredExams.length / itemsPerPage);
  const totalQuestionPages = Math.ceil(filteredQuestions.length / itemsPerPage);

  const paginatedExams = filteredExams.slice(
    (currentExamPage - 1) * itemsPerPage,
    currentExamPage * itemsPerPage
  );

  const paginatedQuestions = filteredQuestions.slice(
    (currentQuestionPage - 1) * itemsPerPage,
    currentQuestionPage * itemsPerPage
  );

  const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span className="text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );

  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className={`${bgColor} p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
        </div>
        <div className={`${color.replace('text-', 'bg-').replace('-600', '-100')} p-3 rounded-lg`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        isActive
          ? 'bg-indigo-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Exam Management System</h1>
                <p className="text-sm text-gray-500">School Administration Panel</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                {dbName || 'Demo School'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={BookOpen}
            title="Total Exams"
            value={exams.length}
            color="text-indigo-600"
            bgColor="bg-white"
          />
          <StatCard
            icon={FileText}
            title="Total Questions"
            value={questions.length}
            color="text-emerald-600"
            bgColor="bg-white"
          />
          <StatCard
            icon={Award}
            title="Total Marks"
            value={exams.reduce((sum, exam) => sum + (exam.totalMarks || 0), 0)}
            color="text-amber-600"
            bgColor="bg-white"
          />
          <StatCard
            icon={Users}
            title="Active Students"
            value="156"
            color="text-purple-600"
            bgColor="bg-white"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200 px-6 py-4">
            <nav className="flex space-x-2">
              <TabButton
                id="overview"
                label="Overview"
                icon={ClipboardList}
                isActive={activeTab === 'overview'}
                onClick={setActiveTab}
              />
              <TabButton
                id="create-exam"
                label="Create Exam"
                icon={Plus}
                isActive={activeTab === 'create-exam'}
                onClick={setActiveTab}
              />
              <TabButton
                id="create-question"
                label="Add Question"
                icon={FileText}
                isActive={activeTab === 'create-question'}
                onClick={setActiveTab}
              />
              <TabButton
                id="manage"
                label="Manage"
                icon={Settings}
                isActive={activeTab === 'manage'}
                onClick={setActiveTab}
              />
            </nav>
          </div>

          <div className="p-6">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-600">Loading...</span>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
                        Recent Exams
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {paginatedExams.slice(0, 3).map((exam) => (
                        <div key={exam._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{exam.title}</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                {exam.questions?.length || 0} questions • {exam.totalMarks || 0} marks
                              </p>
                            </div>
                            <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
                              Active
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Pagination
                      currentPage={currentExamPage}
                      totalPages={totalExamPages}
                      onPageChange={setCurrentExamPage}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-emerald-600" />
                        Recent Questions
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {paginatedQuestions.slice(0, 3).map((q, idx) => {
                        const answerIdx = getAnswerIndex(q);
                        return (
                          <div key={q._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h4 className="font-medium text-gray-900 text-sm mb-2">
                              Q{idx + 1}: {(q.question || '').substring(0, 60)}...
                            </h4>
                            <div className="flex items-center text-xs text-gray-500">
                              <CheckCircle className="h-3 w-3 mr-1 text-emerald-500" />
                              Correct: {q.options?.[answerIdx] ?? '—'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Pagination
                      currentPage={currentQuestionPage}
                      totalPages={totalQuestionPages}
                      onPageChange={setCurrentQuestionPage}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'create-exam' && (
              <div className="max-w-2xl">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Exam</h3>
                  <p className="text-gray-600">Set up a new examination for your students.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exam Name
                    </label>
                    <input
                      type="text"
                      value={examName}
                      onChange={e => setExamName(e.target.value)}
                      placeholder="e.g., Mathematics Mid-Term Exam"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleCreateExam}
                    disabled={!examName.trim()}
                    className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Exam</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'create-question' && (
              <div className="max-w-3xl">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isEditing ? 'Update Question' : 'Add New Question'}
                  </h3>
                  <p className="text-gray-600">
                    {isEditing ? 'Edit the selected question.' : 'Create and assign questions to existing exams.'}
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Exam
                    </label>
                    <select
                      value={selectedExam}
                      onChange={e => !isEditing && setSelectedExam(e.target.value)}
                      disabled={isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Choose an exam...</option>
                      {exams.map((exam) => (
                        <option key={exam._id} value={exam._id}>
                          {exam.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question
                    </label>
                    <textarea
                      value={question}
                      onChange={e => setQuestion(e.target.value)}
                      placeholder="Enter your question here..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Answer Options
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {options.map((opt, idx) => (
                        <div key={idx} className="relative">
                          <input
                            type="text"
                            value={opt}
                            onChange={e => handleOptionChange(idx, e.target.value)}
                            placeholder={`Option ${idx + 1}`}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors ${
                              answer === idx 
                                ? 'border-emerald-500 bg-emerald-50' 
                                : 'border-gray-300'
                            }`}
                          />
                          {answer === idx && (
                            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correct Answer
                    </label>
                    <div className="flex space-x-2">
                      {options.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setAnswer(idx)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            answer === idx
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          Option {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={isEditing ? handleUpdateQuestion : handleCreateQuestion}
                      disabled={
                        loading || 
                        !question.trim() || 
                        options.some(opt => !opt.trim()) || 
                        (!isEditing && !selectedExam)
                      }
                      className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{isEditing ? 'Update Question' : 'Add Question to Exam'}</span>
                    </button>
                    {isEditing && (
                      <button
                        onClick={resetForm}
                        className="flex items-center space-x-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      >
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'manage' && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Manage Exams</h3>
                      <p className="text-gray-600">View and manage all created exams.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={examSearch}
                          onChange={e => {
                            setExamSearch(e.target.value);
                            setCurrentExamPage(1);
                          }}
                          placeholder="Search exams..."
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <select
                        value={examFilter}
                        onChange={e => {
                          setExamFilter(e.target.value);
                          setCurrentExamPage(1);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="all">All Exams</option>
                        <option value="hasQuestions">With Questions</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {paginatedExams.map((exam) => (
                      <div key={exam._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <BookOpen className="h-5 w-5 text-indigo-600" />
                              <h4 className="text-lg font-semibold text-gray-900">{exam.title}</h4>
                              <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
                                {exam.totalMarks || 0} marks
                              </span>
                            </div>
                            {exam.questions && exam.questions.length > 0 && (
                              <div className="ml-8">
                                <p className="text-sm text-gray-600 mb-2">Questions ({exam.questions.length}):</p>
                                <ul className="space-y-1">
                                  {exam.questions.slice(0, 3).map((q, idx) => (
                                    <li key={q._id || idx} className="text-sm text-gray-700 flex items-center">
                                      <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                                        {idx + 1}
                                      </span>
                                      {q.questionText}
                                    </li>
                                  ))}
                                  {exam.questions.length > 3 && (
                                    <li className="text-sm text-gray-500 ml-9">
                                      +{exam.questions.length - 3} more questions
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteExam(exam._id)}
                            className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="text-sm">Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Pagination
                    currentPage={currentExamPage}
                    totalPages={totalExamPages}
                    onPageChange={setCurrentExamPage}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Manage Questions</h3>
                      <p className="text-gray-600">View and manage all created questions.</p>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={questionSearch}
                        onChange={e => {
                          setQuestionSearch(e.target.value);
                          setCurrentQuestionPage(1);
                        }}
                        placeholder="Search questions..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {paginatedQuestions.map((q, idx) => {
                      const answerIdx = getAnswerIndex(q);
                      return (
                        <div key={q._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-start space-x-3 mb-4">
                                <span className="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center text-sm font-medium">
                                  {idx + 1}
                                </span>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 mb-3">{q.questionText}</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {q.options?.map((opt, i) => (
                                      <div
                                        key={i}
                                        className={`px-3 py-2 rounded-lg text-sm ${
                                          i === answerIdx
                                            ? 'bg-emerald-100 text-emerald-800 font-medium border border-emerald-200'
                                            : 'bg-gray-50 text-gray-700'
                                        }`}
                                      >
                                        <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                                        {opt}
                                        {i === answerIdx && (
                                          <CheckCircle className="inline h-4 w-4 ml-2 text-emerald-600" />
                                        )}
                                      </div>
                                    )) || <p className="text-sm text-gray-500">No options available</p>}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditQuestion(q)}
                                className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="text-sm">Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(q._id)}
                                className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="text-sm">Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Pagination
                    currentPage={currentQuestionPage}
                    totalPages={totalQuestionPages}
                    onPageChange={setCurrentQuestionPage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default ExamManager;