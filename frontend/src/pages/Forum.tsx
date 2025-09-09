import DisqusComments from '../components/DisqusComments';

const Forum = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-fantasy text-primary-900">
            Community Forum
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Welcome to the Heroes of Might and Magic: Olden Era community hub! 
            Share your thoughts, discuss strategies, ask questions, and connect with fellow fans.
          </p>
          
          {/* Forum Guidelines */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-8 text-left max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-primary-900">Forum Guidelines</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Be respectful and courteous to all community members</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Stay on topic and keep discussions relevant to Heroes of Might and Magic</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>No spam, self-promotion, or excessive off-topic content</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Use appropriate language and avoid offensive content</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-600 mr-2">•</span>
                <span>Search before posting to avoid duplicate discussions</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Popular Topics */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 font-fantasy text-center">Popular Discussion Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2 text-primary-900">Game Strategy</h3>
              <p className="text-gray-600 text-sm">
                Discuss tactics, unit combinations, and winning strategies for different factions.
              </p>
            </div>
            <div className="card p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2 text-primary-900">Faction Discussion</h3>
              <p className="text-gray-600 text-sm">
                Share your thoughts on faction balance, favorite units, and faction-specific strategies.
              </p>
            </div>
            <div className="card p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2 text-primary-900">Game Updates</h3>
              <p className="text-gray-600 text-sm">
                Stay informed about the latest development updates, patches, and new features.
              </p>
            </div>
            <div className="card p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2 text-primary-900">Community Events</h3>
              <p className="text-gray-600 text-sm">
                Participate in tournaments, challenges, and community-organized events.
              </p>
            </div>
            <div className="card p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2 text-primary-900">Technical Support</h3>
              <p className="text-gray-600 text-sm">
                Get help with technical issues, troubleshooting, and game optimization.
              </p>
            </div>
            <div className="card p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2 text-primary-900">General Discussion</h3>
              <p className="text-gray-600 text-sm">
                Open discussions about the game, community, and anything Heroes-related.
              </p>
            </div>
          </div>
        </section>

        {/* Main Forum Discussion */}
        <section className="card p-8">
          <h2 className="text-2xl font-bold mb-6 font-fantasy text-center">Join the Discussion</h2>
          <p className="text-center text-gray-600 mb-8">
            Start or join conversations with the Heroes of Might and Magic: Olden Era community
          </p>
          
          {/* Disqus Forum Embed */}
          <DisqusComments
            url={`${window.location.origin}/forum`}
            identifier="olden-era-forum-main"
            title="Heroes of Might and Magic: Olden Era Community Forum"
          />
        </section>
      </div>
    </div>
  );
};

export default Forum;