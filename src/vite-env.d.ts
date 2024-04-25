interface ImportMetaEnv {
    readonly VITE_DB_API_KEY: string;
    readonly VITE_DB_API_ID: string;
    readonly VITE_AUTH_DOMAIN: string;
    readonly VITE_MESSAGING_SENDER_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
