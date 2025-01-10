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
  colors: Color[];
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://wheelback.onrender.com'
  : 'http://localhost:10000';

const PalettesPage: React.FC = () => {
  const { user } = useAuth();
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [editingPaletteId, setEditingPaletteId] = useState<number | null>(null);
  const [paletteNameChanges, setPaletteNameChanges] = useState<{ [key: number]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedPaletteId, setSelectedPaletteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPalettes = async () => {
      if (!user) {
        console.error('User not logged in.');
        return;
      }

      try {
        const palettesUrl = `http://localhost:10000/api/palettes/${user.userId}`;
        const response = await axios.get<Palette[]>(palettesUrl);
        setPalettes(response.data);
      } catch (error) {
        console.error('Error fetching palettes:', error);
      }
    };

    fetchPalettes();
  }, [user]);

  const updatePaletteName = async (paletteId: number, name: string) => {
    try {
      await axios.put(`http://localhost:10000/api/palettes/${paletteId}`, { name });
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
      await axios.delete(`http://localhost:10000/api/palettes/${selectedPaletteId}`);
      setPalettes((prev) => prev.filter((palette) => palette.id !== selectedPaletteId));
      setShowDeleteModal(false); // Hide modal after deletion
  
      // Set success message
      setSuccessMessage('Palette deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error('Error deleting palette:', error);
    }
  };
  
  const copyPaletteToClipboard = (palette: Palette) => {
    const hexCodes = palette.colors
      .map(
        (color) =>
          `#${color.red.toString(16).padStart(2, '0')}${color.green
            .toString(16)
            .padStart(2, '0')}${color.blue.toString(16).padStart(2, '0')}`.toUpperCase()
      )
      .join(', ');

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
  return (
    <div className="home-page-container">
      <Helmet>
        <title>{user ? `${user.firstName}'s Saved Palettes` : 'Saved Palettes'}</title>
      </Helmet>

      {user ? (
        <>
          <h1>{user.firstName}'s Saved Color Palettes</h1>

          {successMessage && (
            <div className="alert alert-success text-center" role="alert">
              {successMessage}
            </div>
          )}

          {palettes.length === 0 ? (
            <p>No palettes saved yet.</p>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Palette Name</th>
                  <th>Colors (Hex Codes and Tiles)</th>
                </tr>
              </thead>
              <tbody>
                {palettes.map((palette) => (
                  <tr key={palette.id}>
                    <td className="color-name-td">
                      <input
                        type="text"
                        className="form-control"
                        value={paletteNameChanges[palette.id] || palette.name || ''}
                        placeholder="Name your palette"
                        onChange={(e) => handleNameChange(palette.id, e.target.value)}
                        onFocus={() => setEditingPaletteId(palette.id)}
                      />
                      <div>
                        <button
                          className="btn-pallete btn-primary btn"
                          onClick={() => handleSaveChanges(palette.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-primary btn-pallete"
                          onClick={() => confirmDeletePalette(palette.id)}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-primary btn-pallete"
                          onClick={() => copyPaletteToClipboard(palette)}
                        >
                          Copy
                        </button>
                      </div>
                    </td>
                    <td className="color-palette-td">
                      <div className="color-tiles-container">
                        {palette.colors.map((color, index) => {
                          const hexCode = `#${color.red.toString(16).padStart(2, '0')}${color.green
                            .toString(16)
                            .padStart(2, '0')}${color.blue.toString(16).padStart(2, '0')}`.toUpperCase();

                          return (
                            <div key={index} className="color-tile-wrapper">
                              <div 
                                className="color-tile" 
                                style={{ backgroundColor: hexCode }}
                              />
                              <span className="hex-code">{hexCode}</span>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
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
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowDeleteModal(false)} // Close modal
                  >
                    Cancel
                  </button>
                  <button
                  className="btn btn-danger"
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
      ) : (
        <p>Please log in to view your saved palettes.</p>
      )}
    </div>
  );
};

export default PalettesPage;
