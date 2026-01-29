export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 🔐 Password check
  const appPassword = req.headers['x-app-password'];
  if (appPassword !== process.env.APP_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: 'No image provided' });
  }

  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a nutrition assistant. Analyze this food image and provide a JSON response with the following structure:
{
  "items": [
    {
      "name": "food name",
      "portion": "estimated portion size",
      "calories_range": "min-max"
    }
  ],
  "total_calories_range": "min-max",
  "confidence": "low/medium/high"
}

Identify all visible foods and estimate their calories using ranges (not exact values). Be realistic about portion sizes. Return only valid JSON, no markdown or extra text.`,
                },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    // Check if the Gemini API request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API HTTP Error:', response.status, errorData);
      return res.status(500).json({ 
        error: 'Gemini API request failed', 
        status: response.status,
        details: errorData 
      });
    }

    const data = await response.json();
    
    // Extract the text content from Gemini's response
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const textResponse = data.candidates[0].content.parts[0].text;
      
      // Try to parse as JSON
      try {
        // Remove markdown code blocks if present
        const cleanedText = textResponse.replace(/```json\n?|\n?```/g, '').trim();
        const parsedResult = JSON.parse(cleanedText);
        res.status(200).json(parsedResult);
      } catch (parseErr) {
        // If parsing fails, return the raw text
        res.status(200).json({ 
          raw_response: textResponse,
          error: 'Failed to parse JSON response' 
        });
      }
    } else {
      res.status(500).json({ error: 'Unexpected response format', raw: data });
    }
  } catch (err) {
    console.error('Gemini API Error:', err);
    res.status(500).json({ error: 'Gemini request failed', details: err.message });
  }
}
