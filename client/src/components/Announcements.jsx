import { useState, useEffect } from 'react';
import axios from 'axios';
import AnnouncementCard from './AnnouncementCard';
import AnnouncementForm from './AnnouncementForm';

const Announcements = ({ isAdmin = false }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/announcements');
      setAnnouncements(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load announcements');
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnouncement = async (title, content) => {
    try {
      const response = await axios.post('/api/announcements', { title, content });
      setAnnouncements([response.data, ...announcements]);
      setShowForm(false);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to create announcement'
      };
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      await axios.delete(`/api/announcements/${id}`);
      setAnnouncements(announcements.filter((ann) => ann._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete announcement');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {isAdmin ? 'Manage Announcements' : 'Announcements'}
        </h1>
        <p className="text-gray-600">
          {isAdmin
            ? 'Create and manage announcements'
            : 'Stay updated with the latest announcements'}
        </p>
      </div>

      {isAdmin && (
        <div className="mb-6">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              + New Announcement
            </button>
          ) : (
            <AnnouncementForm
              onSubmit={handleAddAnnouncement}
              onCancel={() => setShowForm(false)}
            />
          )}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      {announcements.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No announcements yet.</p>
          {isAdmin && (
            <p className="text-gray-400 text-sm mt-2">
              Create your first announcement to get started!
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement._id}
              announcement={announcement}
              isAdmin={isAdmin}
              onDelete={handleDeleteAnnouncement}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;

