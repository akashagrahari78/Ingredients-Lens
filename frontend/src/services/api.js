// API Service for LabelLens AI Connects to Backend

export const analyzeLabelImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
        // Post to the local backend route
        const response = await fetch("http://localhost:3000/api/analyze", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error calling analyze API:", error);
        throw error;
    }
};
