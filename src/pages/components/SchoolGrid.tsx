import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditSchoolForm from './EditSchoolForm'; // Your form component
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import type { School } from '../types/School';

const SchoolGrid: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [editSchool, setEditSchool] = useState<School | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchSchools = async () => {
    try {
      const res = await axios.get('http://school.localhost:5000/api/getSchools');
      setSchools(res.data.schools || []);
    } catch (err) {
      setError('Failed to fetch schools.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleEditClick = (school: School) => {
    setEditSchool(school);
  };

  const handleViewClick = (school: School) => {
    setSelectedSchool(school);
  };

  const handleUpdateSuccess = () => {
    setEditSchool(null);
    fetchSchools();
  };

  const handleApprove = async (schoolId: string) => {
    try {
      setModalLoading(true);
      setSuccessMessage(null);
  
      const school = schools.find(s => s._id === schoolId);
      if (!school) return;
  console.log(schoolId);
  
      await axios.post(`http://school.localhost:5000/api/updateSchoolData`, {
        _id: schoolId, // Include ID in body
        isVerified: true,
        });
      
  
      // Optimistic update
      setSchools(prev =>
        prev.map(s => s._id === schoolId ? { ...s, isVerified: true } : s)
      );
  
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage('School approved successfully!');
  
      setTimeout(() => {
        setSelectedSchool(null);
        setSuccessMessage(null);
      }, 1500);
    } catch (err) {
      console.error('Approval failed:', err);
      setError('Failed to approve school.');
    } finally {
      setModalLoading(false);
    }
  };
  

  if (loading) return <div className="text-center text-gray-600">Loading schools...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-6">
        {schools.map((school) => (
          <div
            key={school._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
          >
            <div className="relative">
              <img
                src={school.image || 'https://via.placeholder.com/300x200'}
                alt={school.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-0 left-0 w-full bg-blue-600 text-white px-4 py-2 text-lg font-semibold truncate">
                {school.name}
              </div>
            </div>
            <div className="p-4 space-y-3">
              <button
                onClick={() => handleViewClick(school)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View
              </button>
              <button
                onClick={() => handleEditClick(school)}
                className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                ✏️ Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW MODAL */}
      <Transition appear show={!!selectedSchool} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={() => !modalLoading && setSelectedSchool(null)}>
          <div className="min-h-screen flex items-center justify-center p-4 bg-black bg-opacity-50">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl overflow-y-auto max-h-[90vh]">
                {modalLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    <Dialog.Title className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      🏫 {selectedSchool?.name}
                    </Dialog.Title>
                    {successMessage && (
                      <div className="mb-4 p-3 bg-blue-100 text-green-700 rounded-lg text-sm">
                        {successMessage}
                      </div>
                    )}
                    {error && (
                      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <p className="font-semibold text-gray-600">📍 Address</p>
                          <p className="text-sm">{selectedSchool?.address}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">☎️ Contact</p>
                          <p className="text-sm">{selectedSchool?.officialContact}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">📧 Email</p>
                          <p className="text-sm">{selectedSchool?.email}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">📚 Courses</p>
                          <p className="text-sm">{selectedSchool?.coursesOffered.join(', ')}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">🏆 Experience</p>
                          <p className="text-sm">{selectedSchool?.experience} years</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">✅ Verified</p>
                          <p className="text-sm">{selectedSchool?.isVerified ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-600">🔗 Subdomain</p>
                          <p className="text-sm">{selectedSchool?.subDomain || 'Not set'}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="w-full h-32 rounded-lg overflow-hidden shadow-sm">
                          <img
                            src={selectedSchool?.image || 'https://via.placeholder.com/150'}
                            alt="School"
                            className="w-full h-full object-cover"
                          />
                          <p className="text-xs text-center mt-1 text-gray-500">Main Image</p>
                        </div>
                        <div className="w-full h-32 rounded-lg overflow-hidden shadow-sm">
                          <img
                            src={selectedSchool?.coverImage || 'https://via.placeholder.com/150'}
                            alt="Cover"
                            className="w-full h-full object-cover"
                          />
                          <p className="text-xs text-center mt-1 text-gray-500">Cover Image</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                      {!selectedSchool?.isVerified && (
                        <button
                          onClick={() => handleApprove(selectedSchool._id)}
                          disabled={modalLoading}
                          className={`px-4 py-2 bg-green-600 text-white rounded-lg transition ${
                            modalLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                          }`}
                        >
                          ✅ Approve
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedSchool(null)}
                        disabled={modalLoading}
                        className={`px-4 py-2 bg-gray-600 text-white rounded-lg transition ${
                          modalLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
                        }`}
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* EDIT MODAL */}
      <Transition appear={true} show={!!editSchool} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={() => !modalLoading && setEditSchool(null)}>
          <div className="min-h-screen flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-lg">
                <Dialog.Title as="h3" className="text-lg font-semibold text-gray-800 mb-4">
                  ✏️ Edit School - {editSchool?.name}
                </Dialog.Title>
                <EditSchoolForm schoolId={editSchool?._id} onSuccess={handleUpdateSuccess} />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setEditSchool(null)}
                    disabled={modalLoading}
                    className={`px-4 py-2 bg-red-500 text-white rounded-lg transition ${
                      modalLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default React.memo(SchoolGrid);