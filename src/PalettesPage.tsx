import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from './AuthContext';
import axios from 'axios';

interface Color {
  red: number;
  green: number;
  blue: number;
}

interface Palette {
  id: number;
  name?: string;
  colors?: Color[];
  hexcodes?: string;
  created_at?: string;
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://wheelback.onrender.com'
  : 'http://localhost:10000';

const PalettesPage: React.FC = () => {
  const { user } = useAuth();
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPaletteId, setEditingPaletteId] = useState<number | null>(null);
  const [paletteNameChanges, setPaletteNameChanges] = useState<{ [key: number]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedPaletteId, setSelectedPaletteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPalettes = async () => {
      if (!user) {
        console.log('Waiting for user data...');
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching palettes for user:', user);
        const response = await axios.get<Palette[]>(`${API_BASE_URL}/api/palettes/${user.userId}`);
        
        console.log('Raw response:', response);
        console.log('Raw palette data:', response.data);

        // Update validation to check for either colors array or hexcodes
        const validPalettes = response.data.filter(palette => {
          const isValid = palette && (
            (palette.colors && palette.colors.length > 0) || 
            (palette.hexcodes && palette.hexcodes.length > 0)
          );
          if (!isValid) {
            console.log('Invalid palette:', palette);
          }
          return isValid;
        });

        console.log('Valid palettes:', validPalettes);
        setPalettes(validPalettes);
      } catch (error) {
        console.error('Error fetching palettes:', error);
        setPalettes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPalettes();
  }, [user]);

  useEffect(() => {
    if (palettes.length > 0) {
      console.log('First palette:', palettes[0]);
    }
  }, [palettes]);

  const updatePaletteName = async (paletteId: number, name: string) => {
    try {
      await axios.put(`${API_BASE_URL}/api/palettes/${paletteId}`, { name });
      setPalettes((prev) =>
        prev.map((palette) => (palette.id === paletteId ? { ...palette, name } : palette))
      );
    } catch (error) {
      console.error('Error updating palette name:', error);
    }
  };

  const handleNameChange = (paletteId: number, newName: string) => {
    setPaletteNameChanges((prev) => ({
      ...prev,
      [paletteId]: newName,
    }));
  };

  const handleSaveChanges = async (paletteId: number) => {
    const newName = paletteNameChanges[paletteId] || '';
    await updatePaletteName(paletteId, newName);
    setEditingPaletteId(null);
    setSuccessMessage('Palette saved successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const confirmDeletePalette = (paletteId: number) => {
    setSelectedPaletteId(paletteId);
    setShowDeleteModal(true); // Show modal
  };

  const deletePalette = async () => {
    if (selectedPaletteId === null) return;
  
    try {
      await axios.delete(`${API_BASE_URL}/api/palettes/${selectedPaletteId}`);
      setPalettes((prev) => prev.filter((palette) => palette.id !== selectedPaletteId));
      setShowDeleteModal(false); // Hide modal after deletion
  
      // Set success message
      setSuccessMessage('Palette deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error('Error deleting palette:', error);
    }
  };
  
  const getColorsFromPalette = (palette: Palette): Color[] => {
    if (palette.colors && palette.colors.length > 0) {
      return palette.colors;
    }
    if (palette.hexcodes) {
      return palette.hexcodes.split(',').map(hex => {
        const value = parseInt(hex.replace('#', ''), 16);
        return {
          red: (value >> 16) & 255,
          green: (value >> 8) & 255,
          blue: value & 255
        };
      });
    }
    return [];
  };

  const copyPaletteToClipboard = (palette: Palette) => {
    let hexCodes: string;
    if (palette.hexcodes) {
      hexCodes = palette.hexcodes;
    } else if (palette.colors) {
      hexCodes = palette.colors
        .map(
          (color) =>
            `#${color.red.toString(16).padStart(2, '0')}${color.green
              .toString(16)
              .padStart(2, '0')}${color.blue.toString(16).padStart(2, '0')}`.toUpperCase()
        )
        .join(',');
    } else {
      console.error('No color data found in palette');
      return;
    }

    navigator.clipboard
      .writeText(hexCodes)
      .then(() => {
        setSuccessMessage('Palette copied to clipboard!');
        setTimeout(() => setSuccessMessage(''), 3000);
      })
      .catch((err) => {
        console.error('Failed to copy palette:', err);
      });
  };

  if (loading) {
    return (
      <div className="home-page-container">
        <p>Loading palettes...</p>
      </div>
    );
  }

  return (
    <div className="home-page-container">
      <Helmet>
        <title>{user ? `${user.firstName}'s Saved Palettes` : 'Saved Palettes'}</title>
      </Helmet>

      {!user ? (
        <p>Please log in to view your saved palettes.</p>
      ) : (
        <>
          <h2>{user.firstName}'s Saved Color Palettes</h2>

          {successMessage && (
            <div className="alert alert-success text-center" role="alert">
              {successMessage}
            </div>
          )}

          {!Array.isArray(palettes) || palettes.length === 0 ? (
            <p>No palettes saved yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>
                    <h2>Your Color Palettes</h2>
                  </th>
                </tr>
              </thead>
              <tbody>
                {palettes.map((palette) => {
                  if (!palette) {
                    console.log('Null palette found');
                    return null;
                  }
                  console.log('Processing palette:', palette);

                  return (
                    <tr key={palette.id}>
                     
                        
                 
                      <td className="color-palette-td" data-label="Colors (Hex Codes and Tiles)">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input
                            type="text"
                            className="form-control"
                            value={paletteNameChanges[palette.id] || palette.name || ''}
                            placeholder="Name your palette"
                            onChange={(e) => handleNameChange(palette.id, e.target.value)}
                            onFocus={() => setEditingPaletteId(palette.id)}
                          />
                          <button
                            className="btn-pallete full-width-mobile"
                            onClick={() => handleSaveChanges(palette.id)}
                          >
                            Save
                          </button>
                        </div>
                        <div className="color-palette-flex-container">
                          {getColorsFromPalette(palette).map((color, index) => {
                            const hexCode = `#${color.red.toString(16).padStart(2, '0')}${color.green
                              .toString(16)
                              .padStart(2, '0')}${color.blue.toString(16).padStart(2, '0')}`.toUpperCase();

                            return (
                              <div className="color-tile-container">
                                <div 
                                  className="color-tile-display"
                                  style={{ backgroundColor: hexCode }}
                                />
                                <span className="hex-code-display">{hexCode}</span>
                              </div>
                            );
                          })}
                        </div>
                        <div>
                         
                          <button
                            className="btn-link"
                            onClick={() => confirmDeletePalette(palette.id)}
                            title="Delete palette"
                          >
                            <img 
                              src="/src/images/delete.svg" 
                              alt="Delete" 
                              width="21" 
                              height="24"
                            />
                          </button>
                          <button
                            className="btn-link"
                            onClick={() => copyPaletteToClipboard(palette)}
                            title="Copy palette"
                          >
                            <img 
                              src="/src/images/copy.svg" 
                              alt="Copy" 
                              width="20" 
                              height="24"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div
              className="modal"
              style={{
                display: 'block',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1050,
              }}
            >
              <div
                className="modal-dialog"
                style={{
                  margin: '10% auto',
                  backgroundColor: '#fff',
                  padding: '20px',
                  borderRadius: '5px',
                  maxWidth: '400px',
                }}
              >
                <h5 className="modal-title">Delete Palette</h5>
                <p>Are you sure you want to delete this palette?</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0px' }}>
                  <button
                    className="btnprm full-width-mobile"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="custom-button-modal full-width-mobile"
                    style={{ pointerEvents: 'auto' }}
                    onClick={deletePalette}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PalettesPage;
