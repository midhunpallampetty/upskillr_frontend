import React, { useEffect, useState, Fragment, lazy, Suspense } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  Globe,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
  Building2,
  Users,
  Star,
  Clock
} from 'lucide-react';
import type { School } from '../../../school/types/School';
import { getSchools, approveSchool } from '../../../school/api/school.api';

const EditSchoolForm = lazy(() => import('../../../school/components/UI/EditSchoolForm'));

const SchoolGrid: React.FC = () => {
  const [schools, setSchools] = useState<School[] | any[]>([]);
  const [editSchool, setEditSchool] = useState<School | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSchools, setTotalSchools] = useState(0);

  // New state for verification filter: 'all' (undefined in API), 'true', or 'false'
  const [filterVerified, setFilterVerified] = useState<'all' | 'true' | 'false'>('all');

  // New states for date range filter (renamed to match backend param names)
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      // Pass verified as boolean or undefined based on filter
      const verified = filterVerified === 'all' ? undefined : filterVerified === 'true';

      // Handle date range: convert to ISO, adjust toDate to end of day for inclusive filtering
      let from = fromDate ? new Date(fromDate) : undefined;
      let to = toDate ? new Date(toDate) : undefined;

      if (from) {
        from.setHours(0, 0, 0, 0); // Start of the day
        from = from.toISOString();
      } else {
        from = undefined;
      }

      if (to) {
        to.setHours(23, 59, 59, 999); // End of the day
        to = to.toISOString();
      } else {
        to = undefined;
      }

      const { schools, totalPages, total } = await getSchools(
        debouncedSearch,
        sortBy,
        sortOrder,
        page,
        limit,
        verified, // Pass the optional verified param
        from, // Pass adjusted fromDate
        to // Pass adjusted toDate
      );
      setSchools(schools);
      setTotalPages(totalPages);
      setTotalSchools(total || schools.length);
    } catch (err) {
      setError('Failed to fetch schools.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [debouncedSearch, sortBy, sortOrder, page, filterVerified, fromDate, toDate]); // Added fromDate and toDate to dependencies

  const handleEditClick = (school: School) => setEditSchool(school);
  const handleViewClick = (school: School) => setSelectedSchool(school);
  const handleUpdateSuccess = () => {
    setEditSchool(null);
    fetchSchools();
  };

  const handleApprove = async (schoolId: string) => {
    try {
      setModalLoading(true);
      setSuccessMessage(null);
      const school = schools.find((s) => s._id === schoolId);
      if (!school) return;

      await approveSchool(schoolId);

      setSchools((prev) =>
        prev.map((s) => (s._id === schoolId ? { ...s, isVerified: true } : s))
      );

      setSuccessMessage('School approved successfully!');
      setTimeout(() => {
        setSelectedSchool(null);
        setSuccessMessage(null);
      }, 1500);
    } catch (err) {
      console.error('Approval error:', err);
      setError('Failed to approve school.');
    } finally {
      setModalLoading(false);
    }
  };

  const getSortIcon = () => {
    return sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />;
  };

  const getStatusBadge = (isVerified: boolean) => {
    return isVerified ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Verified
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </span>
    );
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 7;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200 sm:px-8">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">
              Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
              <span className="font-medium">{Math.min(page * limit, totalSchools)}</span> of{' '}
              <span className="font-bold text-blue-600">{totalSchools}</span> schools
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px bg-white border border-gray-200" aria-label="Pagination">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-3 py-2 rounded-l-lg border-r border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {pages.map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 border-r border-gray-200 text-sm font-medium transition-colors ${
                    page === pageNum
                      ? 'z-10 bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="relative inline-flex items-center px-3 py-2 rounded-r-lg bg-white text-sm font-medium text-gray-500 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">School Management</h2>
            <p className="text-gray-600 mt-1">Manage and review educational institutions</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalSchools}</div>
              <div className="text-sm text-gray-500">Total Schools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {schools.filter(s => s.isVerified).length}
              </div>
              <div className="text-sm text-gray-500">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {schools.filter(s => !s.isVerified).length}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search schools by name, address, or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt">Date Created</option>
                <option value="name">School Name</option>
                <option value="experience">Experience</option>
                <option value="isVerified">Verification Status</option>
              </select>
            </div>
            
            {/* New: Verification Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterVerified}
                onChange={(e) => {
                  setFilterVerified(e.target.value as 'all' | 'true' | 'false');
                  setPage(1); // Reset to first page on filter change
                }}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="true">Verified</option>
                <option value="false">Pending</option>
              </select>
            </div>
            
            {/* New: Date Range Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="From Date"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="To Date"
              />
            </div>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {getSortIcon()}
              <span className="text-sm">{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* School Grid */}
      <div className="bg-white rounded-lg border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Loading schools...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={fetchSchools}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : schools.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No schools found</p>
              <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {schools.map((school) => (
                  <div
                    key={school._id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-300 hover:scale-105"
                  >
                    <div className="relative">
                      <img
                        src={school.image || 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={school.name}
                        className="w-full h-52 object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        {getStatusBadge(school.isVerified)}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <h3 className="text-white font-semibold text-xl truncate">{school.name}</h3>
                      </div>
                    </div>
                    
                    <div className="p-5 space-y-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{school.address}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Award className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{school.experience} years experience</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{school.email}</span>
                      </div>
                      
                      <div className="flex gap-3 pt-3">
                        <button
                          onClick={() => handleViewClick(school)}
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleEditClick(school)}
                          className="flex-1 flex items-center justify-center gap-2 bg-gray-600 text-white py-2.5 px-4 rounded-lg hover:bg-gray-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Show message when there are fewer than 6 schools */}
              {schools.length < 6 && schools.length > 0 && (
                <div className="mt-8 text-center">
                  <p className="text-gray-500 text-sm">
                    Showing {schools.length} of {totalSchools} schools
                  </p>
                </div>
              )}
            </div>
            
            {totalPages > 1 && renderPagination()}
          </>
        )}
      </div>

      {/* View Modal */}
      <Transition appear show={!!selectedSchool} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => !modalLoading && setSelectedSchool(null)}
        >
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
              <Dialog.Panel className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
                {modalLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : selectedSchool && (
                  <>
                    <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
                      <img
                        src={selectedSchool.coverImage || 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-30"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <h1 className="text-4xl font-bold mb-2">{selectedSchool.name}</h1>
                          <div className="flex items-center justify-center">
                            {getStatusBadge(selectedSchool.isVerified)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8">
                      {successMessage && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg">
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            {successMessage}
                          </div>
                        </div>
                      )}
                      
                      {error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg">
                          <div className="flex items-center">
                            <XCircle className="w-5 h-5 mr-2" />
                            {error}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-gray-900">Address</p>
                                  <p className="text-gray-600">{selectedSchool.address}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-gray-900">Contact</p>
                                  <p className="text-gray-600">{selectedSchool.officialContact}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-gray-900">Email</p>
                                  <p className="text-gray-600">{selectedSchool.email}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex items-start space-x-3">
                                <Award className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-gray-900">Experience</p>
                                  <p className="text-gray-600">{selectedSchool.experience} years</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-3">
                                <Globe className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-gray-900">Subdomain</p>
                                  <p className="text-gray-600">{selectedSchool.subDomain || 'Not set'}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-start space-x-3">
                                <Calendar className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-gray-900">Created</p>
                                  <p className="text-gray-600">
                                    {new Date(selectedSchool.createdAt || Date.now()).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-medium text-gray-900 mb-3">School Images</h3>
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-gray-600 mb-2">Main Image</p>
                                <img
                                  src={selectedSchool.image || 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=300'}
                                  alt="School"
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-2">Cover Image</p>
                                <img
                                  src={selectedSchool.coverImage || 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=300'}
                                  alt="Cover"
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-8 flex justify-end gap-3">
                        {!selectedSchool.isVerified && (
                          <button
                            onClick={() => handleApprove(selectedSchool._id)}
                            disabled={modalLoading}
                            className={`flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium transition-colors ${
                              modalLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                            }`}
                          >
                            <CheckCircle className="w-5 h-5" />
                            Approve School
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedSchool(null)}
                          disabled={modalLoading}
                          className={`px-6 py-3 bg-gray-600 text-white rounded-lg font-medium transition-colors ${
                            modalLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
                          }`}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Modal */}
      <Transition appear show={!!editSchool} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => !modalLoading && setEditSchool(null)}
        >
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
              <Dialog.Panel className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                  <Dialog.Title as="h3" className="text-xl font-semibold text-white flex items-center gap-2">
                    <Edit3 className="w-6 h-6" />
                    Edit School - {editSchool?.name}
                  </Dialog.Title>
                </div>
                
                <div className="p-6">
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  }>
                    <EditSchoolForm schoolId={editSchool?._id} onSuccess={handleUpdateSuccess} />
                  </Suspense>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setEditSchool(null)}
                      disabled={modalLoading}
                      className={`px-6 py-3 bg-gray-600 text-white rounded-lg font-medium transition-colors ${
                        modalLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default React.memo(SchoolGrid);
