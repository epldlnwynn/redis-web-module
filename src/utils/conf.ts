

const SIDEBAR_WIDTH = "sys.sidebar-width";
const REDIS_SETTINGS = "sys.settings"

const conf = {

    DEFAULT_LANGUAGE: "en-US",

    DEFAULT_FONT_SIZE: '14px',
    FONT_SIZE: [12,13,14,15,16,18,20],

    DEFAULT_FONT_FAMILY: "PingFang SC",
    FONT_FAMILY: ["PingFang SC","Arial","Times New Roman","Verdana","Helvetica","Roboto","sans-serif"],


    getSidebarWidth() {
        return localStorage.getItem(SIDEBAR_WIDTH) || ""
    },
    setSidebarWidth(width: string) {
        localStorage.setItem(SIDEBAR_WIDTH, width)
    },

    getSettings() {
        return JSON.parse(localStorage.getItem(REDIS_SETTINGS) || "{}")
    },
    setSettings(settings: any) {
        localStorage.setItem(REDIS_SETTINGS, JSON.stringify(settings))
    }

}

export const DEFAULT_SERVER: Server = {
    name: "",
    host: "",
    port: 6379,
    db: [],
    advancedSettings: {
        defaultFilter: "*",
        namespaceSeparator: ":",
        scanUpperLimit: 1000,
    }
}

export default conf
