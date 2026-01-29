import { useState, useEffect } from 'react';

export default function App() {
  // DEBUG: Test if component renders
  console.log('App component rendering...');
  const [password, setPassword] = useState('');
  const [storedPassword, setStoredPassword] = useState(null);

  const [imageBase64, setImageBase64] = useState(null);
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load saved password
  useEffect(() => {
    const saved = localStorage.getItem('app_password');
    if (saved) setStoredPassword(saved);
  }, []);

  const savePassword = () => {
    if (!password) return;
    localStorage.setItem('app_password', password);
    setStoredPassword(password);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to compress image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set max dimensions (reduces file size significantly)
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression (0.7 quality = good balance)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7).split(',')[1];
        setImageBase64(compressedBase64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    // ✅ LOCAL MOCK (npm run dev)
    if (import.meta.env.DEV) {
      setTimeout(() => {
        setResult({
          items: [
            {
              name: 'Pizza slice',
              portion: '1 slice',
              calories_range: '250–300',
            },
          ],
          total_calories_range: '250–300',
          confidence: 'medium',
        });
        setLoading(false);
      }, 1000);
      return;
    }

    // 🔥 REAL BACKEND (after Vercel deploy)
    try {
      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-password': storedPassword,
        },
        body: JSON.stringify({ imageBase64 }),
      });

      if (!res.ok) {
        throw new Error('Unauthorized or backend error');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔐 PASSWORD SCREEN
  if (!storedPassword) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Enter password</h2>
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <br />
        <button onClick={savePassword}>Continue</button>
      </div>
    );
  }

  // 📱 MAIN UI
  return (
    <div style={{ padding: 20 }}>
      <h2>Food calorie estimator</h2>

      <input
        type='file'
        accept='image/*'
        capture='environment'
        onChange={handleImage}
      />

      <br />
      <br />

      <button onClick={analyze} disabled={!imageBase64 || loading}>
        {loading ? 'Analyzing…' : 'Analyze'}
      </button>

      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}

      {result && (
        <pre style={{ marginTop: 20 }}>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
