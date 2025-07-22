import {HandleBasicLayout} from "./HandleBasicLayout";
import intl from "../utils/intl";
import conf from "@/utils/conf";



export class SettingBasicLayout extends HandleBasicLayout {

    handleTheme(theme: any, evt: any) {
        const e = evt.currentTarget.parentNode as HTMLDivElement
        e.role = theme
        localTheme.set(theme)
        this.state.redisContext.theme = theme
        this.updateRedisContext()
    }
    handleLocale(evt: any) {
        const e = evt.currentTarget as HTMLSelectElement, ctx = this.state.redisContext

        intl.setLocale(ctx.lang = e.value)
        this.updateRedisContext()
    }
    async handleFullScreen(e: any) {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.body.requestFullscreen.call(document.body);
        }

    }


    handleSettings(e: any) {
        this.setState({dlgSettings: true})
    }
    handleSettingsChange(evt: any) {
        const e = evt.currentTarget as HTMLSelectElement, ctx = this.state.redisContext as any
        const val = e.value, name = e.name
        if (e.type === "checkbox") {
            ctx[name] = (evt.currentTarget as HTMLInputElement).checked
        } else {
            ctx[name] = val
        }

        this.updateRedisContext()

        if (name.startsWith("ui")) {
            const D = document.body.style
            if (name.endsWith("Size")) D.fontSize = val
            if (name.endsWith("Family")) D.fontFamily = val
        }

        if (name.startsWith("editor")) {
            const D = (document.getElementById("main-layout") as HTMLDivElement).style
            if (name.endsWith("Size")) D.fontSize = val
            if (name.endsWith("Family")) D.fontFamily = val
        }


    }



    updateRedisContext() {
        this.setState({redisContext: {...this.state.redisContext}})
        conf.setSettings(this.state.redisContext)
    }

}
