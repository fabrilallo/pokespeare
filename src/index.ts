import dotenv from "dotenv";

// needed for local development with .env files
dotenv.config();
import app from "./app";

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || 8080;
const start = async () => {
    try {
        await app.listen(PORT, HOST);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
