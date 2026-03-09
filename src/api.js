import axios from 'axios';

const getBaseURL = () => {
    if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }
    // Default for local development
    return 'http://localhost:8000/api/';
};

const api = axios.create({
    baseURL: getBaseURL(),
});

// If the API URL is missing in production, warn the user
if (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_API_URL) {
    console.warn('REACT_APP_API_URL environment variable is missing. Falling back to localhost:8000.');
}

export default api;

