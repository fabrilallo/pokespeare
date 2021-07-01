import { InternalError } from "../error/internalError";
import { NotFoundError } from "../error/notFoundError";
import { RateLimitError } from "../error/rateLimitError";
import { makeHttpRequest } from "./httpClient";
import { ResponseShakespeareTranslation } from "./typings/pokespeare";

export async function getPokeaspeareanTranslation(
    pokemonDescription: string,
): Promise<ResponseShakespeareTranslation> {
    const shakespeareBaseUrl = process.env.SHAKESPEARE_BASE_URL;

    if (!shakespeareBaseUrl) {
        throw new InternalError("The server is missing some configs", {});
    }
    const translationResponse = await makeHttpRequest<ResponseShakespeareTranslation>(
        shakespeareBaseUrl,
        {
            method: "GET",
            path: "translate/shakespeare.json",
            queryParams: { text: pokemonDescription },
        },
    );

    if (translationResponse.statusCode !== 200) {
        handleShakespeareApiErrors(translationResponse.statusCode, { pokemonDescription });
    }

    return translationResponse.body;
}

function handleShakespeareApiErrors(statusCode: number, logInfo: Record<string, unknown>): void {
    if (statusCode === 404) {
        throw new NotFoundError("Shakespearean description not found", logInfo);
    } else if (statusCode === 400) {
        throw new InternalError(
            "The pokemon description is badly formatted so we couldn't retrieve its description in shakespearean style",
            logInfo,
        );
    } else if (statusCode === 429) {
        throw new RateLimitError("Too many requests. Try again later", logInfo);
    } else {
        throw new InternalError(
            "Error translating in a shakespearean style the pokemon description",
            logInfo,
        );
    }
}
