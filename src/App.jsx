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
      
      // Handle potential JSON parsing errors from API
      if (data.error && data.raw_response) {
        // API couldn't parse the response as JSON, try parsing here
        try {
          const cleanedText = data.raw_response.replace(/```json\n?|\n?```/g, '').trim();
          const parsedResult = JSON.parse(cleanedText);
          setResult(parsedResult);
        } catch {
          // Still can't parse, show user-friendly error with raw text
          setResult({ 
            parse_error: true,
            message: "The analysis completed but the response format was unexpected. Here's what was found:",
            raw_text: data.raw_response 
          });
        }
      } else {
        setResult(data);
      }
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
        <div style={{ 
          marginTop: 20, 
          padding: 20, 
          backgroundColor: '#f9f9f9', 
          borderRadius: 12,
          border: '2px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            marginTop: 0, 
            marginBottom: 20,
            color: '#2c3e50', 
            fontSize: '22px',
            borderBottom: '2px solid #3498db',
            paddingBottom: 10
          }}>
            📊 Analysis Results
          </h3>
          
          {/* Handle parse errors */}
          {result.parse_error ? (
            <div style={{ 
              padding: 15, 
              backgroundColor: '#fff3cd', 
              borderRadius: 8,
              border: '1px solid #ffc107',
              color: '#856404'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: 10, fontSize: '16px' }}>
                ⚠️ {result.message || 'Unable to parse response'}
              </div>
              <div style={{ 
                padding: 10, 
                backgroundColor: 'white', 
                borderRadius: 5,
                fontSize: '14px',
                lineHeight: '1.6',
                maxHeight: '200px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {result.raw_text}
              </div>
            </div>
          ) : result.items && result.items.length > 0 ? (
            <>
              {/* Food items section */}
              <div style={{ marginBottom: 20 }}>
                {result.items.map((item, index) => (
                  <div key={index} style={{ 
                    marginBottom: 12, 
                    padding: 15, 
                    backgroundColor: 'white',
                    borderRadius: 8,
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      fontSize: '18px', 
                      marginBottom: 8,
                      color: '#2c3e50'
                    }}>
                      🍽️ {item.name || 'Unknown food'}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#7f8c8d', 
                      marginBottom: 6,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span style={{ marginRight: 8 }}>📏</span>
                      <span>Portion: {item.portion || 'Not specified'}</span>
                    </div>
                    <div style={{ 
                      fontSize: '16px', 
                      color: '#e67e22', 
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span style={{ marginRight: 8 }}>🔥</span>
                      <span>Calories: {item.calories_range || 'N/A'} kcal</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total calories summary */}
              {result.total_calories_range && (
                <div style={{ 
                  padding: 16, 
                  backgroundColor: '#e8f5e9', 
                  borderRadius: 8,
                  border: '2px solid #4caf50',
                  marginBottom: 15,
                  textAlign: 'center'
                }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold', 
                    color: '#2e7d32',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ marginRight: 8 }}>🔥</span>
                    <span>Total Calories: {result.total_calories_range} kcal</span>
                  </div>
                </div>
              )}
              
              {/* Confidence indicator */}
              {result.confidence && (
                <div style={{ 
                  padding: 10,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 6,
                  textAlign: 'center'
                }}>
                  <span style={{ 
                    fontSize: '13px', 
                    color: '#555',
                    fontWeight: '500'
                  }}>
                    {result.confidence.toLowerCase() === 'high' && '✅ High Confidence'}
                    {result.confidence.toLowerCase() === 'medium' && '⚡ Medium Confidence'}
                    {result.confidence.toLowerCase() === 'low' && '⚠️ Low Confidence'}
                    {!['high', 'medium', 'low'].includes(result.confidence.toLowerCase()) && `Confidence: ${result.confidence}`}
                  </span>
                </div>
              )}
            </>
          ) : (
            /* No food items detected */
            <div style={{ 
              padding: 20, 
              backgroundColor: '#f8f9fa',
              borderRadius: 8,
              border: '1px solid #dee2e6',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: 10 }}>🔍</div>
              <div style={{ 
                fontSize: '16px', 
                color: '#6c757d',
                fontWeight: '500',
                marginBottom: 8
              }}>
                No food items detected
              </div>
              <div style={{ fontSize: '14px', color: '#868e96', lineHeight: '1.5' }}>
                {result.raw_response || result.raw_text || 
                 'Try uploading a clearer image with visible food items.'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
