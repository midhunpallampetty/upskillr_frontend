import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { School } from '../../types/School';

interface EditSchoolFormProps {
  schoolId: string;
  onSuccess?: () => void;
}

const EditSchoolForm: React.FC<EditSchoolFormProps> = ({ schoolId, onSuccess }) => {
  const [formData, setFormData] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const res = await axios.get<{ schools: School[] }>(
          `https://school.upskillr.online/api/getSchools`
        );
        const school = res.data.schools.find((s) => s._id === schoolId);
        if (school) setFormData(school);
      } catch (err) {
        console.error('Error fetching school:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [schoolId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (!formData) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const payload = {
        ...formData,
        _id: schoolId,
      };

      const res = await axios.post(
        'https://school.upskillr.online/api/updateSchoolData',
        payload
      );

      setMsg(res.data.msg);
      onSuccess?.();
    } catch (error) {
      console.error('Update failed:', error);
      setMsg('Failed to update school.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!formData) return <p>School not found.</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Edit School Details</h2>
      {msg && <p className="mb-3 text-green-600">{msg}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="School Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="experience"
          placeholder="Experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="coverImage"
          placeholder="Cover Image URL"
          value={formData.coverImage}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="officialContact"
          placeholder="Contact"
          value={formData.officialContact}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="subDomain"
          placeholder="Subdomain (e.g., modern-school)"
          value={formData.subDomain || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditSchoolForm;
