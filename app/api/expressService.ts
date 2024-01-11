import axios from 'axios';

export default axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL
    // baseURL: 'http://192.168.1.58:3000/api/exercise'
});
