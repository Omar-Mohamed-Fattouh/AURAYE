export const getCurrentUser = () => {
    try {
        const userData = localStorage.getItem("user");
        if (!userData) return null;

        return JSON.parse(userData);
    } catch (err) {
        console.error("Failed to parse user:", err);
        return null;
    }
};

export const getToken = () => {
    return localStorage.getItem("token") || null;
};
