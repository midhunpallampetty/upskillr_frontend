import { useNavigate } from 'react-router-dom';

export default function SignupSelection() {
  const navigate = useNavigate();
   return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-indigo-700 flex flex-col items-center justify-center text-white">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">Upskillr</h1>
        <p className="text-lg text-indigo-200">Choose your login type</p>
      </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div
          onClick={() => navigate('/studentRegister')}
          className="cursor-pointer bg-indigo-800 hover:bg-indigo-600 transition-all p-8 rounded-lg text-center shadow-lg w-72"
        >
          <img src="/images/students/student3.png" alt="Student Icon" className="mx-auto mb-4 w-20 h-20" />
          <h2 className="text-xl font-semibold mb-2">Student Register</h2>
          <p className="text-indigo-200 text-sm">Access courses, exams, and learning material.</p>
        </div>

        <div
          onClick={() => navigate('/schoolRegister')}
          className="cursor-pointer bg-indigo-800 hover:bg-indigo-600 transition-all p-8 rounded-lg text-center shadow-lg w-72"
        >
          <img src="/images/schools/school3.png" alt="School Icon" className="mx-auto mb-4 w-20 h-20" />
          <h2 className="text-xl font-semibold mb-2">School Register</h2>
          <p className="text-indigo-200 text-sm">Manage courses, track students, and view reports.</p>
        </div>
      </div>
    </div>
  );
}
