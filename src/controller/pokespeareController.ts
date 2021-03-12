import { FastifyReply, FastifyRequest } from "fastify";

import { BadFormatError } from "../error/badFormatError";
import { InternalError } from "../error/internalError";
import { NotFoundError } from "../error/notFoundError";
import { RateLimitError } from "../error/rateLimitError";
import { isNumeric } from "../utility/utility";

import { makeHttpRequest } from "./httpClient";
import { ResponsePokemonDescription, ResponseShakespeareTranslation } from "./typings/pokespeare";

export async function getPokespeareController(
    request: FastifyRequest<{ Params: { name: string } }>,
    reply: FastifyReply,
): Promise<void> {
    const pokemonName = request.params.name;
    if (isNumeric(pokemonName)) {
        throw new BadFormatError("Pokemon name must be a string", { pokemonName });
    }

    const pokèBaseUrl = process.env.POKE_BASE_URL;
    const shakespeareBaseUrl = process.env.SHAKESPEARE_BASE_URL;

    if (!pokèBaseUrl) {
        throw new InternalError("The server is missing some configs", {});
    }

    if (!shakespeareBaseUrl) {
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

    const translationResponse = await makeHttpRequest<ResponseShakespeareTranslation>(
        shakespeareBaseUrl,
        {
            method: "GET",
            path: "translate/shakespeare.json",
            queryParams: { text: cleanDescription },
        },
    );

    if (translationResponse.statusCode !== 200) {
        handleShakespeareApiErrors(translationResponse.statusCode, { pokemonDescsResponse });
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
