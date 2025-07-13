import {createContext} from "react";
import intl from "@/utils/intl"
import conf from "@/utils/conf";


export interface IRedisContext {
    lang: string;  // 默认语言
    theme: string;  // 默认主题

    uiFontSize: string;   // UI界面的字号
    uiFontFamily: string;   // UI界面的字体
    editorFontSize: string;  // 编辑器字号
    editorFontFamily: string;  // 编辑器字体


    confirmSameNameOverlap: boolean; // 同名覆盖需要二次确认
    maximumNumberPerPage: number;  // 每页最大条数/Maximum amount of items per page
    scanUpperLimit: number;  // Limit for SCAN command/SCAN 命令的限制数量
}


export const redisContext = {

    lang: intl.getLocale(),
    theme: localTheme.theme,

    uiFontSize: conf.DEFAULT_FONT_SIZE,
    uiFontFamily: conf.DEFAULT_FONT_FAMILY,

    editorFontSize: conf.DEFAULT_FONT_SIZE,
    editorFontFamily: conf.DEFAULT_FONT_FAMILY,

    confirmSameNameOverlap: true,
    maximumNumberPerPage: 1000,
    scanUpperLimit: 1000,

} as IRedisContext


const RedisContext = createContext<IRedisContext>(redisContext)
export default RedisContext


