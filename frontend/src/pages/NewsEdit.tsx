import { useParams, useNavigate } from 'react-router-dom';
import { useNewsArticle } from '../hooks/useSWR';
import NewsForm from '../components/NewsForm';
import { NewsArticle } from '../types';

const NewsEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const articleId = parseInt(id || '0', 10);
  
  const { article, isLoading, isError } = useNewsArticle(articleId);

  const handleSave = (updatedArticle: NewsArticle) => {
    // Success message could be shown here
    navigate(`/news/${updatedArticle.id}`);
  };

  const handleCancel = () => {
    navigate(`/news/${articleId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Loading article...</p>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-6">The article you're trying to edit doesn't exist.</p>
        <button 
          onClick={() => navigate('/news')}
          className="btn-primary"
        >
          Back to News
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-fantasy">Edit Article</h1>
        <p className="mt-2 text-gray-600">
          Make changes to "{article.title}"
        </p>
      </div>

      <NewsForm article={article} onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
};

export default NewsEdit;