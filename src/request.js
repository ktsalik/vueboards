import axios from 'axios';

const baseURL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3001";

const request = axios.create({
  baseURL,
});

export default request;