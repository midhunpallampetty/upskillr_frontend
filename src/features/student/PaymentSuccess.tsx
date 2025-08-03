import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPaymentSession, savePayment } from './api/exam.api';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const hasRunRef = useRef(false);
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const savePaymentDetails = async () => {
      const queryParams = new URLSearchParams(location.search);
      const sessionId = queryParams.get('session_id');
      const courseId = queryParams.get('courseId');
      const schoolName = localStorage.getItem('schoolname');
      const student = localStorage.getItem('student');
      const parsedStudent = student ? JSON.parse(student) : null;
      const studentId = parsedStudent?._id;

      if (!sessionId || !courseId || !schoolName || !studentId) {
        setError('Missing required parameters. Please try again.');
        setIsSaving(false);
        return;
      }

      try {
        const data = await getPaymentSession(sessionId);
        
        if (!data.payment_intent) {
          setError('Payment intent not found. Please contact support.');
          setIsSaving(false);
          return;
        }

        const paymentIntentId = data.payment_intent;
        const receiptUrl = data.charges?.data[0]?.receipt_url || 'N/A';
        const amount = data.amount_total;
        const currency = data.currency;
        const status = data.payment_status;

        await savePayment(
          schoolName,
          courseId,
          studentId,
          paymentIntentId,
          amount,
          currency,
          status,
          receiptUrl
        );

        setIsSaving(false);
      } catch (err: any) {
        setError('Failed to process payment. Please contact support.');
        setIsSaving(false);
        console.error('Error processing payment:', err);
      }
    };

    savePaymentDetails();
  }, [location]);

  if (isSaving) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-green-600 text-xl font-semibold">
        🎉 Payment Successful! You're enrolled.
        <p onClick={() => navigate(-5)} className="text-blue-600 underline ml-2">
          Go to Courses
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;