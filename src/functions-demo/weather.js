export const weatherFunctionSchema = {
    "name": "getWeather",
    "description": "Get the current weather for a city",
    "parameters": {
        "type": "object",
        "properties": {
            "city": {
                "type": "string",
                "description": "The city",
            },
        },
        "required": ["city"],
    },
}

export async function getWeather(city) {
    const weatherApiKey = process.env.WEATHER_API_KEY;
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;
    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error(`Failed to check weather! ${response.status}`);
    }
    return await response.json();
}