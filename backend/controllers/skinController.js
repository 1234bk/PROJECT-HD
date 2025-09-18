import Groq from 'groq-sdk'; 
import SkinAnalysis from '../models/Skinanalysis.js';
import dotenv from "dotenv";
dotenv.config();

const buildGroqPrompt = (userData) => {
  return `
You are an expert dermatologist and nutritionist specialized in skin care. 
Given the user's input below, provide the following in a detailed and structured JSON:
- Skin Type with detailed reasoning.
- Personalized diet suggestions (what to eat and avoid).
- Skincare routine schedule (when and how to use products).
- Recommended products matching user's budget.
- Do’s and Don’ts (in detail).
- Any additional remarks.

User Data:
Age: ${userData.age}
Gender: ${userData.gender}
Skin Type Description: ${userData.skinType}
Post Cleanse Feeling: ${userData.postCleanseFeel}
Sensitivity Level: ${userData.sensitivityLevel}
Primary Concerns: ${userData.concerns.join(', ')}
Acne Type: ${userData.acneType.join(', ')}
Active Ingredients Currently Used: ${userData.currentActives.join(', ')}
Past Product Irritations: ${userData.pastProductsHated}
Climate: ${userData.climate}
Sleep Hours: ${userData.sleep}
Budget Range: ${userData.budget}

The output must be pure JSON only, strictly following this format:

{
  "skinType": "<string>",
  "skinTypeReasoning": "<string>",
  "dietSuggestions": {
    "eat": ["<string>", "<string>", "..."],
    "avoid": ["<string>", "<string>", "..."]
  },
  "routineSchedule": {
    "morning": ["<string>", "<string>", "..."],
    "night": ["<string>", "<string>", "..."],
    "weekly": ["<string>", "<string>", "..."]
  },
  "recommendedProducts": [
    {"name": "<string>", "reason": "<string>", "priceRange": "<string>"}
  ],
  "dosAndDonts": {
    "dos": ["<string>", "<string>", "..."],
    "donts": ["<string>", "<string>", "..."]
  },
  "additionalRemarks": "<string>"
}
`;
};

 // Add this import at the top
// console.log("huaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa          apikey", process.env.GROQ_API_KEY );
const groq = new Groq({
    apiKey:"process.env.GROQ_API_KEY )",
    
});






export const skinanalysis =  async (req, res) => {
  const userData = req.body;
  console.log(userData);

  const prompt = buildGroqPrompt(userData);

  try {
    const result = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: "openai/gpt-oss-20b",
      response_format: { type: "json_object" }, 
    });

    const rawResponse = result.choices[0]?.message?.content.trim();
   

    // Extract pure JSON (safely)
    const jsonMatch = rawResponse.match(/{[\s\S]*}/);
    if (!jsonMatch) throw new Error('No valid JSON found in Groq response');

    const jsonData = JSON.parse(jsonMatch[0]);
     console.log("jsondataresponse",jsonData);
const existing = await SkinAnalysis.findOne({ user: req.user.id });

if (existing) {
  await SkinAnalysis.deleteOne({ user: req.user.id });
}
    const newAnalysis = new SkinAnalysis({
      user: req.user.id,
      ...jsonData, // spread operator, pura JSON data save karega
    });

    await newAnalysis.save();
    

    

    res.status(201).json({
      success: true,
      message: "Skin analysis saved successfully",
      data: newAnalysis,
    });

    // res.status(200).json({ data: jsonData });
  } catch (error) {
    console.error('bhai idhar se aya error Groq API error:', error);
    res.status(500).json({ error: 'Failed to generate skin analysis.' });
  }
}


export const getAnalysisForUser = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const analysis = await SkinAnalysis.findOne({ user: userId });
    if (!analysis) return res.status(404).json({ success: false, message: "No analysis found" });

    res.status(200).json({ success: true, data: analysis });
  } catch (err) {
    console.error("getAnalysisForUser error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch analysis" });
  }
};

export const checkresultuser = async(req,res)=>{
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const analysis = await SkinAnalysis.findOne({ user: userId });
    if (!analysis) return res.status(404).json({ success: false, message: "No analysis found" });
    console.log("analysis in checkresultuser",analysis);
    res.status(200).json({ success: true, data: analysis });
  } catch (err) {
    console.error("getAnalysisForUser error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch analysis" });
  }
}