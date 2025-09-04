import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../hooks/useSWR';
import { NewsFilters } from '../services/api';
import NewsSearch from '../components/NewsSearch';

const News = () => {
  const [filters, setFilters] = useState<NewsFilters>({});
  const { news, isLoading, isError } = useNews(filters);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Loading news articles...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600 text-lg">Failed to load news articles</p>
        <p className="text-sm text-gray-500 mt-2">
          Make sure the ASP.NET Core backend is running: <code className="bg-gray-200 px-2 py-1 rounded">cd backend && dotnet run</code>
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center font-fantasy">
        Latest News
      </h1>
      
      <NewsSearch 
        filters={filters} 
        onFiltersChange={setFilters}
      />
      
      {news.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No news articles available yet.</p>
          <p className="text-gray-500">Check back soon for the latest updates about Heroes of Might and Magic: Olden Era!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {news.map((article) => (
            <article key={article.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col lg:flex-row gap-6">
                {article.imageUrl && (
                  <div className="lg:w-1/3">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-48 lg:h-full object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className={article.imageUrl ? 'lg:w-2/3' : 'w-full'}>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-3 font-fantasy">
                    <Link 
                      to={`/news/${article.id}`}
                      className="hover:text-primary-600 transition-colors duration-200"
                    >
                      {article.title}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {article.summary}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <span>By {article.author}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    
                    <Link 
                      to={`/news/${article.id}`}
                      className="btn btn-primary"
                    >
                      Read Full Article
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;