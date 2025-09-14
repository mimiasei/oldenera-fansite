import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { factionApi, unitApi, heroApi, spellApi } from '../../services/api';
import Dropdown from '../../components/common/Dropdown';

type GameAssetType = 'factions' | 'units' | 'heroes' | 'spells';
type UnitFilter = 'normal' | 'upgrade1' | 'upgrade2';


interface GameAsset {
  id: number;
  [key: string]: any;
}

const AdminGameAssets: React.FC = () => {
  const { hasRole } = useAuth();
  const [selectedAssetType, setSelectedAssetType] = useState<GameAssetType>('factions');
  const [selectedFaction, setSelectedFaction] = useState<number | null>(null);
  const [unitFilter, setUnitFilter] = useState<UnitFilter>('normal');
  const [assets, setAssets] = useState<GameAsset[]>([]);
  const [factions, setFactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCell, setEditingCell] = useState<{ id: number; field: string } | null>(null);
  const [tempValue, setTempValue] = useState<any>('');

  // Batch editing state
  const [originalAssets, setOriginalAssets] = useState<GameAsset[]>([]); // Store original values
  const [hasChanges, setHasChanges] = useState(false); // Track if any changes exist
  const [savingChanges, setSavingChanges] = useState(false); // Track save operation
  const [validationErrors, setValidationErrors] = useState<{[key: string]: {[field: string]: string}}>({}); // Track validation errors per asset/field
  const [instructionsExpanded, setInstructionsExpanded] = useState(false); // Track instructions panel state

  // Column configurations for each asset type
  const getColumnConfig = (assetType: GameAssetType) => {
    switch (assetType) {
      case 'factions':
        return [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'alignment', label: 'Alignment', type: 'select', options: ['Order', 'Chaos', 'Neutral'] },
          { key: 'specialty', label: 'Specialty', type: 'text' },
          { key: 'summary', label: 'Summary', type: 'textarea' },
          { key: 'logoUrl', label: 'Logo URL', type: 'text' },
          { key: 'bannerUrl', label: 'Banner URL', type: 'text' },
          { key: 'startingResources', label: 'Starting Resources', type: 'json' },
          { key: 'factionBonuses', label: 'Faction Bonuses', type: 'json' },
          { key: 'isActive', label: 'Active', type: 'boolean' },
          { key: 'sortOrder', label: 'Sort', type: 'number' }
        ];
      case 'units':
        return [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'tier', label: 'Tier', type: 'select', options: ['1', '2', '3', '4', '5', '6', '7'] },
          { key: 'cost', label: 'Cost', type: 'number' },
          { key: 'attack', label: 'Attack', type: 'number' },
          { key: 'defense', label: 'Defense', type: 'number' },
          { key: 'minDamage', label: 'Min Dmg', type: 'number' },
          { key: 'maxDamage', label: 'Max Dmg', type: 'number' },
          { key: 'health', label: 'Health', type: 'number' },
          { key: 'speed', label: 'Speed', type: 'number' },
          { key: 'initiative', label: 'Initiative', type: 'number' },
          { key: 'morale', label: 'Morale', type: 'number' },
          { key: 'luck', label: 'Luck', type: 'number' },
          { key: 'unitType', label: 'Type', type: 'select', options: ['Infantry', 'Ranged', 'Cavalry', 'Flying', 'Magic'] },
          { key: 'upgradeLevel', label: 'Upgrade', type: 'select', options: ['0', '1', '2'] },
          { key: 'weeklyGrowth', label: 'Growth', type: 'number' },
          { key: 'specialAbilities', label: 'Abilities', type: 'json' },
          { key: 'isActive', label: 'Active', type: 'boolean' }
        ];
      case 'heroes':
        return [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'biography', label: 'Biography', type: 'textarea' },
          { key: 'heroClass', label: 'Class', type: 'text' },
          { key: 'heroType', label: 'Type', type: 'select', options: ['Might', 'Magic', 'Hybrid'] },
          { key: 'specialty', label: 'Specialty', type: 'text' },
          { key: 'startingAttack', label: 'Attack', type: 'number' },
          { key: 'startingDefense', label: 'Defense', type: 'number' },
          { key: 'startingSpellPower', label: 'Spell Power', type: 'number' },
          { key: 'startingKnowledge', label: 'Knowledge', type: 'number' },
          { key: 'rarityLevel', label: 'Rarity', type: 'select', options: ['1', '2', '3', '4'] },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'startingSkills', label: 'Starting Skills', type: 'json' },
          { key: 'startingSpells', label: 'Starting Spells', type: 'json' },
          { key: 'isActive', label: 'Active', type: 'boolean' }
        ];
      case 'spells':
        return [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'school', label: 'School', type: 'select', options: ['Earth', 'Air', 'Fire', 'Water', 'Light', 'Dark'] },
          { key: 'level', label: 'Level', type: 'select', options: ['1', '2', '3', '4', '5'] },
          { key: 'manaCost', label: 'Mana Cost', type: 'number' },
          { key: 'basePower', label: 'Power', type: 'number' },
          { key: 'type', label: 'Type', type: 'select', options: ['Combat', 'Adventure', 'Global'] },
          { key: 'target', label: 'Target', type: 'select', options: ['Single', 'Area', 'All', 'Self'] },
          { key: 'duration', label: 'Duration', type: 'select', options: ['Instant', 'Combat', 'Permanent', 'Turns'] },
          { key: 'isCommon', label: 'Common', type: 'boolean' },
          { key: 'requiredSkillLevel', label: 'Skill Req', type: 'number' },
          { key: 'effects', label: 'Effects', type: 'json' },
          { key: 'isActive', label: 'Active', type: 'boolean' }
        ];
      default:
        return [];
    }
  };

  // Load factions for unit filtering
  useEffect(() => {
    const loadFactions = async () => {
      try {
        const response = await fetch('/api/faction');
        if (response.ok) {
          const factionData = await response.json();
          setFactions(factionData);
          if (factionData.length > 0 && selectedAssetType === 'units') {
            setSelectedFaction(factionData[0].id);
          }
        }
      } catch (error) {
        console.error('Error loading factions:', error);
      }
    };

    loadFactions();
  }, []);

  // Load assets based on current filters
  useEffect(() => {
    loadAssets();
  }, [selectedAssetType, selectedFaction, unitFilter]);


  const loadAssets = async () => {
    setLoading(true);
    try {
      let data;

      if (selectedAssetType === 'factions') {
        const response = await factionApi.getAll({ activeOnly: false });
        data = response.data;
      } else if (selectedAssetType === 'units' && selectedFaction) {
        const filters: any = {
          factionId: selectedFaction,
          activeOnly: false
        };

        // Filter by upgrade level
        if (unitFilter === 'normal') {
          filters.upgradeLevel = 0;
        } else if (unitFilter === 'upgrade1') {
          filters.upgradeLevel = 1;
        } else if (unitFilter === 'upgrade2') {
          filters.upgradeLevel = 2;
        }

        const response = await unitApi.getAll(filters);
        data = response.data;
      } else if (selectedAssetType === 'heroes' && selectedFaction) {
        const response = await heroApi.getAll({
          factionId: selectedFaction,
          activeOnly: false
        });
        data = response.data;
      } else if (selectedAssetType === 'spells') {
        const response = await spellApi.getAll({ activeOnly: false });
        data = response.data;
      } else {
        data = [];
      }

      const assetData = Array.isArray(data) ? data : [];
      setAssets(assetData);
      setOriginalAssets(JSON.parse(JSON.stringify(assetData))); // Deep copy for original values
      setHasChanges(false); // Reset changes when loading new data
    } catch (error) {
      console.error('Error loading assets:', error);
      setAssets([]);
      setOriginalAssets([]);
      setHasChanges(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = (id: number, field: string, currentValue: any) => {
    setEditingCell({ id, field });
    setTempValue(currentValue || '');
  };

  const handleCellSave = (id: number, field: string, value: any) => {
    // Process value based on type
    let processedValue = value;
    if (field.includes('JSON') || field.includes('Abilities') || field.includes('Skills') || field.includes('Spells') || field.includes('Effects') || field.includes('Resources') || field.includes('Bonuses')) {
      try {
        processedValue = typeof value === 'string' ? JSON.parse(value) : value;
      } catch {
        processedValue = value; // Keep as string if JSON parsing fails
      }
    }

    // Update local state only (no API call yet)
    setAssets(prev => prev.map(a => a.id === id ? { ...a, [field]: processedValue } : a));
    setHasChanges(true); // Mark that changes exist

    setEditingCell(null);
    setTempValue('');
  };

  // Navigate to next cell on Tab key
  const navigateToNextCell = (currentAssetId: number, currentField: string) => {
    const columnConfig = getColumnConfig(selectedAssetType);
    const currentColumnIndex = columnConfig.findIndex(col => col.key === currentField);
    const currentAssetIndex = assets.findIndex(asset => asset.id === currentAssetId);

    if (currentColumnIndex === -1 || currentAssetIndex === -1) return;

    let nextAssetIndex = currentAssetIndex;
    let nextColumnIndex = currentColumnIndex + 1;

    // If we're at the last column, move to first column of next row
    if (nextColumnIndex >= columnConfig.length) {
      nextColumnIndex = 0;
      nextAssetIndex = currentAssetIndex + 1;
    }

    // If we're at the last row, do nothing
    if (nextAssetIndex >= assets.length) return;

    const nextAsset = assets[nextAssetIndex];
    const nextColumn = columnConfig[nextColumnIndex];

    // Start editing the next cell
    handleCellClick(nextAsset.id, nextColumn.key, nextAsset[nextColumn.key]);
  };

  // Client-side validation helper
  const validateAsset = (asset: GameAsset, assetType: GameAssetType) => {
    const errors: {[field: string]: string} = {};

    // Common validations for all asset types
    if (!asset.name || asset.name.trim() === '') {
      errors['name'] = 'Name is required';
    }

    // Asset type-specific validations
    if (assetType === 'factions') {
      if (!asset.description || asset.description.trim() === '') {
        errors['description'] = 'Description is required';
      }
    } else if (assetType === 'units') {
      if (!asset.description || asset.description.trim() === '') {
        errors['description'] = 'Description is required';
      }
    } else if (assetType === 'heroes') {
      if (!asset.biography || asset.biography.trim() === '') {
        errors['biography'] = 'Biography is required';
      }
    } else if (assetType === 'spells') {
      if (!asset.description || asset.description.trim() === '') {
        errors['description'] = 'Description is required';
      }
    }

    return errors;
  };

  const handleSaveChanges = async () => {
    console.log('🚀 handleSaveChanges called with hasChanges:', hasChanges);
    if (!hasChanges) return;

    setSavingChanges(true);
    setValidationErrors({}); // Clear previous validation errors

    try {
      let savedCount = 0;
      let clientValidationErrors: {[key: string]: {[field: string]: string}} = {};

      // Pre-validate all assets on the client side
      for (const asset of assets) {
        if (asset.id < 0 || asset.isNew) {
          const errors = validateAsset(asset, selectedAssetType);
          if (Object.keys(errors).length > 0) {
            clientValidationErrors[asset.id] = errors;
          }
        }
      }

      // If we have client-side validation errors, show them and stop
      if (Object.keys(clientValidationErrors).length > 0) {
        setValidationErrors(clientValidationErrors);
        console.log('❌ Please fix validation errors before saving');
        return;
      }

      for (const asset of assets) {
        // Handle new assets (negative IDs)
        if (asset.id < 0 || asset.isNew) {
          try {
            // Remove temporary fields before creating
            const { id, isNew, ...createData } = asset;
            console.log(`🔄 About to create ${selectedAssetType.slice(0, -1)} with data:`, createData);

            let createdAsset;
            if (selectedAssetType === 'factions') {
              console.log('📤 Calling factionApi.create...');
              const response = await factionApi.create(createData as any);
              createdAsset = response.data;
            } else if (selectedAssetType === 'units') {
              // Fix data types for unit creation
              const unitData = {
                ...createData,
                upgradeLevel: parseInt(createData.upgradeLevel) || 0
              };
              console.log('📤 Calling unitApi.create with fixed data types:', unitData);
              const response = await unitApi.create(unitData as any);
              console.log('📥 Unit creation response:', response);
              createdAsset = response.data;
            } else if (selectedAssetType === 'heroes') {
              const response = await heroApi.create(createData as any);
              createdAsset = response.data;
            } else if (selectedAssetType === 'spells') {
              const response = await spellApi.create(createData as any);
              createdAsset = response.data;
            }

            // Replace temporary asset with created one
            if (createdAsset) {
              setAssets(prev => prev.map(a => a.id === asset.id ? createdAsset : a));
              savedCount++;
            }
          } catch (error: any) {
            console.error(`Failed to create ${selectedAssetType.slice(0, -1)}:`, error);
            console.error('Request payload:', asset);
            console.error('Full error response:', error.response?.data);

            // Handle validation errors
            if (error.response?.status === 400 && error.response?.data) {
              const errorData = error.response.data;
              const assetErrors: {[field: string]: string} = {};

              // Parse ModelState errors (ASP.NET Core validation format)
              if (errorData.errors) {
                Object.keys(errorData.errors).forEach(field => {
                  const fieldName = field.toLowerCase();
                  const errorMessages = errorData.errors[field];
                  if (Array.isArray(errorMessages) && errorMessages.length > 0) {
                    assetErrors[fieldName] = errorMessages[0];
                  }
                });
              }
              // Handle single error message
              else if (typeof errorData === 'string') {
                // Parse common validation patterns
                if (errorData.includes('Name') && errorData.includes('required')) {
                  assetErrors['name'] = 'Name is required';
                }
                if (errorData.includes('Description') && errorData.includes('required')) {
                  assetErrors['description'] = 'Description is required';
                }
                if (errorData.includes('Biography') && errorData.includes('required')) {
                  assetErrors['biography'] = 'Biography is required';
                }
                if (errorData.includes('FactionId') || errorData.includes('faction') || errorData.includes('Faction')) {
                  assetErrors['factionid'] = 'Faction is required';
                }
              }
              // Handle validation problem details format
              else if (errorData.detail || errorData.title) {
                const message = errorData.detail || errorData.title;
                // Try to extract field names from the error message
                if (message.includes('Name')) assetErrors['name'] = 'Name is required';
                if (message.includes('Description')) assetErrors['description'] = 'Description is required';
                if (message.includes('Biography')) assetErrors['biography'] = 'Biography is required';
                if (message.includes('FactionId') || message.includes('faction') || message.includes('Faction')) {
                  assetErrors['factionid'] = 'Faction is required';
                }
              }
              // Handle response with message property
              else if (errorData.message) {
                const message = errorData.message;
                if (message.includes('Name')) assetErrors['name'] = 'Name is required';
                if (message.includes('Description')) assetErrors['description'] = 'Description is required';
                if (message.includes('Biography')) assetErrors['biography'] = 'Biography is required';
                if (message.includes('FactionId') || message.includes('faction') || message.includes('Faction')) {
                  assetErrors['factionid'] = 'Faction is required';
                }
              }

              // Show validation errors on the page
              setValidationErrors(prev => ({
                ...prev,
                [asset.id]: assetErrors
              }));

              // If no specific field errors were parsed, show general error
              if (Object.keys(assetErrors).length === 0) {
                console.error('Unable to parse validation errors. Full error data:', errorData);
                alert(`Validation failed: ${JSON.stringify(errorData)}`);
              }
            } else {
              // Non-validation error
              console.error('Non-validation error:', error);
              alert(`Failed to save: ${error.message || 'Unknown error'}`);
            }

            // Don't throw - continue with other assets but show this error
            continue;
          }
        }
        // Handle existing assets that were modified
        else {
          const original = originalAssets.find(orig => orig.id === asset.id);
          if (original && JSON.stringify(asset) !== JSON.stringify(original)) {
            try {
              if (selectedAssetType === 'factions') {
                await factionApi.update(asset.id, asset);
              } else if (selectedAssetType === 'units') {
                await unitApi.update(asset.id, asset);
              } else if (selectedAssetType === 'heroes') {
                await heroApi.update(asset.id, asset);
              } else if (selectedAssetType === 'spells') {
                await spellApi.update(asset.id, asset);
              }
              savedCount++;
            } catch (error: any) {
              console.error(`Failed to update ${selectedAssetType.slice(0, -1)} ${asset.id}:`, error);

              // Handle validation errors for updates too
              if (error.response?.status === 400 && error.response?.data?.errors) {
                const errorData = error.response.data;
                const assetErrors: {[field: string]: string} = {};

                Object.keys(errorData.errors).forEach(field => {
                  const fieldName = field.toLowerCase();
                  assetErrors[fieldName] = errorData.errors[field][0] || 'Invalid value';
                });

                setValidationErrors(prev => ({
                  ...prev,
                  [asset.id]: assetErrors
                }));
              }
              continue;
            }
          }
        }
      }

      // Update state if we had any successful saves
      if (savedCount > 0) {
        // Refresh data to get the latest state
        await loadAssets();

        if (savedCount === assets.filter(a => a.id < 0 || a.isNew || originalAssets.find(o => o.id === a.id && JSON.stringify(o) !== JSON.stringify(a))).length) {
          // All changes were saved successfully
          setHasChanges(false);
          setValidationErrors({});
        }
      }

      // Show user feedback without popup dialogs
      if (savedCount > 0) {
        // Success - you could add a toast notification here instead
        console.log(`✅ Successfully saved ${savedCount} change(s)`);
      } else {
        // Validation errors are already shown inline, no need for popup
        console.log('❌ Please fix validation errors before saving');
      }
    } catch (error: any) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSavingChanges(false);
    }
  };

  const handleRevertChanges = () => {
    if (!hasChanges) return;

    // Remove any new assets (negative IDs) and revert existing ones to original state
    const revertedAssets = originalAssets.filter(asset => asset.id > 0); // Only keep real assets
    setAssets(JSON.parse(JSON.stringify(revertedAssets))); // Deep copy
    setHasChanges(false);
    setValidationErrors({}); // Clear validation errors
    setEditingCell(null); // Clear any active editing
    setTempValue('');
  };

  const handleCreateNew = () => {
    const columnConfig = getColumnConfig(selectedAssetType);
    const newAsset: any = {
      id: -Date.now(), // Temporary negative ID to distinguish from real assets
      isNew: true // Flag to identify new assets
    };

    // Initialize with empty/default values
    columnConfig.forEach(col => {
      switch (col.type) {
        case 'boolean':
          newAsset[col.key] = col.key === 'isActive' ? true : false;
          break;
        case 'number':
          newAsset[col.key] = 0;
          break;
        case 'json':
          newAsset[col.key] = null;
          break;
        case 'select':
          // Set default select values to empty string (will show validation error if required)
          newAsset[col.key] = '';
          break;
        default:
          newAsset[col.key] = '';
      }
    });

    // Set contextual defaults based on asset type and selected filters
    if (selectedAssetType === 'units') {
      console.log('🔍 Creating unit - selectedFaction:', selectedFaction);
      if (selectedFaction) {
        newAsset.factionId = selectedFaction; // Use the selected faction from the filter
        console.log('✅ Set unit factionId to:', selectedFaction);
      } else {
        console.warn('⚠️ No faction selected for unit creation');
      }
      newAsset.upgradeLevel = unitFilter === 'normal' ? 0 : unitFilter === 'upgrade1' ? 1 : 2;
      newAsset.isUpgraded = unitFilter !== 'normal';
      newAsset.tier = 1;
    } else if (selectedAssetType === 'heroes') {
      console.log('🔍 Creating hero - selectedFaction:', selectedFaction);
      if (selectedFaction) {
        newAsset.factionId = selectedFaction; // Use the selected faction from the filter
        console.log('✅ Set hero factionId to:', selectedFaction);
      } else {
        console.warn('⚠️ No faction selected for hero creation');
      }
      newAsset.rarityLevel = 1;
    }

    console.log('🔍 New asset created:', newAsset);

    // Add to local state only
    setAssets(prev => [newAsset, ...prev]); // Add at beginning for visibility
    setHasChanges(true); // Show save/discard buttons
    setValidationErrors({}); // Clear any existing validation errors
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      // Call appropriate API service
      if (selectedAssetType === 'factions') {
        await factionApi.delete(id);
      } else if (selectedAssetType === 'units') {
        await unitApi.delete(id);
      } else if (selectedAssetType === 'heroes') {
        await heroApi.delete(id);
      } else if (selectedAssetType === 'spells') {
        await spellApi.delete(id);
      }

      // Update local state
      setAssets(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const renderCell = (asset: GameAsset, column: any) => {
    const isEditing = editingCell?.id === asset.id && editingCell?.field === column.key;
    const value = asset[column.key];
    const hasError = validationErrors[asset.id]?.[column.key.toLowerCase()];

    if (isEditing) {
      if (column.type === 'select') {
        return (
          <Dropdown
            value={tempValue}
            onChange={(value) => setTempValue(value)}
            options={column.options || []}
            onBlur={() => handleCellSave(asset.id, column.key, tempValue)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCellSave(asset.id, column.key, tempValue);
              if (e.key === 'Escape') setEditingCell(null);
              if (e.key === 'Tab') {
                e.preventDefault();
                handleCellSave(asset.id, column.key, tempValue);
                setTimeout(() => navigateToNextCell(asset.id, column.key), 50);
              }
            }}
            className="text-sm border-amber-300"
            size="sm"
            autoFocus
            placeholder="Select..."
          />
        );
      }

      if (column.type === 'boolean') {
        return (
          <input
            type="checkbox"
            checked={tempValue}
            onChange={(e) => {
              const newValue = e.target.checked;
              setTempValue(newValue);
              handleCellSave(asset.id, column.key, newValue);
            }}
            className="form-checkbox text-amber-500"
            autoFocus
          />
        );
      }

      if (column.type === 'textarea' || column.type === 'json') {
        return (
          <textarea
            value={typeof tempValue === 'object' ? JSON.stringify(tempValue, null, 2) : tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => handleCellSave(asset.id, column.key, tempValue)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCellSave(asset.id, column.key, tempValue);
              }
              if (e.key === 'Escape') setEditingCell(null);
              if (e.key === 'Tab' && !e.shiftKey) {
                e.preventDefault();
                handleCellSave(asset.id, column.key, tempValue);
                setTimeout(() => navigateToNextCell(asset.id, column.key), 50);
              }
            }}
            className="w-full px-2 py-1 border border-amber-300 rounded text-sm resize-y"
            rows={3}
            autoFocus
          />
        );
      }

      return (
        <input
          type={column.type === 'number' ? 'number' : 'text'}
          value={tempValue}
          onChange={(e) => setTempValue(column.type === 'number' ? Number(e.target.value) : e.target.value)}
          onBlur={() => handleCellSave(asset.id, column.key, tempValue)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCellSave(asset.id, column.key, tempValue);
            if (e.key === 'Escape') setEditingCell(null);
            if (e.key === 'Tab') {
              e.preventDefault();
              handleCellSave(asset.id, column.key, tempValue);
              setTimeout(() => navigateToNextCell(asset.id, column.key), 50);
            }
          }}
          className="w-full px-2 py-1 border border-amber-300 rounded text-sm"
          autoFocus
        />
      );
    }

    // Display mode
    const displayValue = (() => {
      if (column.type === 'boolean') {
        return <input type="checkbox" checked={value} readOnly className="form-checkbox text-amber-500" />;
      }
      if (column.type === 'json') {
        return <span className="text-xs text-gray-600 italic">{value ? 'JSON Data' : 'null'}</span>;
      }
      if (column.type === 'textarea' && typeof value === 'string' && value.length > 30) {
        return <span title={value} className="truncate block">{value.substring(0, 30)}...</span>;
      }
      if (typeof value === 'string' && value.length > 20 && column.type !== 'boolean') {
        return <span title={value} className="truncate block">{value.substring(0, 20)}...</span>;
      }
      return value !== null && value !== undefined ? value : '';
    })();

    return (
      <div className="relative">
        <div
          onClick={() => handleCellClick(asset.id, column.key, value)}
          className={`cursor-pointer hover:bg-amber-50 p-2 min-h-[2rem] flex items-center overflow-hidden group ${
            hasError ? 'border-2 border-red-500 bg-red-50 hover:bg-red-100' : ''
          }`}
          title={hasError ? hasError : undefined}
        >
          {displayValue}
          {hasError && (
            <div className="ml-2 text-red-500 font-bold">!</div>
          )}
        </div>
        {hasError && (
          <div className="absolute z-20 top-full left-0 mt-1 px-3 py-2 bg-red-600 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            {hasError}
            <div className="absolute bottom-full left-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-red-600"></div>
          </div>
        )}
      </div>
    );
  };

  if (!hasRole('Admin') && !hasRole('Moderator')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Access denied. Admin or Moderator role required.
        </div>
      </div>
    );
  }

  const columnConfig = getColumnConfig(selectedAssetType);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-800 mb-2">Manage Game Assets</h1>
        <p className="text-gray-600">Edit game assets with inline editing capabilities</p>
      </div>

      {/* Asset Type Selection */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Asset Type</label>
            <Dropdown
              value={selectedAssetType}
              onChange={(value) => setSelectedAssetType(value as GameAssetType)}
              options={[
                { value: 'factions', label: 'Factions' },
                { value: 'units', label: 'Units' },
                { value: 'heroes', label: 'Heroes' },
                { value: 'spells', label: 'Spells' }
              ]}
            />
          </div>

          {/* Faction Filter for Units and Heroes */}
          {(selectedAssetType === 'units' || selectedAssetType === 'heroes') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Faction</label>
              <Dropdown
                value={selectedFaction || ''}
                onChange={(value) => setSelectedFaction(Number(value))}
                options={factions.map(faction => ({
                  value: faction.id,
                  label: faction.name
                }))}
                placeholder="Select faction..."
              />
            </div>
          )}

          {/* Unit Filter */}
          {selectedAssetType === 'units' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setUnitFilter('normal')}
                  className={`px-4 py-2 rounded-lg ${unitFilter === 'normal' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setUnitFilter('upgrade1')}
                  className={`px-4 py-2 rounded-lg ${unitFilter === 'upgrade1' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Upgrade 1
                </button>
                <button
                  onClick={() => setUnitFilter('upgrade2')}
                  className={`px-4 py-2 rounded-lg ${unitFilter === 'upgrade2' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Upgrade 2
                </button>
              </div>
            </div>
          )}

          <div className="ml-auto">
            <button
              onClick={handleCreateNew}
              className="btn btn-primary"
            >
              Create New {selectedAssetType.slice(0, -1)}
            </button>
          </div>
        </div>
      </div>

      {/* Batch Edit Controls */}
      {hasChanges && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-amber-400 rounded-full mr-2"></div>
                <span className="text-amber-800 font-medium">You have unsaved changes</span>
              </div>
              <span className="text-sm text-amber-600">
                Click Save to apply changes or Revert to discard them
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRevertChanges}
                disabled={savingChanges}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Revert Changes
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={savingChanges}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {savingChanges && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{savingChanges ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assets Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full table-fixed">
              <thead className="bg-amber-50">
                <tr>
                  {columnConfig.map(column => (
                    <th
                      key={column.key}
                      className="text-left p-2 font-semibold text-amber-800 border-b text-sm"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="text-left p-2 font-semibold text-amber-800 border-b text-sm w-16">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id} className="border-b hover:bg-gray-50">
                    {columnConfig.map(column => (
                      <td
                        key={column.key}
                        className="border-r"
                      >
                        {renderCell(asset, column)}
                      </td>
                    ))}
                    <td className="p-2 text-center">
                      {asset.id < 0 || asset.isNew ? (
                        <button
                          onClick={() => {
                            setAssets(prev => prev.filter(a => a.id !== asset.id));
                            setValidationErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors[asset.id];
                              return newErrors;
                            });
                            // Check if we still have changes after removing this asset
                            const remainingNewAssets = assets.filter(a => a.id !== asset.id && (a.id < 0 || a.isNew));
                            const remainingChangedAssets = assets.filter(a => {
                              if (a.id === asset.id || a.id < 0 || a.isNew) return false;
                              const original = originalAssets.find(orig => orig.id === a.id);
                              return original && JSON.stringify(a) !== JSON.stringify(original);
                            });
                            if (remainingNewAssets.length === 0 && remainingChangedAssets.length === 0) {
                              setHasChanges(false);
                            }
                          }}
                          className="text-gray-600 hover:text-gray-800 text-lg p-1 rounded hover:bg-gray-100"
                          title="Discard new asset"
                        >
                          ×
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="text-red-600 hover:text-red-800 text-lg p-1 rounded hover:bg-red-100"
                          title="Delete asset"
                        >
                            ✖
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Instructions - Collapsible */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg">
        <button
          onClick={() => setInstructionsExpanded(!instructionsExpanded)}
          className="w-full text-left p-4 font-semibold text-blue-800 flex items-center justify-between hover:bg-blue-100 rounded-lg"
        >
          <span>Instructions</span>
          <span
            className="flex items-center space-x-2 transition-colors duration-100"
          >
            <svg
                className={`h-4 w-4 transition-transform duration-100 ${instructionsExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        {instructionsExpanded && (
          <div className="px-4 pb-4">
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Click on any cell to edit its value inline</li>
              <li>• Press Enter to save cell value, Escape to cancel editing</li>
              <li>• Changes are stored locally until you click "Save Changes"</li>
              <li>• New assets appear as local rows until saved to database</li>
              <li>• Required fields show red borders with error messages when invalid</li>
              <li>• Use "Revert Changes" to undo all modifications and remove new assets</li>
              <li>• Individual new assets can be discarded using the × icon</li>
              <li>• For JSON fields, enter valid JSON or leave empty for null</li>
              <li>• Use the filters above to narrow down the data view</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGameAssets;