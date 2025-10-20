import axios from "axios";

const api = axios.create({ baseURL: "https://103.38.236.222:2402/api/v1" })

export default api