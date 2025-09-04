// Available avatar images from the Heroes of Might and Magic: Olden Era theme
export interface AvatarOption {
  id: string;
  name: string;
  category: string;
  filename: string;
  path: string;
}

export const AVAILABLE_AVATARS: AvatarOption[] = [
  // Human Characters
  { id: 'human_01', name: 'Knight', category: 'Human', filename: 'Human_01_nobg.webp', path: '/images/icons/avatars/Human_01_nobg.webp' },
  { id: 'human_02', name: 'Paladin', category: 'Human', filename: 'Human_02_nobg.webp', path: '/images/icons/avatars/Human_02_nobg.webp' },
  { id: 'human_05', name: 'Warrior', category: 'Human', filename: 'Human_05_nobg.webp', path: '/images/icons/avatars/Human_05_nobg.webp' },
  { id: 'human_06', name: 'Archer', category: 'Human', filename: 'Human_06_nobg.webp', path: '/images/icons/avatars/Human_06_nobg.webp' },
  { id: 'human_09', name: 'Mage', category: 'Human', filename: 'Human_09_nobg.webp', path: '/images/icons/avatars/Human_09_nobg.webp' },
  { id: 'human_10', name: 'Cleric', category: 'Human', filename: 'Human_10_nobg.webp', path: '/images/icons/avatars/Human_10_nobg.webp' },
  { id: 'human_11', name: 'Ranger', category: 'Human', filename: 'Human_11_nobg.webp', path: '/images/icons/avatars/Human_11_nobg.webp' },
  { id: 'human_13', name: 'Noble', category: 'Human', filename: 'Human_13_nobg.webp', path: '/images/icons/avatars/Human_13_nobg.webp' },
  { id: 'human_14', name: 'Scholar', category: 'Human', filename: 'Human_14_nobg.webp', path: '/images/icons/avatars/Human_14_nobg.webp' },
  { id: 'human_17', name: 'Captain', category: 'Human', filename: 'Human_17_nobg.webp', path: '/images/icons/avatars/Human_17_nobg.webp' },
  { id: 'human_19', name: 'Priest', category: 'Human', filename: 'Human_19_nobg.webp', path: '/images/icons/avatars/Human_19_nobg.webp' },
  { id: 'human_22', name: 'Guard', category: 'Human', filename: 'Human_22_nobg.webp', path: '/images/icons/avatars/Human_22_nobg.webp' },
  
  // Elven Characters
  { id: 'elf_02', name: 'Elven Mage', category: 'Elf', filename: 'Elf_02_nobg.webp', path: '/images/icons/avatars/Elf_02_nobg.webp' },
  { id: 'elf_03', name: 'Elven Archer', category: 'Elf', filename: 'Elf_03_nobg.webp', path: '/images/icons/avatars/Elf_03_nobg.webp' },
  { id: 'elf_04', name: 'Elven Lord', category: 'Elf', filename: 'Elf_04_nobg.webp', path: '/images/icons/avatars/Elf_04_nobg.webp' },
  
  // Orcish Characters
  { id: 'orc_1', name: 'Orc Warrior', category: 'Orc', filename: 'Orc_1_nobg.webp', path: '/images/icons/avatars/Orc_1_nobg.webp' },
  { id: 'orc_5', name: 'Orc Shaman', category: 'Orc', filename: 'Orc_5_nobg.webp', path: '/images/icons/avatars/Orc_5_nobg.webp' },
  { id: 'orc_7', name: 'Orc Chief', category: 'Orc', filename: 'Orc_7_nobg.webp', path: '/images/icons/avatars/Orc_7_nobg.webp' },
  
  // Demonic Characters
  { id: 'demon_01', name: 'Demon Lord', category: 'Demon', filename: 'Demon_01_nobg.webp', path: '/images/icons/avatars/Demon_01_nobg.webp' },
  { id: 'demon_03', name: 'Infernal Mage', category: 'Demon', filename: 'Demon_03_nobg.webp', path: '/images/icons/avatars/Demon_03_nobg.webp' },
  { id: 'demon_04', name: 'Shadow Warrior', category: 'Demon', filename: 'Demon_04_nobg.webp', path: '/images/icons/avatars/Demon_04_nobg.webp' },
  { id: 'demon_05', name: 'Flame Demon', category: 'Demon', filename: 'Demon_05_nobg.webp', path: '/images/icons/avatars/Demon_05_nobg.webp' },
  { id: 'demon_07', name: 'Dark Sorcerer', category: 'Demon', filename: 'Demon_07_nobg.webp', path: '/images/icons/avatars/Demon_07_nobg.webp' },
  
  // Giant Characters
  { id: 'gigant_01', name: 'Stone Giant', category: 'Giant', filename: 'Gigant_01_nobg.webp', path: '/images/icons/avatars/Gigant_01_nobg.webp' },
  { id: 'gigant_02', name: 'Mountain Giant', category: 'Giant', filename: 'Gigant_02_nobg.webp', path: '/images/icons/avatars/Gigant_02_nobg.webp' },
  { id: 'gigant_04', name: 'Frost Giant', category: 'Giant', filename: 'Gigant_04_nobg.webp', path: '/images/icons/avatars/Gigant_04_nobg.webp' },
  { id: 'gigant_05', name: 'Fire Giant', category: 'Giant', filename: 'Gigant_05_nobg.webp', path: '/images/icons/avatars/Gigant_05_nobg.webp' },
  
  // Undead Characters
  { id: 'undead_05', name: 'Death Knight', category: 'Undead', filename: 'Undead_05_nobg.webp', path: '/images/icons/avatars/Undead_05_nobg.webp' },
  { id: 'undead_07', name: 'Lich', category: 'Undead', filename: 'Undead_07_nobg.webp', path: '/images/icons/avatars/Undead_07_nobg.webp' },
  
  // Creatures
  { id: 'creatures_01', name: 'Dragon', category: 'Creature', filename: 'Creatures_01_nobg.webp', path: '/images/icons/avatars/Creatures_01_nobg.webp' },
  { id: 'creatures_02', name: 'Phoenix', category: 'Creature', filename: 'Creatures_02_nobg.webp', path: '/images/icons/avatars/Creatures_02_nobg.webp' },
  { id: 'creatures_03', name: 'Griffin', category: 'Creature', filename: 'Creatures_03_nobg.webp', path: '/images/icons/avatars/Creatures_03_nobg.webp' },
  { id: 'creatures_04', name: 'Unicorn', category: 'Creature', filename: 'Creatures_04_nobg.webp', path: '/images/icons/avatars/Creatures_04_nobg.webp' },
  { id: 'creatures_05', name: 'Pegasus', category: 'Creature', filename: 'Creatures_05_nobg.webp', path: '/images/icons/avatars/Creatures_05_nobg.webp' },
  { id: 'creatures_06', name: 'Wyvern', category: 'Creature', filename: 'Creatures_06_nobg.webp', path: '/images/icons/avatars/Creatures_06_nobg.webp' },
];

export const getAvatarsByCategory = () => {
  const categories: Record<string, AvatarOption[]> = {};
  
  AVAILABLE_AVATARS.forEach(avatar => {
    if (!categories[avatar.category]) {
      categories[avatar.category] = [];
    }
    categories[avatar.category].push(avatar);
  });
  
  return categories;
};

export const findAvatarByPath = (path: string): AvatarOption | undefined => {
  return AVAILABLE_AVATARS.find(avatar => avatar.path === path);
};

export const getDefaultAvatar = (): AvatarOption => {
  return AVAILABLE_AVATARS[0]; // Default to first human character
};