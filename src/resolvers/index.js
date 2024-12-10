import Resolver from "@forge/resolver";
import api, { route } from "@forge/api";
const resolver = new Resolver();
import dotenv from "dotenv";
dotenv.config();
const TRANSLATION_API =
  "https://deep-translate1.p.rapidapi.com/language/translate/v2";

resolver.define("getText", async ({ context, payload }) => {
  const { extension } = context;
  try {
    const response = await api
      .asApp()
      .requestJira(
        route`/rest/api/3/issue/${extension.issue.key}?fields=summary,description`
      );
    if (!response.ok) {
      throw new Error("Error getting issue data from Jira");
    }
    const {
      fields: { description },
    } = await response.json();
    const textToTranslate = description.content[0].content[0].text;

    // translate the text using translation API
    const body = {
      q: textToTranslate,
      source: "en",
      target: payload.targetLanguage,
    };
    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": process.env.API_KEY,
        "x-rapidapi-host": "deep-translate1.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    const translateRes = await api.fetch(TRANSLATION_API, options);
    if (!translateRes.ok) {
      throw new Error("Error translation using API");
    }
    const { data } = await translateRes.json();
    console.log(data.translations.translatedText);
    return data.translations.translatedText;
  } catch (error) {
    console.log(error.message);
  }
});

export const handler = resolver.getDefinitions();
