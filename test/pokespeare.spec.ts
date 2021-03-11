import { test } from "tap";

import app from "../src/app";

test("should return route a success response", async (t) => {
    const response = await app.inject({
        method: "GET",
        url: "/pokemon/charizard",
    });
    t.strictEqual(response.statusCode, 200, "Response status code should be 200");
    t.deepEqual(
        response.json(),
        {
            name: "charizard",
            description:
                "Charizard flies 'round the sky insearch of powerful opponents.'t breathes fire of such most wondrous heatthat 't melts aught. However,  itnever turns its fiery breath on anyopponent weaker than itself.",
        },
        "Error message should be 'Charizard flies 'round the sky insearch of powerful opponents.'t breathes fire of such most wondrous heatthat 't melts aught. However,  itnever turns its fiery breath on anyopponent weaker than itself.'",
    );
});
test("should return route not found error", async (t) => {
    const response = await app.inject({
        method: "GET",
        url: "/",
    });
    t.strictEqual(response.statusCode, 404);
    t.deepEqual(
        response.json(),
        {
            code: "NOT_FOUND_ERROR",
            message: "Route not found",
        },
        "Error message should be 'Route not found'",
    );
});

test("should return route bad format error", async (t) => {
    const response = await app.inject({
        method: "GET",
        url: "/pokemon/2",
    });
    t.strictEqual(response.statusCode, 400, "Error status code should be 400");
    t.deepEqual(
        response.json(),
        {
            code: "BAD_FORMAT_ERROR",
            message: "Pokemon name must be a string",
        },
        "Error message should be 'Pokemon name must be a string'",
    );
});

test("should return route not found  error", async (t) => {
    const response = await app.inject({
        method: "GET",
        url: "/pokemon/charizarddd",
    });
    t.strictEqual(response.statusCode, 404, "Error status code should be 404");
    t.deepEqual(
        response.json(),
        {
            code: "NOT_FOUND_ERROR",
            message: "Pokemon not found",
        },
        "Error message should be 'Pokemon not found'",
    );
});
