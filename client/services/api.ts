import apiClient from "@/lib/axios";

interface ScrapperRequest {
    prompt: string,
}   

interface ScrapperResponse {
    sucess: boolean,
    response: string,
}

export const Scrapper ={
    async askScrapper (prompt: string) : Promise<string>{
        try{
            const {data}= await apiClient.post<ScrapperResponse>("/gandalf",{
                prompt
            } as ScrapperRequest)
            return data.response;
        }catch(error){
            console.error("Gandalf is silent",error);
            throw error;
        }

    }
}