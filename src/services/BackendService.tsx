import axios from "axios";

const BackendService = axios.create({
    baseURL: import.meta.env.VITE_URL_BACKEND,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

export default BackendService;