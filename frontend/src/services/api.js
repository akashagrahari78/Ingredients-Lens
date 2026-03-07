// Mock API Service for LabelLens AI

export const analyzeLabelImage = async (file) => {
    // Simulate network request
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // In production, you would upload the file to your backend:
            // const formData = new FormData();
            // formData.append("image", file);
            // const response = await fetch("http://localhost:3000/api/analyze", { method: "POST", body: formData });
            // return response.json();

            resolve({
                healthScore: 'warning', // good, warning, bad
                scoreMessage: 'Moderately Healthy - Consume in moderation',
                ingredients: [
                    { name: 'Water', safety: 'good', reason: 'Essential for hydration' },
                    { name: 'Wheat Flour', safety: 'good', reason: 'Source of carbohydrates' },
                    { name: 'High Fructose Corn Syrup', safety: 'bad', reason: 'Highly processed sugar linked to obesity' },
                    { name: 'Palm Oil', safety: 'warning', reason: 'High in saturated fats' },
                    { name: 'Sodium Benzoate', safety: 'warning', reason: 'Chemical preservative' },
                    { name: 'Red 40', safety: 'bad', reason: 'Artificial dye linked to hyperactivity' },
                    { name: 'Citric Acid', safety: 'good', reason: 'Natural preservative and flavor' },
                ],
                nutrition: {
                    calories: '240 kcal',
                    sugar: '24g',
                    fat: '12g',
                    protein: '4g',
                    sodium: '320mg'
                }
            });
        }, 2500);
    });
};
