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
        // Only the origin (protocol + hostname + port if any)
        const origin = window.location.origin; // e.g., "https://gamersclub.eduvia.space"
        const data = await getSchoolByDomain(origin);

        if (data?.isBlocked) {
          setIsBlocked(true);
          setErrorMsg("This school is blocked.");
        } else {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isBlocked) {
    return (
      <div className="text-red-600 text-center mt-20">
        {errorMsg}
      </div>
    );
  }

  return <>{children}</>;
};

export default SchoolBlocker;
