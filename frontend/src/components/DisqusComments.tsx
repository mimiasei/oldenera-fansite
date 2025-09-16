import { useEffect, useState } from 'react';

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
  const [hideReactions, setHideReactions] = useState(true);

  // Function to inject CSS into Disqus iframe
  const injectDisqusCSS = () => {
    setTimeout(() => {
      const iframe = document.querySelector('iframe[src*="disqus.com/embed"]') as HTMLIFrameElement;
      if (iframe && iframe.contentDocument) {
        try {
          const style = iframe.contentDocument.createElement('style');
          style.textContent = `
            .post-reactions,
            [class*="reactions"],
            [data-role="reactions"],
            .thread-reactions,
            [class*="voting"],
            .vote-buttons {
              display: none !important;
            }
          `;
          iframe.contentDocument.head.appendChild(style);
        } catch (e) {
          // Cross-origin restrictions - try alternative approach
          console.log('Cannot access iframe content, using message passing');
        }
      }
    }, 2000);
  };

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

            <!-- Mock Disqus Comments -->
            <div class="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <div class="text-left space-y-4">
                <div class="text-sm text-gray-500">Mock Comment Thread:</div>
                <div class="border-l-2 border-blue-200 pl-3">
                  <div class="text-sm font-medium text-gray-800">User123</div>
                  <div class="text-sm text-gray-600 mt-1">This looks amazing! Can't wait for the full release!</div>
                </div>
              </div>
            </div>

            <!-- Mock Disqus Reactions (what we're testing) -->
            <div id="reactions__container" class="${hideReactions ? 'hidden' : ''} bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <div id="reactions" class="reactions-refresh" role="toolbar" aria-label="What do you think? ,0, Responses">
                <div class="text-bold text-center text-sm font-semibold text-gray-700 mb-2">What do you think?</div>
                <div class="text-center text-sm text-gray-500 mb-3">0 Responses</div>
                <div class="reaction-items flex justify-center space-x-4">
                  <div class="reaction-item text-center">
                    <div class="reaction-item__button cursor-pointer hover:bg-gray-50 p-2 rounded" tabindex="0" role="button" aria-label="Upvote, 0 votes" aria-pressed="false">
                      <div class="reaction-item__image-wrapper mb-1">
                        <div class="w-6 h-6 mx-auto bg-green-100 rounded-full flex items-center justify-center">👍</div>
                      </div>
                      <div class="reaction-vote text-xs text-gray-500">0</div>
                      <div class="reaction-item__text text-xs text-gray-600">Upvote</div>
                    </div>
                  </div>
                  <div class="reaction-item text-center">
                    <div class="reaction-item__button cursor-pointer hover:bg-gray-50 p-2 rounded" tabindex="0" role="button" aria-label="Funny, 0 votes" aria-pressed="false">
                      <div class="reaction-item__image-wrapper mb-1">
                        <div class="w-6 h-6 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">😂</div>
                      </div>
                      <div class="reaction-vote text-xs text-gray-500">0</div>
                      <div class="reaction-item__text text-xs text-gray-600">Funny</div>
                    </div>
                  </div>
                  <div class="reaction-item text-center">
                    <div class="reaction-item__button cursor-pointer hover:bg-gray-50 p-2 rounded" tabindex="0" role="button" aria-label="Love, 0 votes" aria-pressed="false">
                      <div class="reaction-item__image-wrapper mb-1">
                        <div class="w-6 h-6 mx-auto bg-red-100 rounded-full flex items-center justify-center">❤️</div>
                      </div>
                      <div class="reaction-vote text-xs text-gray-500">0</div>
                      <div class="reaction-item__text text-xs text-gray-600">Love</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-sm text-amber-600 space-y-1">
              <p><strong>✨ Testing Features:</strong></p>
              <p>• Toggle button to hide/show reactions above</p>
              <p>• Mock reactions section mimics real Disqus structure</p>
              <p>• Ready for production testing</p>
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

    // Inject CSS to hide reactions if needed
    if (hideReactions) {
      injectDisqusCSS();
    }

    // Cleanup function
    return () => {
      // Remove the disqus thread container content
      const disqusThread = document.getElementById('disqus_thread');
      if (disqusThread) {
        disqusThread.innerHTML = '';
      }
    };
  }, [url, identifier, title, DISQUS_SHORTNAME, hideReactions]);

  // Effect to handle reaction visibility changes
  useEffect(() => {
    if (!isLocalhost && hideReactions) {
      injectDisqusCSS();
    }

    // Handle localhost mock reactions visibility
    if (isLocalhost) {
      const mockReactions = document.getElementById('reactions__container');
      if (mockReactions) {
        if (hideReactions) {
          mockReactions.classList.add('hidden');
        } else {
          mockReactions.classList.remove('hidden');
        }
      }
    }
  }, [hideReactions, isLocalhost]);

  return (
    <div className={`disqus-container ${hideReactions ? 'hide-reactions' : ''}`}>
        <div className="flex justify-end items-center mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Reactions:</span>
          <button
            onClick={() => setHideReactions(!hideReactions)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded transition-colors"
            title={hideReactions ? "Show reactions" : "Hide reactions"}
          >
            {hideReactions ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
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