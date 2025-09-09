import { useEffect } from 'react';

interface DisqusCommentsProps {
  url: string;
  identifier: string;
  title: string;
}

declare global {
  interface Window {
    DISQUS: any;
    disqus_config: () => void;
  }
}

const DisqusComments: React.FC<DisqusCommentsProps> = ({ url, identifier, title }) => {
  const DISQUS_SHORTNAME = 'oldenerafansite';
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  useEffect(() => {
    // Show development placeholder for localhost
    if (isLocalhost) {
      const disqusThread = document.getElementById('disqus_thread');
      if (disqusThread) {
        disqusThread.innerHTML = `
          <div class="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
            <div class="text-amber-600 mb-3">
              <svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-amber-800 mb-3">💬 Community Discussion</h3>
            <p class="text-amber-700 mb-4 max-w-md mx-auto">
              <strong>Development Mode:</strong> This is where Disqus comments will appear in production. 
              The community forum is ready and waiting for your discussions about Heroes of Might and Magic: Olden Era!
            </p>
            <div class="bg-white rounded-md p-4 mb-4 border border-amber-200">
              <p class="text-sm text-gray-700"><strong>Discussion Topic:</strong> ${title}</p>
              <p class="text-xs text-gray-500 mt-1">ID: ${identifier}</p>
            </div>
            <div class="text-sm text-amber-600 space-y-1">
              <p><strong>✨ Coming Soon:</strong></p>
              <p>• User comments and discussions</p>
              <p>• Community moderation</p>
              <p>• Real-time engagement</p>
            </div>
          </div>
        `;
      }
      return;
    }
    // Configure Disqus
    window.disqus_config = function (this: any) {
      this.page.url = url;
      this.page.identifier = identifier;
      this.page.title = title;
    };

    // Load Disqus script if not already loaded
    if (!window.DISQUS) {
      const script = document.createElement('script');
      script.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
      script.setAttribute('data-timestamp', String(Date.now()));
      document.head.appendChild(script);
    } else {
      // Reset Disqus if already loaded
      window.DISQUS.reset({
        reload: true,
        config: window.disqus_config,
      });
    }

    // Cleanup function
    return () => {
      // Remove the disqus thread container content
      const disqusThread = document.getElementById('disqus_thread');
      if (disqusThread) {
        disqusThread.innerHTML = '';
      }
    };
  }, [url, identifier, title, DISQUS_SHORTNAME]);

  return (
    <div className="disqus-container">
      <div id="disqus_thread"></div>
      <noscript>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p className="font-semibold">JavaScript Required</p>
          <p>Please enable JavaScript to view the comments powered by <a href="https://disqus.com/?ref_noscript" className="text-blue-600 hover:underline">Disqus</a>.</p>
        </div>
      </noscript>
    </div>
  );
};

export default DisqusComments;