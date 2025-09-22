"use client";

import React, { useEffect, useState } from "react";
import { getSchoolByDomain } from "../../api/school.api";

interface SchoolBlockerProps {
  children: React.ReactNode;
}

const SchoolBlocker: React.FC<SchoolBlockerProps> = ({ children }) => {
  const [isBlocked, setIsBlocked] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    const checkSchool = async () => {
      try {
        const origin = window.location.origin; // e.g., "https://gamersclub.eduvia.space"
        const data = await getSchoolByDomain(origin);

        console.log("School data:", data);

        if (data?.school.isBlocked) {
          console.log("School is BLOCKED"); // ✅ log blocked
          setIsBlocked(true);
          setErrorMsg("This school is blocked.");
        } else {
          console.log("School is NOT blocked"); // ✅ log not blocked
          setIsBlocked(false);
        }
      } catch (err) {
        console.error("Error checking school block status:", err);
        setIsBlocked(false); // fail open
      } finally {
        setLoading(false);
      }
    };

    checkSchool();
  }, []);

  if (loading) return <div className="text-center mt-20 text-lg">Loading...</div>;

  if (isBlocked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">School Blocked</h1>
          <p className="text-gray-700 mb-4">
            Due to technical reasons, your school is blocked at the platform end.
          </p>
          <p className="text-gray-700 mb-4">
            Until unblocked, student registrations will be blocked.
          </p>
          <p className="text-gray-700 mb-6">
            Please contact support for further clarity and to request unblocking.
          </p>
          <a
            href="mailto:support@eduvia.space" // Update with your actual support email
            className="inline-block bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SchoolBlocker;
