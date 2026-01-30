export default async function handler(req, res) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );
    const data = await response.json();
    
    // Filter to only show models that support generateContent
    const visionModels = data.models?.filter(m => 
      m.supportedGenerationMethods?.includes('generateContent')
    );
    
    res.status(200).json({ 
      availableModels: visionModels?.map(m => m.name) || [],
      fullData: data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
