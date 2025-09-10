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
          
          {/* Forum Guidelines - Compact */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-8 text-center max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold mb-2 text-primary-900">Community Guidelines</h2>
            <p className="text-gray-700 text-sm">
              Be respectful • Stay on topic • No spam • Use appropriate language • Search before posting
            </p>
          </div>
        </section>

        {/* Main Forum Discussion */}
        <section className="card p-8">
          <h2 className="text-3xl font-bold mb-6 font-fantasy text-center">Community Discussions</h2>
          <p className="text-center text-gray-600 mb-8 text-lg">
            Connect with fellow Heroes fans, share strategies, and discuss the latest updates
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