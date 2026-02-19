import apiClient from "@/lib/axios";

interface ScrapperRequest {
    prompt: string;
    targetUrl?: string; // Optional as backend handles defaults
}

interface ScrapperResponse {
    success: boolean;
    data: {
        answer: string;
    };
}

export const Scrapper = {
    async askScrapper(prompt: string, targetUrl?: string): Promise<string> {
        try {
            const payload: ScrapperRequest = {
                prompt,
                targetUrl
            };

            const { data } = await apiClient.post<ScrapperResponse>("/scrapper", payload);

            if (data.success && data.data && data.data.answer) {
                return data.data.answer;
            }

            throw new Error("Invalid response format from server");
        } catch (error: any) {
            console.error("Gandalf is silent", error);
            // Propagate the specific error message if available
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    }
}