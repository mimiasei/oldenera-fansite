import React from 'react';

/**
 * GameInfoCard component - A wiki-style information card for game details
 *
 * Inspired by fandom.com wiki pages, this component displays structured game information
 * in a clean, two-column layout with sections for Game Information and Technical Data.
 *
 * Usage examples:
 *
 * // Basic usage with default values
 * <GameInfoCard />
 *
 * // Full customization
 * <GameInfoCard
 *   title="Heroes of Might and Magic: Olden Era"
 *   image="/images/game-cover.jpg"
 *   developer="Unfrozen"
 *   publishers={["Ubisoft", "Hooded Horse"]}
 *   releaseDate="2025 (Early Access)"
 *   quote="A new age of heroes begins..."
 *   status="In Development"
 * />
 *
 * // On different pages (news articles, game database, etc.)
 * <GameInfoCard className="mx-auto max-w-sm" />
 */

interface GameInfoCardProps {
  title?: string;
  image?: string;
  developer?: string;
  publishers?: string[];
  releaseDate?: string;
  genre?: string;
  universe?: string;
  setting?: string;
  platforms?: string[];
  modes?: string[];
  quote?: string;
  quoteAuthor?: string;
  status?: string;
  className?: string;
}

const GameInfoCard: React.FC<GameInfoCardProps> = ({
  title = "Heroes of Might and Magic: Olden Era",
  image,
  developer = "Unfrozen",
  publishers = ["Ubisoft", "Hooded Horse"],
  releaseDate = "2025 (Early Access)",
  genre = "Turn-based strategy",
  universe = "Original universe",
  setting = "Jadame continent",
  platforms = ["Microsoft Windows"],
  modes = ["Single-player", "Multi-player"],
  quote = "A new age of heroes begins...",
  quoteAuthor = "Tarnum",
  status = "In Development",
  className = ""
}) => {
  return (
    <div className={`bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden max-w-sm ${className}`}>
      {/* Header with game image */}
      {image && (
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover"
          />
          {status && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-semibold">
              {status}
            </div>
          )}
        </div>
      )}

      {/* Game title */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 font-fantasy text-center">
          {title}
        </h2>
      </div>

      {/* Quote section */}
      {quote && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <blockquote className="italic text-gray-700 text-sm text-center">
            "{quote}"
            {quoteAuthor && (
              <footer className="mt-2">
                <cite className="text-xs text-gray-500">— {quoteAuthor}</cite>
              </footer>
            )}
          </blockquote>
        </div>
      )}

      {/* Game information grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* Left column - Game Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-1">
              Game Information
            </h3>

            {developer && (
              <div>
                <span className="font-medium text-gray-600">Developer:</span>
                <div className="text-gray-800">{developer}</div>
              </div>
            )}

            {publishers && publishers.length > 0 && (
              <div>
                <span className="font-medium text-gray-600">Publisher{publishers.length > 1 ? 's' : ''}:</span>
                <div className="text-gray-800">{publishers.join(', ')}</div>
              </div>
            )}

            {releaseDate && (
              <div>
                <span className="font-medium text-gray-600">Release:</span>
                <div className="text-gray-800">{releaseDate}</div>
              </div>
            )}

            {genre && (
              <div>
                <span className="font-medium text-gray-600">Genre:</span>
                <div className="text-gray-800">{genre}</div>
              </div>
            )}

            {universe && (
              <div>
                <span className="font-medium text-gray-600">Universe:</span>
                <div className="text-gray-800">{universe}</div>
              </div>
            )}

            {setting && (
              <div>
                <span className="font-medium text-gray-600">Setting:</span>
                <div className="text-gray-800">{setting}</div>
              </div>
            )}
          </div>

          {/* Right column - Technical Data */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-1">
              Technical Data
            </h3>

            {platforms && platforms.length > 0 && (
              <div>
                <span className="font-medium text-gray-600">Platform{platforms.length > 1 ? 's' : ''}:</span>
                <div className="text-gray-800">{platforms.join(', ')}</div>
              </div>
            )}

            {modes && modes.length > 0 && (
              <div>
                <span className="font-medium text-gray-600">Mode{modes.length > 1 ? 's' : ''}:</span>
                <div className="text-gray-800">{modes.join(', ')}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInfoCard;