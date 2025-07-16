

const SIDEBAR_WIDTH = "sidebar-width";

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
