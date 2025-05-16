import { jwtDecode } from 'jwt-decode';

// Function to decode and check token validity
const decodeToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};

export default decodeToken;