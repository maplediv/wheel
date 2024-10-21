import axios from 'axios';

const BASE_URL = "https://your-backend-api-url.com";

// Helper function to call backend APIs
async function request(endpoint, paramsOrData = {}, method = "get") {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const url = `${BASE_URL}/${endpoint}`;
  const data = (method === 'get') ? { params: paramsOrData } : paramsOrData;

  try {
    return (await axios({ url, method, data, headers })).data;
  } catch (err) {
    console.error("API Error:", err.response);
    let message = err.response.data.error.message;
    throw Array.isArray(message) ? message : [message];
  }
}

export default request;
