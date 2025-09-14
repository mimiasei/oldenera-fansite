import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFaction, useFactionUnits, useFactionHeroes } from '../hooks/useSWR';
import { UnitCardSkeleton } from '../components/skeletons/FactionSkeleton';
import { SkeletonText, Skeleton } from '../components/ui/Skeleton';
import AdminEditButton from '../components/AdminEditButton';

const FactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const factionId = parseInt(id || '0', 10);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'units' | 'heroes'>('overview');
  const [unitFilter, setUnitFilter] = useState<{ tier?: number; unitType?: string }>({});
  const [heroFilter, setHeroFilter] = useState<{ heroClass?: string }>({});

  const { faction, isLoading: factionLoading, isError: factionError, error: factionErrorMsg } = useFaction(
    factionId, 
    { includeUnits: true, includeHeroes: true, includeSpells: true }
  );
  
  const { units, isLoading: unitsLoading } = useFactionUnits(
    factionId, 
    unitFilter.tier, 
    unitFilter.unitType
  );
  
  const { heroes, isLoading: heroesLoading } = useFactionHeroes(
    factionId, 
    heroFilter.heroClass
  );

  if (factionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb skeleton */}
          <div className="mb-6">
            <Skeleton height="20px" className="w-48" />
          </div>

          {/* Hero section skeleton */}
          <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
            <div className="h-64 bg-gradient-to-r from-primary-900 to-primary-800 flex items-center justify-center">
              <Skeleton height="128px" className="w-32 rounded-lg" />
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton height="40px" className="w-64" />
                <Skeleton height="24px" className="w-20 rounded-full" />
              </div>
              <SkeletonText lines={2} className="mb-6" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton height="48px" className="rounded-lg" />
                <Skeleton height="48px" className="rounded-lg" />
                <Skeleton height="48px" className="rounded-lg" />
              </div>
            </div>
          </div>

          {/* Tab skeleton */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex gap-4 mb-6">
              <Skeleton height="40px" className="w-24 rounded-md" />
              <Skeleton height="40px" className="w-20 rounded-md" />
              <Skeleton height="40px" className="w-20 rounded-md" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 4 }, (_, i) => (
                <UnitCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (factionError || !faction) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-red-400 mb-2">Faction Not Found</h2>
              <p className="text-red-300 mb-4">
                {factionErrorMsg?.message || 'The requested faction could not be loaded.'}
              </p>
              <Link 
                to="/factions" 
                className="btn btn-primary"
              >
                ← Back to Factions
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getTierName = (tier: number) => {
    const tierNames = ['', '1', '2', '3', '4', '5', '6', '7'];
    return tierNames[tier] || `Tier ${tier}`;
  };

  const getAlignmentColor = (alignment: string) => {
    switch (alignment) {
      case 'Order': return 'text-blue-400 bg-blue-900/30';
      case 'Chaos': return 'text-red-400 bg-red-900/30';
      case 'Neutral': return 'text-purple-400 bg-purple-900/30';
      default: return 'text-gray-400 bg-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Breadcrumb */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex text-sm text-gray-400">
            <Link to="/" className="hover:text-primary-400">Home</Link>
            <span className="mx-2">›</span>
            <Link to="/factions" className="hover:text-primary-400">Factions</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-300">{faction.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        {faction.backgroundUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${faction.backgroundUrl})` }}
          />
        )}
        <div className="relative bg-gradient-to-r from-primary-900/90 to-primary-800/90 text-white">
          <div className="container mx-auto px-4 py-16 relative">
            {/* Admin Edit Button */}
            <div className="absolute top-4 right-4">
              <AdminEditButton to={`/admin/factions/${faction.id}/edit`} />
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Faction Logo */}
              <div className="flex-shrink-0">
                {faction.logoUrl ? (
                  <img
                    src={faction.logoUrl}
                    alt={`${faction.name} emblem`}
                    className="w-32 h-32 object-contain"
                  />
                ) : (
                  <div className="w-32 h-32 bg-primary-700 rounded-full flex items-center justify-center">
                    <span className="text-6xl font-fantasy text-primary-200">
                      {faction.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Faction Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-4 justify-center md:justify-start mb-4">
                  <h1 className="text-5xl font-bold font-fantasy">{faction.name}</h1>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getAlignmentColor(faction.alignment)}`}>
                    {faction.alignment}
                  </span>
                </div>
                
                <p className="text-xl text-primary-100 mb-6 max-w-3xl">
                  {faction.summary}
                </p>

                {/* Key Stats */}
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  {faction.specialty && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-300">{faction.specialty}</div>
                      <div className="text-sm text-primary-200">Specialty</div>
                    </div>
                  )}
                  {faction.units && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-300">{faction.units.length}</div>
                      <div className="text-sm text-primary-200">Units</div>
                    </div>
                  )}
                  {faction.heroes && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-300">{faction.heroes.length}</div>
                      <div className="text-sm text-primary-200">Heroes</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <nav className="flex">
            {[
              { key: 'overview', label: 'Overview', count: null },
              { key: 'units', label: 'Units', count: faction.units?.length },
              { key: 'heroes', label: 'Heroes', count: faction.heroes?.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 px-2 py-1 bg-gray-700 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-12">
        {activeTab === 'overview' && (
          <div className="max-w-4xl mx-auto">
            {/* Description */}
            <div className="bg-gray-800 rounded-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-white mb-6 font-fantasy">About {faction.name}</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed text-lg">
                  {faction.description}
                </p>
              </div>
            </div>

            {/* Faction Details Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Starting Resources */}
              {faction.startingResources && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Starting Resources
                  </h3>
                  <p className="text-gray-300">{faction.startingResources}</p>
                </div>
              )}

              {/* Faction Bonuses */}
              {faction.factionBonuses && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    Faction Bonuses
                  </h3>
                  <p className="text-gray-300">{faction.factionBonuses}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'units' && (
          <div>
            {/* Unit Filters */}
            <div className="mb-8 bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Filter Units</h3>
              <div className="flex flex-wrap gap-4">
                <select
                  value={unitFilter.tier || ''}
                  onChange={(e) => setUnitFilter({ ...unitFilter, tier: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="bg-gray-700 border border-gray-600 text-white rounded px-3 py-2"
                >
                  <option value="">All Tiers</option>
                  {[1, 2, 3, 4, 5, 6, 7].map(tier => (
                    <option key={tier} value={tier}>{getTierName(tier)}</option>
                  ))}
                </select>

                <select
                  value={unitFilter.unitType || ''}
                  onChange={(e) => setUnitFilter({ ...unitFilter, unitType: e.target.value || undefined })}
                  className="bg-gray-700 border border-gray-600 text-white rounded px-3 py-2"
                >
                  <option value="">All Types</option>
                  <option value="Infantry">Infantry</option>
                  <option value="Cavalry">Cavalry</option>
                  <option value="Ranged">Ranged</option>
                  <option value="Flying">Flying</option>
                  <option value="Magic">Magic</option>
                </select>

                {(unitFilter.tier || unitFilter.unitType) && (
                  <button
                    onClick={() => setUnitFilter({})}
                    className="btn btn-secondary"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Units Grid */}
            {unitsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto"></div>
                <p className="mt-2 text-gray-400">Loading units...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {units.map((unit) => (
                  <div key={unit.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
                    {unit.portraitUrl && (
                      <div className="h-48 bg-gray-700 flex items-center justify-center">
                        <img
                          src={unit.portraitUrl}
                          alt={unit.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-white">{unit.name}</h4>
                        <span className="px-2 py-1 bg-primary-600 text-primary-100 rounded text-sm">
                          {getTierName(unit.tier)}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {unit.summary || unit.description}
                      </p>

                      {/* Unit Stats */}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Attack:</span>
                          <span className="text-white font-semibold">{unit.attack}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Defense:</span>
                          <span className="text-white font-semibold">{unit.defense}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Damage:</span>
                          <span className="text-white font-semibold">{unit.minDamage}-{unit.maxDamage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Health:</span>
                          <span className="text-white font-semibold">{unit.health}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Speed:</span>
                          <span className="text-white font-semibold">{unit.speed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Cost:</span>
                          <span className="text-primary-400 font-semibold">{unit.cost}</span>
                        </div>
                      </div>

                      {unit.specialAbilities && (
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <p className="text-xs text-primary-400 font-medium">Special Abilities</p>
                          <p className="text-xs text-gray-300 mt-1">{unit.specialAbilities}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {units.length === 0 && !unitsLoading && (
              <div className="text-center py-8">
                <p className="text-gray-400">No units found matching the current filters.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'heroes' && (
          <div>
            {/* Hero Filters */}
            <div className="mb-8 bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Filter Heroes</h3>
              <div className="flex flex-wrap gap-4">
                <select
                  value={heroFilter.heroClass || ''}
                  onChange={(e) => setHeroFilter({ heroClass: e.target.value || undefined })}
                  className="bg-gray-700 border border-gray-600 text-white rounded px-3 py-2"
                >
                  <option value="">All Classes</option>
                  <option value="Might">Might</option>
                  <option value="Magic">Magic</option>
                  <option value="Hybrid">Hybrid</option>
                </select>

                {heroFilter.heroClass && (
                  <button
                    onClick={() => setHeroFilter({})}
                    className="btn btn-secondary"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Heroes Grid */}
            {heroesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto"></div>
                <p className="mt-2 text-gray-400">Loading heroes...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {heroes.map((hero) => (
                  <div key={hero.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
                    {hero.portraitUrl && (
                      <div className="h-48 bg-gray-700 flex items-center justify-center">
                        <img
                          src={hero.portraitUrl}
                          alt={hero.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-white">{hero.name}</h4>
                        <span className="px-2 py-1 bg-secondary-600 text-secondary-100 rounded text-sm">
                          {hero.heroClass}
                        </span>
                      </div>
                      
                      {hero.title && (
                        <p className="text-primary-400 text-sm font-medium mb-2">{hero.title}</p>
                      )}
                      
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {hero.summary || hero.biography}
                      </p>

                      {/* Starting Stats */}
                      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Attack:</span>
                          <span className="text-white font-semibold">{hero.startingAttack}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Defense:</span>
                          <span className="text-white font-semibold">{hero.startingDefense}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Spell Power:</span>
                          <span className="text-white font-semibold">{hero.startingSpellPower}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Knowledge:</span>
                          <span className="text-white font-semibold">{hero.startingKnowledge}</span>
                        </div>
                      </div>

                      {/* Specialty */}
                      {hero.specialty && (
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <p className="text-xs text-primary-400 font-medium">Specialty: {hero.specialty}</p>
                          {hero.specialtyDescription && (
                            <p className="text-xs text-gray-300 mt-1">{hero.specialtyDescription}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {heroes.length === 0 && !heroesLoading && (
              <div className="text-center py-8">
                <p className="text-gray-400">No heroes found matching the current filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FactionDetail;