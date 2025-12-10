export function isTokenExpired(token) {
    if (!token) return true;

    try {
        const base64 = token.split('.')[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const payload = JSON.parse(atob(base64));
        const now = Date.now() / 1000;

        if (!payload.exp) return true;

        return payload.exp < now;
    } catch (err) {
        console.error("Invalid token:", err);
        return true; 
    }
}
