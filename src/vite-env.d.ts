/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_DB_API_KEY: string;
    readonly VITE_DB_API_ID: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
