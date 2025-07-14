declare module "*.css";
declare module "*.less";
declare module "*.png";
declare module "*.jpg";
declare module "*.gif";
declare module "*.svg" {
    export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
    const url: string;
    export default url;
}


interface RedisInfo {
    name: string;
    state?: 'connection' | 'open' | 'close' | undefined;
    expand?: boolean;

    db: Array<DbInfo>;
}
interface DbInfo {
    index: number;
    count: number;
    state: 'query' | 'open' | 'close' | undefined;
    expand?: boolean;

    children: Array<KeyInfo>;
}
interface KeyInfo {
    name: string;
    count: number;


    full?: string;
    type?: string;
    ttl?: number;
    size?: number;
    expand?: boolean;

    itemIndex?: number;
    field?:string;
    content?: any;
    children?: Array<KeyInfo | any>;
}
interface ItemValue {

}

interface Server extends RedisInfo {
    id?: string;
    host?: string;
    port?: number;
    password?: string;
    username?: string;

    security?: {
        type: 'tls' | 'tunnel' | undefined;
        tls?: {
            publicKey: string;
            publicName?: string;
            privateKey: string;
            privateName?: string;
            authorityKey: string;
            authorityName?: string;
        },
        tunnel?: {
            host: string;
            port: number;
            username: string;
            password?: string;
            privateKey?: string;
            privateName?: string;
        }
    };

    advancedSettings?: {
        defaultFilter: string;
        namespaceSeparator: string;
        scanUpperLimit?: number;
        connectionTimeout: number;
        executionTimeout: number;
    };

    appearance?: {
        iconColor?: string;
    }

}

interface Logger {
    enable(e: boolean): boolean;
    d(s: any, ...p: any): void;
    i(s: any, ...p: any): void;
    w(s: any, ...p: any): void;
    e(e: any, s: any, ...p: any): void;
}

interface IDataStorage {
    get<T = any>(key: string, defaultValue?: any): T | null;
    set<T = any>(key: string, data: T, expireSecond?: number): T;
    del(key: string): void;
    key(index: number): string | null;
    keys(): Array<string>;
    length(): number | 0;
}

interface ICookie {
    get(key: string, defaultValue?: any): string;
    set(key: string, value: any, expires?: number, path?: string, domain?: string, secure?: string): void;
    del(key: string): void;
}

interface String {
    ellipsis(len: number, separator?: string, textOverflow?: string): string;
}

interface Window {
    loadCss(paths: Array<string>, dela?: number): void;
    loadJS(url: string, success?: () => void): void;
}

interface DateConstructor {
    DAYS: number;
}

interface EventSource {
    listeners: {
        [name: string]: (e: any) => void;
    };

    on<T = any>(name: string, listener: (data: T) => void): this;

    off(name: string): this;
}



declare var $: (selector: string) => any,
    log: Logger,
    localTheme: {
        theme: string;
        isLight: boolean;
        init(): void;
        set(theme: 'auto' | 'light' | 'dark', canEl?: boolean): void;
    },
    dataStorage: IDataStorage,
    cookie: ICookie,
    isFunction: (a: any) => boolean,
    isArray: (a: any) => boolean,
    isObject: (a: any) => boolean,
    isBase64: (a: any) => boolean,
    isStr: (a: any) => boolean,
    isJSON: (a: any) => boolean,
    uuid: (format?:string) => string,
    toast: (text: string, icon?: string | undefined | null, delay?: number, className?: string) => {el: HTMLDivElement, hide(animated?:boolean): void},
    sleep: (timeout: number) => Promise<void>
;


