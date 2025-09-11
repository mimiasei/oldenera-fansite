import React from 'react';
import { Link } from 'react-router-dom';
import { useFactions } from '../hooks/useSWR';
import { FactionGridSkeleton } from '../components/skeletons/FactionSkeleton';
import AdminEditButton from '../components/AdminEditButton';

const Factions: React.FC = () => {
  const { factions, isLoading, isError, error } = useFactions({ includeUnits: true, includeHeroes: true });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-5xl font-bold mb-6 font-fantasy">Factions</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Discover the mighty factions of Olden Era, each with their unique strengths, 
              legendary heroes, and powerful armies ready for battle.
            </p>
          </div>
        </div>

        {/* Skeleton Grid */}
        <div className="container mx-auto px-4 py-12">
          <FactionGridSkeleton count={3} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-red-400 mb-2">Failed to Load Factions</h2>
              <p className="text-red-300 mb-4">
                {error?.message || 'Unable to load faction data. Please ensure the backend server is running.'}
              </p>
              <p className="text-sm text-gray-400">
                Please check your internet connection and try refreshing the page.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold mb-6 font-fantasy">Factions</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Discover the mighty factions of Olden Era, each with their unique strengths, 
            legendary heroes, and powerful armies ready for battle.
          </p>
        </div>
      </div>

      {/* Factions Grid */}
      <div className="container mx-auto px-4 py-12">
        {factions.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-gray-300 mb-4">No Factions Available</h3>
              <p className="text-gray-400">
                Faction data will be available once the game information system is populated.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {factions.map((faction) => (
              <div key={faction.id} className="relative">
                {/* Admin Edit Button */}
                <div className="absolute top-2 right-2 z-10">
                  <AdminEditButton to={`/admin/factions/${faction.id}/edit`} />
                </div>
                
                <Link
                  to={`/factions/${faction.id}`}
                  className="group block"
                >
                  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                    {/* Faction Banner/Logo */}
                    <div className="relative h-48 bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center">
                    {faction.logoUrl || faction.bannerUrl ? (
                      <img
                        src={faction.logoUrl || faction.bannerUrl}
                        alt={`${faction.name} emblem`}
                        className="max-h-32 max-w-32 object-contain"
                      />
                    ) : (
                      <div className="text-6xl font-fantasy text-primary-200">
                        {faction.name.charAt(0)}
                      </div>
                    )}
                    
                    {/* Alignment Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        faction.alignment === 'Order' 
                          ? 'bg-blue-600 text-blue-100' 
                          : faction.alignment === 'Chaos'
                          ? 'bg-red-600 text-red-100'
                          : 'bg-purple-600 text-purple-100'
                      }`}>
                        {faction.alignment}
                      </span>
                    </div>
                  </div>

                  {/* Faction Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 font-fantasy group-hover:text-primary-400 transition-colors">
                      {faction.name}
                    </h3>
                    
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {faction.summary || faction.description}
                    </p>

                    {/* Specialty */}
                    {faction.specialty && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-primary-400">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">Specialty:</span>
                        </div>
                        <p className="text-gray-300 text-sm ml-6">{faction.specialty}</p>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex justify-between items-center text-sm text-gray-400 border-t border-gray-700 pt-4">
                      <div className="flex gap-4">
                        {faction.units && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                            </svg>
                            {faction.units.length} Units
                          </span>
                        )}
                        {faction.heroes && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                            </svg>
                            {faction.heroes.length} Heroes
                          </span>
                        )}
                      </div>
                      
                      <span className="text-primary-400 group-hover:text-primary-300">
                        Learn More →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Factions;