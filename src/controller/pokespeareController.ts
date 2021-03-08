import { FastifyReply, FastifyRequest } from "fastify";
import got from "got";
import { BadFormatError } from "../error/badFormatError";
import { InternalError } from "../error/internalError";
import { NotFoundError } from "../error/notFoundError";
import { ResponsePokemonDescription, ResponseShakespeareTranslation } from "./typings/types";
import { isNumeric } from "./utility";

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

    if (pokemonDescsResponse.statusCode === 404) {
        throw new NotFoundError("Pokemon not found", { pokemonName });
    } else if (pokemonDescsResponse.statusCode !== 200) {
        throw new InternalError("Error getting the pokemon description", { pokemonName });
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

    if (translationResponse.statusCode === 404) {
        throw new NotFoundError("Shakespearean description not found", { pokemonName });
    } else if (translationResponse.statusCode !== 200) {
        throw new InternalError(
            "Error translating in a shakespearean style the pokemon description",
            { pokemonName },
        );
    }
    reply
        .code(200)
        .send({ name: pokemonName, description: translationResponse.body.contents.translated });
}
