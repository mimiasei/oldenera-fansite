import { useNavigate } from 'react-router-dom';
import NewsForm from '../components/NewsForm';
import { NewsArticle } from '../types';

const NewsCreate = () => {
  const navigate = useNavigate();

  const handleSave = (article: NewsArticle) => {
    // Success message could be shown here
    navigate(`/news/${article.id}`);
  };

  const handleCancel = () => {
    navigate('/admin/news');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-fantasy">Create New Article</h1>
        <p className="mt-2 text-gray-600">
          Write and publish a new news article for the Heroes of Might and Magic: Olden Era community.
        </p>
      </div>

      <NewsForm onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
};

export default NewsCreate;