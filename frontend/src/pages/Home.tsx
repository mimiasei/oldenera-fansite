import { Link } from 'react-router-dom';
import { useLatestNews } from '../hooks/useSWR';
import { NewsCardSkeleton } from '../components/skeletons/NewsArticleSkeleton';
import SEO from '../components/SEO';
import { generateWebsiteStructuredData, generateGameStructuredData } from '../utils/structuredData';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const { latestNews, isLoading, isError } = useLatestNews();
  const { theme } = useTheme();

  const websiteStructuredData = generateWebsiteStructuredData();
  const gameStructuredData = generateGameStructuredData();

  // Theme-based background overlay
  const backgroundOverlay = theme === 'dark'
    ? 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7))'
    : 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.7))';

  const backgroundStyle = {
    backgroundImage: `${backgroundOverlay}, url('/images/logos/OE_wallpapper.webp')`
  };

  return (
    <>
      <SEO
        title="Home"
        description="Your destination for Heroes of Might and Magic: Olden Era news, updates, and community discussion. Stay informed about the return of the legendary strategy series."
        keywords="Heroes of Might and Magic, Olden Era, olden era wiki, homm oe, homm oe wiki, hommoe, hommoe wiki, strategy games, fantasy games, turn-based strategy, news, community"
        url="/"
        structuredData={[websiteStructuredData, gameStructuredData]}
      />
    <div className="space-y-12 bg-fill bg-center bg-no-repeat"
         style={backgroundStyle}>
      {/* Hero Section */}
      <section
        className={`${theme === 'dark' ? 'text-white' : 'text-black'} pt-12 py-4 relative`}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6 font-fantasy">
            Welcome to the Olden Wiki
          </h1>
          <p className="text-lg mb-8 max-w-4xl mx-auto leading-8">
            Your ultimate destination for Heroes of Might and Magic: Olden Era news, 
            updates, and community discussion. Stay informed about the return of the 
            legendary strategy series.
          </p>
          <Link to="/news" className="btn btn-secondary">
            Latest News
          </Link>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="container rounded-xl mx-auto px-4 py-6" style={{ backgroundColor: `rgba(255, 255, 255, 0.05)`}}>
        <h2 className="text-gray-500 dark:text-gray-300 text-3xl font-bold mb-8 text-center">Latest News</h2>
        {isError ? (
          <div className="text-center text-red-400">
            <p>Failed to load news articles</p>
          </div>
        ) : isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }, (_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
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
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{article.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{article.summary}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                  <Link 
                    to={`/news/${article.id}`}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-300 mb-4">No news articles available yet.</p>
            <p className="text-gray-400 dark:text-gray-200">Check back soon for the latest updates!</p>
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
          <h2 className="text-gray-500 dark:text-gray-200 text-3xl font-bold mb-6">About Olden Era</h2>
          <p className="text-lg text-gray-500 bg-gray-300/60 dark:bg-gray-700/60 rounded-lg p-4 dark:text-gray-200 max-w-4xl mx-auto mb-8">
            Heroes of Might and Magic: Olden Era brings back the classic turn-based 
            strategy gameplay that fans have loved for decades. With updated graphics, 
            enhanced mechanics and new content, it promises to deliver the authentic 
            Heroes experience for a new generation.
          </p>
          <Link to="/game-info" className="btn btn-secondary">
            Learn More About the Game
          </Link>
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;