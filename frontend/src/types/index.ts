export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  summary: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  author: string;
  imageUrl?: string;
  tags: string[];
}

export interface Faction {
  id: number;
  name: string;
  description: string;
  summary: string;
  logoUrl?: string;
  bannerUrl?: string;
  backgroundUrl?: string;
  alignment: string;
  specialty: string;
  startingResources?: string;
  factionBonuses?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  sortOrder: number;
  units?: Unit[];
  heroes?: Hero[];
  factionSpells?: FactionSpell[];
}

export interface Unit {
  id: number;
  name: string;
  description: string;
  summary: string;
  imageUrl?: string;
  portraitUrl?: string;
  animationUrl?: string;
  factionId: number;
  faction?: Faction;
  tier: number;
  cost: number;
  resourceCosts?: string;
  attack: number;
  defense: number;
  minDamage: number;
  maxDamage: number;
  health: number;
  speed: number;
  initiative: number;
  size?: string;
  unitType?: string;
  isUpgraded: boolean;
  baseUnitId?: number;
  baseUnit?: Unit;
  upgrades?: Unit[];
  specialAbilities?: string;
  immunities?: string;
  resistances?: string;
  weeklyGrowth: number;
  buildingRequirements?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Spell {
  id: number;
  name: string;
  description: string;
  summary: string;
  iconUrl?: string;
  effectUrl?: string;
  school: string;
  level: number;
  manaCost: number;
  basePower: number;
  type: string;
  target: string;
  duration: string;
  effects?: string;
  requirements?: string;
  isCommon: boolean;
  requiredSkillLevel: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  sortOrder: number;
  factionSpells?: FactionSpell[];
}

export interface FactionSpell {
  id: number;
  factionId: number;
  faction?: Faction;
  spellId: number;
  spell?: Spell;
  isSignatureSpell: boolean;
  modifiedManaCost?: number;
  factionModifications?: string;
}

export interface Hero {
  id: number;
  name: string;
  biography: string;
  summary: string;
  portraitUrl?: string;
  fullImageUrl?: string;
  factionId: number;
  faction?: Faction;
  heroClass: string;
  heroType?: string;
  startingAttack: number;
  startingDefense: number;
  startingSpellPower: number;
  startingKnowledge: number;
  specialty?: string;
  specialtyDescription?: string;
  specialtyEffects?: string;
  startingSkills?: string;
  startingSpells?: string;
  startingArtifacts?: string;
  preferredTerrain?: string;
  rarityLevel: number;
  title?: string;
  background?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  sortOrder: number;
}

export interface GameInfo {
  id: number;
  title: string;
  content: string;
  summary: string;
  category: string;
  slug: string;
  bannerUrl?: string;
  iconUrl?: string;
  imageUrls: string[];
  sortOrder: number;
  isPublished: boolean;
  isFeatured: boolean;
  metaDescription?: string;
  tags: string[];
  relatedFactionIds: number[];
  relatedGameInfoIds: number[];
  createdAt: string;
  updatedAt: string;
  author: string;
}

// API Response interfaces
export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  details?: string;
  statusCode: number;
}

// Filter interfaces
export interface UnitFilters {
  unitTypes: string[];
  tiers: number[];
  factions: { id: number; name: string }[];
}

export interface GameInfoCategory {
  name: string;
  count: number;
  featuredCount: number;
}