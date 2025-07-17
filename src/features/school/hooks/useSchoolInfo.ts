import { useReducer, useEffect,useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { getSchoolBySubdomain, createDatabase } from '../api/school.api';
import { schoolReducer, initialState } from '../reducers/schoolReducer';
import { School } from '../types/School';

export const useSchoolInfo = (verifiedSchool: string | undefined) => {
  const [state, dispatch] = useReducer(schoolReducer, initialState);
  const [school, setSchool] = useState<School | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchoolInfo = async () => {
      if (!verifiedSchool) {
        dispatch({ type: 'FETCH_ERROR', payload: '❌ School identifier is missing in URL.' });
        return;
      }

      try {
        dispatch({ type: 'FETCH_START' });

        const res = await getSchoolBySubdomain(verifiedSchool);
        const schoolData = res.data.school;

        setSchool(schoolData);
        Cookies.set('schoolData', JSON.stringify(schoolData), { expires: 1 });
        Cookies.set('dbname', verifiedSchool);
        await createDatabase(verifiedSchool);
      } catch (err) {
        console.error('❌ Error fetching school:', err);
        dispatch({ type: 'FETCH_ERROR', payload: 'Unable to fetch school details. Please try again later.' });
      }
    };

    fetchSchoolInfo();
  }, [verifiedSchool]);

  return { state, dispatch, school, setSchool };
};
