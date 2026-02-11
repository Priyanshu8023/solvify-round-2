import apiClient from "@/lib/axios";

interface User {
  id: string;
  email: string;
  name: string; // Always good to have optional fields ready
}

interface AuthResponse {
  token: string;
  user: User;
}

interface LoginCredentails{
    email: string;
    password: string;
}

interface RegisterCredentials extends LoginCredentails {
    name: string,
}

const TOKEN_KEY = process.env.TOKEN_KEY || "token";

const tokenStorage = {
    save: (token: string ) => localStorage.setItem(TOKEN_KEY,token),
    clear: ()=> localStorage.removeItem(TOKEN_KEY),
    get: () => typeof window !== "undefined"? localStorage.getItem(TOKEN_KEY) : null,
};

export const authService = {
    async register(credentails: RegisterCredentials):Promise<User>{
        const {data} = await apiClient.post<AuthResponse>("/auth/register",credentails);
        tokenStorage.save(data.token);
        return data.user;
    },

    async login(credentails: LoginCredentails):Promise<User> {
        const { data } = await apiClient.post<AuthResponse>("/auth/login",credentails);
        tokenStorage.save(data.token);
        return data.user;
    },

    logout(): void {
        tokenStorage.clear();
    },

    isAuthenticated(): boolean {
        return !!tokenStorage.get();
    }
}

