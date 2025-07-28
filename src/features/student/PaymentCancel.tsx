// PaymentCancel.tsx
import { Link } from 'react-router-dom';

const PaymentCancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-600 text-xl font-semibold">
        Payment Cancelled. Please try again.
        <Link to="/student/courses" className="text-blue-600 underline ml-2">
          Back to Courses
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancel;