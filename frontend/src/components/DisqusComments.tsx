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
  const DISQUS_SHORTNAME = 'oldenerafansite'; // This will need to be configured in Disqus

  useEffect(() => {
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