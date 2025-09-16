import { useEffect, useState } from 'react';
import { FastCommentsCommentWidget } from 'fastcomments-react';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface FastCommentsWidgetProps {
  url: string;
  identifier: string;
  title: string;
}

interface FastCommentsSsoConfig {
  userDataJSONBase64: string;
  verificationHash: string;
  timestamp: number;
  loginURL: string;
  logoutURL: string;
}

const FastCommentsWidget: React.FC<FastCommentsWidgetProps> = ({ url, identifier, title }) => {
  const { user, isAuthenticated } = useAuth();
  const [ssoConfig, setSsoConfig] = useState<FastCommentsSsoConfig | null>(null);
  const [isLoadingSso, setIsLoadingSso] = useState(false);

  const FASTCOMMENTS_TENANT_ID = import.meta.env.VITE_FASTCOMMENTS_TENANT_ID || 'demo';
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  useEffect(() => {
    // Load SSO configuration if user is authenticated
    if (isAuthenticated && user && !isLocalhost) {
      setIsLoadingSso(true);
      authAPI.getFastCommentsSsoToken()
        .then(response => {
          setSsoConfig(response.data);
        })
        .catch(error => {
          console.log('Could not get FastComments SSO token:', error);
          setSsoConfig(null); // Continue without SSO - users can still comment
        })
        .finally(() => {
          setIsLoadingSso(false);
        });
    }
  }, [isAuthenticated, user, isLocalhost]);

  // Development placeholder for localhost
  if (isLocalhost) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <div className="text-blue-600 mb-3">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-blue-800 mb-3">💬 FastComments Discussion</h3>
        <p className="text-blue-700 mb-4 max-w-md mx-auto">
          <strong>Development Mode:</strong> This is where FastComments will appear in production.
          Enhanced community discussions with real-time features!
        </p>
        <div className="bg-white rounded-md p-4 mb-4 border border-blue-200">
          <p className="text-sm text-gray-700"><strong>Discussion Topic:</strong> {title}</p>
          <p className="text-xs text-gray-500 mt-1">ID: {identifier}</p>
        </div>
        <div className="text-sm text-blue-600 space-y-1">
          <p><strong>✨ FastComments Features:</strong></p>
          <p>• Real-time commenting with SSO</p>
          <p>• Markdown support & code syntax</p>
          <p>• Better mobile experience</p>
          <p>• Enhanced privacy & performance</p>
        </div>
      </div>
    );
  }

  const widgetConfig = {
    tenantId: FASTCOMMENTS_TENANT_ID,
    urlId: identifier,
    url: url,
    ...(ssoConfig && {
      sso: ssoConfig
    })
  };

  return (
    <div className="fastcomments-container">
      {isLoadingSso && (
        <div className="text-center py-4">
          <div className="text-gray-500">Loading comments...</div>
        </div>
      )}
      <FastCommentsCommentWidget {...widgetConfig} />
      <noscript>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p className="font-semibold">JavaScript Required</p>
          <p>Please enable JavaScript to view the comments powered by <a href="https://fastcomments.com" className="text-blue-600 hover:underline">FastComments</a>.</p>
        </div>
      </noscript>
    </div>
  );
};

export default FastCommentsWidget;