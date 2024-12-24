import { Command, Option } from "commander"
import dotenv from "dotenv"

const program = new Command()

program.addOption(new Option("-m, --mode <mode>", "Modo de ejecución del script").choices(["prod", "dev"]).default("dev"))

program.parse()

let {mode}=program.opts()

dotenv.config(
    {
        path: mode === "prod" ? "./src/.env.prod" : "./src/.env.dev",
        override: true
    }
)

export const config = {
    PORT: process.env.PORT, 
    URL_MONGO: process.env.URL_MONGO,
    DB_NAME: process.env.DB_NAME,
    PASSWORD: process.env.PASSWORD,
    MODE: mode
}