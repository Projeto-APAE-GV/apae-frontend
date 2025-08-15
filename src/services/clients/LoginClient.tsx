import BackendService from "../BackendService";

interface LoginRequest {
    email: string;
    senha: string;
}

interface LoginResponse {
    access_token: string;
}

export const realizarLogin = async (dadosLogin: LoginRequest): Promise<LoginResponse | null> => {
    try {
        const response = await BackendService.post("/auth/login", dadosLogin);
        return response.data;
    } catch (error) {
        console.error("Erro ao realizar login:", error);
        return null;
    }
};