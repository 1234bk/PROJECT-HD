import mongoose from "mongoose";

const skinAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skinType: String,
    skinTypeReasoning: String,

    dietSuggestions: {
      eat: [String],
      avoid: [String],
    },

    routineSchedule: {
      morning: [String],
      night: [String],
      weekly: [String],
    },

    recommendedProducts: [
      {
        name: String,
        reason: String,
        priceRange: String,
      },
    ],

    dosAndDonts: {
      dos: [String],
      donts: [String],
    },

    additionalRemarks: String,
  },
  { timestamps: true }
);

export default mongoose.model("SkinAnalysis", skinAnalysisSchema);
