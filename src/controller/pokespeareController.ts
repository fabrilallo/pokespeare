import { FastifyReply, FastifyRequest } from "fastify";
import { BadFormatError } from "../error/badFormatError";
import { isNumeric } from "../utility/utility";
import { getPokemonDescription } from "./pokèController";
import { getPokeaspeareanTranslation } from "./shakespeareController";

export async function getPokespeareController(
    request: FastifyRequest<{ Params: { name: string } }>,
    reply: FastifyReply,
): Promise<void> {
    const pokemonName = request.params.name;
    if (isNumeric(pokemonName)) {
        throw new BadFormatError("Pokemon name must be a string", { pokemonName });
    }

    const pokemonDescription = await getPokemonDescription(pokemonName);
    const translationResponse = await getPokeaspeareanTranslation(pokemonDescription);

    reply
        .code(200)
        .send({ name: pokemonName, description: translationResponse.contents.translated });
}


