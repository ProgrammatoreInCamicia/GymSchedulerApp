import axios from 'axios';

export default axios.create({
    baseURL: 'http://13.49.64.199:3000/api/exercise'
    // baseURL: 'http://192.168.1.58:3000/api/exercise'
});
