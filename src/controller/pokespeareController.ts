import { FastifyReply, FastifyRequest } from "fastify";
import got from "got";
import { BadFormatError } from "../error/badFormatError";
import { InternalError } from "../error/internalError";
import { NotFoundError } from "../error/notFoundError";
import { RateLimitError } from "../error/rateLimitError";
import { isNumeric } from "../utility/utility";
import { ResponsePokemonDescription, ResponseShakespeareTranslation } from "./typings/types";

const DEFAULT_GOT_TIMEOUT = 30000;

export async function getPokespeareController(
    request: FastifyRequest<{ Params: { name: string } }>,
    reply: FastifyReply,
): Promise<void> {
    const pokemonName = request.params.name;
    if (isNumeric(pokemonName)) {
        throw new BadFormatError("Pokemon name must be a string", {});
    }
    const pokemonDescsResponse = await got.get<ResponsePokemonDescription>(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`,
        { timeout: DEFAULT_GOT_TIMEOUT, responseType: "json", throwHttpErrors: false },
    );

    if (pokemonDescsResponse.statusCode !== 200) {
        handlePokèApiErrors(pokemonDescsResponse.statusCode, { pokemonName });
    }
    const rubyDescriptions = pokemonDescsResponse.body.flavor_text_entries.filter((entry) => {
        return entry.language.name === "en" && entry.version.name === "ruby";
    });
    const cleanDescription = rubyDescriptions[0].flavor_text.replace(/[\n\r\f]/g, "");

    const encodedText = encodeURI(cleanDescription);
    const translationResponse = await got.get<ResponseShakespeareTranslation>(
        `https://api.funtranslations.com/translate/shakespeare.json?text=${encodedText}`,
        { timeout: DEFAULT_GOT_TIMEOUT, responseType: "json", throwHttpErrors: false },
    );

    if (translationResponse.statusCode !== 200) {
        handleShakespeareApiErrors(translationResponse.statusCode, {
            pokemonName,
            cleanDescription,
            encodedText,
        });
    }
    reply
        .code(200)
        .send({ name: pokemonName, description: translationResponse.body.contents.translated });
}

function handleShakespeareApiErrors(statusCode: number, logInfo: Record<string, unknown>): void {
    if (statusCode === 404) {
        throw new NotFoundError("Shakespearean description not found", logInfo);
    } else if (statusCode === 400) {
        throw new InternalError(
            "The pokemon description is badly formatted so we couldn't retrieve it.",
            logInfo,
        );
    } else if (statusCode === 429) {
        throw new RateLimitError("Too many requests. Try again later", logInfo);
    } else if (statusCode !== 200) {
        throw new InternalError(
            "Error translating in a shakespearean style the pokemon description",
            logInfo,
        );
    }
}

function handlePokèApiErrors(statusCode: number, logInfo: Record<string, unknown>): void {
    if (statusCode === 404) {
        throw new NotFoundError("Pokemon not found", logInfo);
    } else {
        throw new InternalError("Error getting the pokemon description", logInfo);
    }
}
