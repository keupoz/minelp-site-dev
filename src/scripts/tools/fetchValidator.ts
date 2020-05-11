import { object, string } from "@mojotech/json-type-validation";

export const ResponseDecoder = object({
    error: string()
});
