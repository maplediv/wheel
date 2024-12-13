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

const PalettesPage: React.FC = () => {
  const { user } = useAuth();
  const [palettes, setPalettes] = useState<Palette[]>([]);

  useEffect(() => {
    const fetchPalettes = async () => {
      if (!user) {
        console.error('User not logged in.');
        return;
      }

      try {
        const palettesUrl = `http://localhost:10000/api/palettes/${user.userId}`;
        console.log('Fetching palettes with URL:', palettesUrl);

        const response = await axios.get<Palette[]>(palettesUrl);
        console.log('Fetched palettes:', response.data);

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

  return (
    <div className="home-page-container">
      <Helmet>
        <title>{user ? `${user.firstName}'s Saved Palettes` : 'Saved Palettes'}</title>
      </Helmet>

      {user ? (
        <>
          <h1>{user.firstName}'s Saved Color Palettes</h1>
          {palettes.length === 0 ? (
            <p>No palettes saved yet.</p>
          ) : (
            palettes.map((palette) => (
              <div key={palette.id} className="palette-item">
                <input
                  type="text"
                  value={palette.name || ''}
                  placeholder="Name this palette"
                  onChange={(e) => updatePaletteName(palette.id, e.target.value)}
                />
                <div className="palette-container">
  {palette.colors.map((color, index) => {
    const hexCode = `#${color.red.toString(16).padStart(2, '0')}${color.green
      .toString(16)
      .padStart(2, '0')}${color.blue.toString(16).padStart(2, '0')}`.toUpperCase();
    
    return (
      <div key={index} style={{ display: 'inline-block', textAlign: 'center', margin: '5px' }}>
        <div style={{ marginBottom: '5px', fontSize: '14px', color: '#333' }}>{hexCode}</div>
        <div
          style={{
            backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})`,
            width: '50px',
            height: '50px',
          }}
        />
      </div>
    );
  })}
</div>

              </div>
            ))
          )}
        </>
      ) : (
        <p>Please log in to view your saved palettes.</p>
      )}
    </div>
  );
};

export default PalettesPage;
