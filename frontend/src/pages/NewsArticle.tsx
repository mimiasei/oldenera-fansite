import { useParams, Link, useNavigate } from 'react-router-dom';
import { useNewsArticle } from '../hooks/useSWR';
import DisqusComments from '../components/DisqusComments';

const NewsArticle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const articleId = parseInt(id || '0', 10);
  
  const { article, isLoading, isError } = useNewsArticle(articleId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <div className="space-x-4">
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
            >
              Go Back
            </button>
            <Link to="/news" className="btn btn-primary">
              View All News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>›</span>
            <Link to="/news" className="hover:text-primary-600 transition-colors">News</Link>
            <span>›</span>
            <span className="text-gray-700">{article.title}</span>
          </div>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-fantasy leading-tight">
            {article.title}
          </h1>

          {/* Summary */}
          <p className="text-xl text-gray-700 mb-6 leading-relaxed">
            {article.summary}
          </p>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">By {article.author}</span>
            </div>
            <div className="text-sm text-gray-500">
              Published on {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            {article.updatedAt !== article.createdAt && (
              <div className="text-sm text-gray-500">
                Updated {new Date(article.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="mb-8">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-64 lg:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div 
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }}
          />
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
              >
                ← Back
              </button>
              <Link to="/news" className="btn btn-primary">
                More News
              </Link>
            </div>
          </div>
        </footer>

        {/* Comments Section */}
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-6 font-fantasy">Comments</h2>
          <DisqusComments
            url={`${window.location.origin}/news/${article.id}`}
            identifier={`news-article-${article.id}`}
            title={article.title}
          />
        </section>
      </div>
    </div>
  );
};

export default NewsArticle;