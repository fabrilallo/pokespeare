import { BadFormatError } from "../error/badFormatError";
import { InternalError } from "../error/internalError";
import { NotFoundError } from "../error/notFoundError";
import { RateLimitError } from "../error/rateLimitError";
import { makeHttpRequest } from "./httpClient";
import { ResponsePokemonDescription } from "./typings/pokespeare";

export async function getPokemonDescription(pokemonName: string): Promise<string> {
    const pokèBaseUrl = process.env.POKE_BASE_URL;

    if (!pokèBaseUrl) {
        throw new InternalError("The server is missing some configs", {});
    }

    const pokemonDescsResponse = await makeHttpRequest<ResponsePokemonDescription>(pokèBaseUrl, {
        method: "GET",
        path: `pokemon-species/${pokemonName}`,
    });

    if (pokemonDescsResponse.statusCode !== 200) {
        handlePokèApiErrors(pokemonDescsResponse.statusCode, { pokemonDescsResponse });
    }

    const rubyDescriptions = pokemonDescsResponse.body.flavor_text_entries.filter((entry) => {
        return entry.language.name === "en" && entry.version.name === "ruby";
    });

    const cleanDescription = rubyDescriptions[0].flavor_text.replace(/[\n\r\f]/g, "");

    return cleanDescription;
}

function handlePokèApiErrors(statusCode: number, logInfo: Record<string, unknown>): void {
    if (statusCode === 404) {
        throw new NotFoundError("Pokemon not found", logInfo);
    } else if (statusCode === 400) {
        throw new BadFormatError("The pokemon name is badly formatted", logInfo);
    } else if (statusCode === 429) {
        throw new RateLimitError("Too many requests. Try again later", logInfo);
    } else {
        throw new InternalError("Error getting the pokemon description", logInfo);
    }
}
