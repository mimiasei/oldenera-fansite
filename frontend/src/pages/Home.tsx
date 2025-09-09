import { Link } from 'react-router-dom';
import { useLatestNews } from '../hooks/useSWR';

const Home = () => {
  const { latestNews, isLoading, isError } = useLatestNews();

  return (
    <div className="space-y-12 bg-fill bg-center bg-no-repeat"         
         style={{
        backgroundImage: `linear-gradient(rgba(41, 32, 32, 0.85), rgba(69, 52, 52, 0.75)), url('/images/logos/OE_wallpapper.webp')`
    }}>
      {/* Hero Section */}
      <section 
        className="text-white py-20 relative"
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 font-fantasy">
            Welcome to the Olden Wiki
          </h1>
          <p className="text-xl mb-8 max-w-4xl mx-auto leading-8">
            Your ultimate destination for Heroes of Might and Magic: Olden Era news, 
            updates, and community discussion. Stay informed about the return of the 
            legendary strategy series.
          </p>
          <Link to="/news" className="btn btn-secondary fantasy-gradient-dark">
            Latest News
          </Link>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="container rounded-xl mx-auto px-4 py-6" style={{ backgroundColor: `rgba(255, 255, 255, 0.05)`}}>
        <h2 className="text-gray-400 text-3xl font-bold mb-8 text-center">Latest News</h2>
        {isError ? (
          <div className="text-center text-red-400">
            <p>Failed to load news articles</p>
          </div>
        ) : isLoading ? (
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
            <p className="text-gray-200 mb-4">No news articles available yet.</p>
            <p className="text-gray-100">Check back soon for the latest updates!</p>
          </div>
        )}
        
        {latestNews.length > 0 && (
          <div className="text-center mt-8">
            <Link to="/news" className="btn btn-primary">
              View All News
            </Link>
          </div>
        )}
      </section>

      {/* Game Info Teaser */}
      <section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-gray-300 text-3xl font-bold mb-6">About Olden Era</h2>
          <p className="text-lg text-gray-100 max-w-3xl mx-auto mb-8">
            Heroes of Might and Magic: Olden Era brings back the classic turn-based 
            strategy gameplay that fans have loved for decades. With updated graphics, 
            enhanced mechanics and new content, it promises to deliver the authentic 
            Heroes experience for a new generation.
          </p>
          <Link to="/game-info" className="btn btn-secondary fantasy-gradient-dark">
            Learn More About the Game
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;