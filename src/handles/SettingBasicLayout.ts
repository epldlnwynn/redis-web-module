import {HandleBasicLayout} from "./HandleBasicLayout";
import intl from "../utils/intl";



export class SettingBasicLayout extends HandleBasicLayout {

    handleTheme(theme: any, evt: any) {
        const e = evt.currentTarget.parentNode as HTMLDivElement
        e.role = theme
        localTheme.set(theme)
    }
    handleLocale(evt: any) {
        const e = evt.currentTarget as HTMLSelectElement, ctx = this.state.redisContext

        intl.setLocale(ctx.lang = e.value)
        this.setState({redisContext: {...ctx}})
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

        ctx[name] = val
        this.setState({redisContext: {...ctx}})

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


}
