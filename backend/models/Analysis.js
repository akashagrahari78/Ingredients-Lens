const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
    {
        ingredients: [
            {
                name: { type: String, required: true },
                safety: { type: String, enum: ["good", "warning", "bad", "unknown"], default: "unknown" },
                reason: { type: String }
            }
        ],
        allergens: [{ type: String }],
        healthScore: { type: String },
        scoreMessage: { type: String },
        analysis: { type: String },
        imagePath: { type: String, required: true },
        detailedAnalysis: {
            whyGoodOrBad: { type: String },
            whoShouldEat: { type: String },
            whoShouldAvoid: { type: String }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Analysis", analysisSchema);
