import ClipboardJS from "clipboard";


export const clipboardJS = function(selector: string, message = "Copied!") {
    const clipboard = new ClipboardJS(selector)
    clipboard.on("success", e => {
        toast(message);
        e.clearSelection()
    });
    clipboard.on("error", e => alert(e.text))

    return clipboard
};

export const localTimeZone = function () {
    // 正数表示东时区，负数表示西时区，如中国上海 东时区 8小时
    const date = new Date();
    const num = date.getTimezoneOffset() / -60
    return {
        offsetHour: num, // 如: 8
        offsetSecond: num * 60 * 60, // 如: 28800
        timeZone: date.getTimezoneOffset(), // 如: -480
        timeZoneName: Intl.DateTimeFormat().resolvedOptions().timeZone, // 如: Asia/Shanghai
        Id: date.toTimeString().split(" ")[1], // 如: GMT+0800
    }
};

export const textareaAutoHeight = function(e: HTMLTextAreaElement) {
    const style = getComputedStyle(e), maxHeight = parseInt(style.maxHeight)

    e.style.height = 'auto';
    e.scrollTop = 0; // 防抖动
    e.style.height = Math.min(e.scrollHeight, maxHeight)  + 'px';
};


const colors = ['red', 'orange', 'violet', 'green', 'cyan', 'pink', 'blue', 'brown', 'navy', 'teal'];
export const randomColor = function (id?: number) {
    if (!id) return "none";
    return colors[id % colors.length]
};

export const countDownTask = (endTime: number, handler?: (dt: {day:string,hour:string,minute:string,second:string}) => void, timeoutSecond: number = 1) => {
    const S = 1000, M = 60000, H = 3600000, D = 86400000, time = new Date().getTime();
    const dt: any = {}, f = (t: number, u: number) => {
        const n: number = parseInt((t / u).toString())
        if (n <= 0) return '00';
        return (n < 10 ? '0' : '') + n;
    }, F = () => {
        let tt = t;
        dt.day = f(tt, D)
        dt.hour = f(tt = tt % D, H)
        dt.minute = f(tt = tt % H, M)
        dt.second = f(tt = tt % M, S)

        t = t - (timeoutSecond * S)
        handler && handler(dt)
        t <= 0 && window.clearInterval(T)
    };
    let t = endTime - time, T = 0;
    if (t > 0) {
        handler && (T = window.setInterval(F, timeoutSecond * S))
        F()
    } else {
        dt.day = dt.hour = dt.minute = dt.second = "00";
        handler && handler(dt)
    }

    return dt;
}


export function downloadFile(content: any, filename: string, mimeType: string = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url, a.download = filename, a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}


export default {
    uuid,
    downloadFile,
    clipboardJS,
    textareaAutoHeight,
    localTimeZone
}
