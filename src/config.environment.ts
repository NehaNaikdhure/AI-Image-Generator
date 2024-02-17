const PORT = process.env.PORT || 3000;

const DEPLOYMENT_TYPE = process.env.DEPLOYMENT_TYPE === "production" ? "production" : process.env.DEPLOYMENT_TYPE === "testing" ? "testing" : "local"

const BackendURL = DEPLOYMENT_TYPE === "production" ? "" : process.env.DEPLOYMENT_TYPE === "testing" ? "https://testing.com" : "http://localhost:9000"
const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY || ""

export const openAIConfigs = {
    apiKey: OPEN_AI_API_KEY
}

