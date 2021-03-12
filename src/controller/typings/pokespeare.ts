export interface UrlName {
    name: string;
    url: string;
}

export interface ResponsePokemonDescription {
    flavor_text_entries: [
        {
            flavor_text: string;
            language: UrlName;
            version: UrlName;
        },
    ];
}

export interface ResponseShakespeareTranslation {
    success: {
        total: number;
    };
    contents: {
        translated: string;
        text: string;
        translation: string;
    };
}
