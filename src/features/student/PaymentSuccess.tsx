import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Download, 
  Calendar, 
  Clock, 
  BookOpen, 
  Award, 
  Users, 
  Star,
  ArrowRight,
  Home,
  Play,
  Mail,
  Share2,
  Gift
} from 'lucide-react';
import { getPaymentSession, savePayment } from './api/exam.api';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const hasRunRef = useRef(false);
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [courseDetails, setCourseDetails] = useState<any>(null);

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
        const receiptUrl = data.charges?.data?.receipt_url || 'N/A';
        const amount = data.amount_total;
        const currency = data.currency;
        const status = data.payment_status;

        // Store payment details for display
        setPaymentDetails({
          amount: amount / 100, // Convert from cents
          currency: currency.toUpperCase(),
          status,
          receiptUrl,
          paymentIntentId
        });

        // Get course details from localStorage or API
        const storedCourse = localStorage.getItem(`course-${courseId}`);
        if (storedCourse) {
          setCourseDetails(JSON.parse(storedCourse));
        }

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Processing your enrollment...</p>
          <p className="text-gray-500 text-sm mt-2">Please don't close this window</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Processing Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/studenthome')}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Success Animation */}
      <div className="pt-8 pb-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <CheckCircle className="w-12 h-12 text-white animate-bounce" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-spin">
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              🎉 Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Welcome to your new learning journey
            </p>
            <div className="inline-block bg-green-100 border border-green-200 rounded-full px-6 py-2">
              <span className="text-green-800 font-semibold">Enrollment Complete</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Confirmed</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Amount Paid</label>
                    <p className="text-3xl font-bold text-gray-900">
                      {paymentDetails?.currency} {paymentDetails?.amount}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Payment Status</label>
                    <p className="text-lg font-semibold text-green-600 capitalize">
                      {paymentDetails?.status}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Transaction Date</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Payment ID</label>
                    <p className="text-sm font-mono text-gray-600 break-all">
                      {paymentDetails?.paymentIntentId?.slice(-12) || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {paymentDetails?.receiptUrl && paymentDetails.receiptUrl !== 'N/A' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <a
                    href={paymentDetails.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Receipt</span>
                  </a>
                </div>
              )}
            </div>

            {/* Course Access Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Course Access</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Play className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Instant Access</h3>
                    <p className="text-gray-600 text-sm">Start learning immediately with full course access</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Certificate</h3>
                    <p className="text-gray-600 text-sm">Earn a completion certificate upon finishing</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Community</h3>
                    <p className="text-gray-600 text-sm">Join our exclusive student community</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Lifetime Access</h3>
                    <p className="text-gray-600 text-sm">Access your course materials anytime, anywhere</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Ready to Start Learning?</h3>
                <p className="mb-4 opacity-90">Your course is now available in your dashboard</p>
                {/* <button
                  onClick={() => navigate('/studenthome')}
                  className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Start Learning Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button> */}
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Next?</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Check Your Email</h3>
                    <p className="text-gray-600 text-sm">We've sent you a confirmation email with your course access details</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Access Your Dashboard</h3>
                    <p className="text-gray-600 text-sm">Navigate to your student dashboard to begin the course</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Start Your Journey</h3>
                    <p className="text-gray-600 text-sm">Begin with the first lesson and track your progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/studenthome')}
                  className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Home className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Go to Dashboard</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => navigate('/courses')}
                  className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">Browse More Courses</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
                  <div className="flex items-center space-x-3">
                    <Share2 className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Share Achievement</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-gray-600">support@yourschool.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <BookOpen className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Help Center</p>
                    <p className="text-sm text-gray-600">Find answers to common questions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Offer */}
            {/* <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center space-x-2 mb-3">
                <Gift className="w-6 h-6" />
                <h3 className="text-xl font-bold">Special Offer!</h3>
              </div>
              <p className="mb-4 text-yellow-100">
                Get 20% off your next course enrollment as a valued student!
              </p>
              <button className="bg-white text-orange-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
                Claim Discount
              </button>
            </div> */}
          </div>
        </div>
      </div>

      {/* Floating Success Message */}
      <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">Enrollment Complete!</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
