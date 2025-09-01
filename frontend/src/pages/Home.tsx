import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { newsApi } from '../services/api';
import { NewsArticle } from '../types';

const Home = () => {
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const response = await newsApi.getAll();
        setLatestNews(response.data.slice(0, 3)); // Get latest 3 articles
      } catch (error) {
        console.error('Failed to fetch latest news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="fantasy-gradient text-white py-20 -mt-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 font-fantasy">
            Welcome to the Olden Era
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your ultimate destination for Heroes of Might and Magic: Olden Era news, 
            updates, and community discussion. Stay informed about the return of the 
            legendary strategy series.
          </p>
          <Link to="/news" className="btn-secondary">
            Latest News
          </Link>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest News</h2>
        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600">Loading news...</p>
          </div>
        ) : latestNews.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {latestNews.map((article) => (
              <div key={article.id} className="card hover:shadow-lg transition-shadow duration-200">
                {article.imageUrl && (
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.summary}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                  <Link 
                    to={`/news/${article.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No news articles available yet.</p>
            <p className="text-gray-500">Check back soon for the latest updates!</p>
          </div>
        )}
        
        {latestNews.length > 0 && (
          <div className="text-center mt-8">
            <Link to="/news" className="btn-primary">
              View All News
            </Link>
          </div>
        )}
      </section>

      {/* Game Info Teaser */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">About Olden Era</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
            Heroes of Might and Magic: Olden Era brings back the classic turn-based 
            strategy gameplay that fans have loved for decades. With updated graphics, 
            enhanced mechanics, and new content, it promises to deliver the authentic 
            Heroes experience for a new generation.
          </p>
          <Link to="/game-info" className="btn-secondary">
            Learn More About the Game
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;