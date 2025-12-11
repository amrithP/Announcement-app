import { useAuth } from '../context/AuthContext';

const AnnouncementCard = ({ announcement, isAdmin, onDelete }) => {
  const { user } = useAuth();
  // Check if user can delete (must be admin and owner)
  const canDelete = isAdmin && user && announcement.author && 
    (announcement.author.toString() === user.id || announcement.authorName === user.username);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {announcement.title}
          </h2>
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <span>By {announcement.authorName}</span>
            <span>•</span>
            <span>{formatDate(announcement.createdAt)}</span>
          </div>
        </div>
        {canDelete && (
          <button
            onClick={() => onDelete(announcement._id)}
            className="ml-4 px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
          >
            Delete
          </button>
        )}
      </div>
      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
        {announcement.content}
      </p>
    </div>
  );
};

export default AnnouncementCard;

