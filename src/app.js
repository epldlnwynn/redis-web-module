[1];

export function onRouteChange({ location, routes, action }) {
    console.log("onRouteChange", location, routes, action);

    document.body.setAttribute("data-path", location.pathname === '/' ? '/index.html' : location.pathname);
}


const THEME_NAME = "theme-prefers-color";
window.localTheme = {
    get theme() { return localStorage.getItem(THEME_NAME) || 'auto' },
    get isLight() { return window.matchMedia("(prefers-color-scheme)").matches },
    set(e, f = true) {
        if (e === 'auto') {
            localStorage.removeItem(THEME_NAME)
            document.documentElement.setAttribute(THEME_NAME, this.isLight ? "light" : "dark")
        } else {
            document.documentElement.setAttribute(THEME_NAME, e)
            f && localStorage.setItem(THEME_NAME, e)
        }
    },
    init() {
        if (this.theme === 'auto') {
            const themeMatch = window.matchMedia("(prefers-color-scheme)")
            themeMatch.addEventListener("change", e => {
                // e.matches true 表示浅色(light)， false 表示深色(dark)
                localTheme.set(e.matches ? "light" : "dark", false)
            })
            localTheme.set(themeMatch.matches ? "light" : "dark", false)
        } else {
            localTheme.set(localTheme.theme, false)
        }
    }
}
window.localTheme.init()


!function (W) {
    W.Date.MILLISECONDS = 1000,
        W.Date.SECONDS = 1 * W.Date.MILLISECONDS,
        W.Date.MINUTES = 60 * W.Date.SECONDS,
        W.Date.HOURS = 60 * W.Date.MINUTES,
        W.Date.DAYS = 24 * W.Date.HOURS;

    Element.prototype.parents=function(selector){
        // #id .class
        const c = selector.charAt(0)

        const findId = (id,n) => {
            if (!n) return null
            if (n.id == id) return n
            return findId(id,n.parentNode)
        }

        if (c === "#")
            return findId(selector.substring(1),this)

        const findClass = (cls,n) => {
            if (!n || !n.classList) return null
            if (n.classList.contains(cls))
                return n
            return findClass(cls, n.parentNode)
        }
        if (c === ".")
            return findClass(selector.substring(1),this)


        const findAttr = (k,v,n) => {
            if (!n) return null
            if (n.getAttribute(k) == v) return n
            return findAttr(k,v,n.parentNode)
        }
        const [all, key, value] = selector.replace("'","").replace('"',"").match(/\[([\w\-]+)=(\w+)\]/)
        return findAttr(key,value, this)
    };
    String.prototype.ellipsis = function(len, separator, textOverflow) {
        const t = this, symbols = separator || '...';
        if (textOverflow == 'left') {
            if (t.length >= len)
                return symbols + t.substring(0, len)
        }

        if (textOverflow == 'right') {
            if (t.length >= len)
                return t.substring(0, len) + symbols
        }

        if (len * 2 > t.length) return t;
        return [t.substring(0, len), t.substring(t.length - len)].join(symbols)
    };
    String.prototype.format = function(args){
        var f = this, b = f.match(/\{([\d|\w|\.|\_]*)\}/g),t,v;
        if(b != null) {
            for (var i = 0; i < b.length; i++) {
                t = b[i].replace(/\{|\}/g,'')
                v = args[t],
                    f = f.replace(b[i],typeof(v) != 'undefined' ? v : "")
            }
        }
        return f
    };
    String.prototype.colorRgba = function() {
        var c = this.substring(1).toLowerCase(), m = ['R','G','B','A'], R = {}, i = 0;
        if (c.length === 3) c = c.replace(/[\w]/g, x => x + x);

        c.replace(/[\w]{2}/g, x => {R[m[i]] = parseInt("0x" + x), ++i}),
        R.A && (R.A = parseFloat((R.A / 255).toFixed(2)));
        return R
    };
    Date.prototype.format = function(format) {
        const D=function(n){return n < 10 ? '0'+n : n},T=this,W=["日","一","二","三","四","五","六"];
        return format.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|w{1,4}|yy(?:yy)?|([YwhHMstT])\1?|[lLZ])\b/ig, function(s){
            switch(s) {
                case 'yyyy':
                case 'Y':return T.getFullYear();
                case 'M':return T.getMonth()+1;
                case 'MM':return D(T.getMonth()+1);
                case 'MMM':return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][T.getMonth()];
                case 'MMMM':return ['January','February','March','April','May','June','July','August','September','October','November','December'][T.getMonth()];
                case 'd':return T.getDate();
                case 'dd':return D(T.getDate());
                case 'W':return W[T.getDay()];
                case 'WW':return '周'+W[T.getDay()];
                case 'WWW':return '星期'+W[T.getDay()];
                case 'h':return T.getHours()%12||12;
                case 'hh':return D(T.getHours()%12||12);
                case 'H':return T.getHours();
                case 'HH':return D(T.getHours());
                case 'm':return T.getMinutes();
                case 'mm':return D(T.getMinutes());
                case 's':return T.getSeconds();
                case 'ss':return D(T.getSeconds());
                case 'tt':return T.getHours()<12?'am':'pm';
                case 'TT':return T.getHours()<12 ?'AM':'PM';
                case 'Z':return T.toUTCString().match(/[A-Z]+$/);
                default :return s.substr(1,s.length - 2)
            }
        });
    };
    Date.prototype.addDay=function(days) {this.setTime(this.getTime() + (days * 86400000));return this};
    W.localStorage.constructor.prototype.getJSON = function(k){const s = W.localStorage.getItem(k);return JSON.parse(s?s:null)};
    W.localStorage.constructor.prototype.setJSON = function(k,v){v&&W.localStorage.setItem(k,JSON.stringify(v));return v};
    W.isFunction = function(a){return "function"===typeof(a)};
    W.isArray = Array.isArray;
    W.isJSON = function(a){
        const t = typeof(a)
        if (t !== "string")
            return false;

        let s = a.toString(), pos = 0;
        if (s.length  <= 1) return false;
        if (s.charAt(pos) == '"' || s.charAt(pos) == "'" || s.charAt(pos) == "\\") pos = 1;

        return s.charAt(pos) === '{' || s.charAt(pos) === '['}
    W.isStr = function(a){return "string"===typeof(a)}
    W.isObject = function(a){return "object" === typeof(a)}
    W.isBase64 = function(s){if (!s || typeof(s) !== 'string') return false;return /^[A-Za-z0-9+/]+={0,2}$/.test(s)}
    W.isNumber = function(k){return /[0-9]/g.test(k)};
    W.sleep = function(timeout) {return new Promise((resolve) => setTimeout(resolve, timeout))}
    W.cookie = {
        get(k, df = null){
            const ck = document.cookie
            if(ck.length > 0){
                var a = k + "=",beg = ck.indexOf(a),end;
                if(beg > -1) {
                    beg += a.length, end = ck.indexOf(";",beg);
                    if(end == -1) end = ck.length;
                    return decodeURIComponent(ck.substring(beg,end))
                }
            }
            return df
        },
        set(k, v, expires, path, domain, secure) {
            const c = [], date = new Date(), time = date.getTime();
            c.push(k, '=', encodeURIComponent(v)),
            expires && (date.setTime(expires * Date.DAYS + time), c.push(';expires=', date.toGMTString())),
            path && c.push('; path=' , path),
            domain && c.push('; domain=' , domain),
            secure && c.push('; secure'),
                c.push('; SameSite=Lax'),
                document.cookie = c.join('')
            return v;
        },
        del(k){
            const date = new Date()
            date.setTime(date.getTime() - 1000);
            document.cookie=[k,'=; path=',path,'; expires=',date.toGMTString()].join('');
        },
    };
    W.loadCss = function (paths,delay) {
        const ar = typeof(paths) === "string" ? paths.split(",") : paths;
        const head = document.getElementsByTagName("head")[0]
        window.setTimeout(function () {
            ar.map((m, i) => {
                const css = document.createElement("link");
                css.rel = "stylesheet", css.type = "text/css", css.href = m;
                css.onload = function (e) {
                    log.i("load css", m)
                }
                head.appendChild(css)
            })
        }, delay || 0)
    };
    W.loadJS = function (url, success) {
        var domScript = document.createElement('script');
        domScript.src = url;
        success = success || function () {};
        domScript.onload = domScript.onreadystatechange = function () {
            if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
                success();
                this.onload = this.onreadystatechange = null;
                this.parentNode.removeChild(this);
            }
        }
        document.getElementsByTagName('head')[0].appendChild(domScript);
    };
    W.dataStorage = {
        get: function (key, defaultValue) {
            const val = localStorage.getItem(key);
            if (!val) return defaultValue === undefined ? null : defaultValue;

            const c = val.charAt(0);
            if (c === '[' || c === '{') {
                const data = JSON.parse(val);
                if (data.TIME_MANAGER) {
                    const time = new Date().getTime();
                    if (time > data.timestamp) {
                        this.del(key);
                        return defaultValue === undefined ? null : defaultValue
                    }
                    return data.data
                }
                return data
            }
            return val
        },
        set: function (key, value, expireSecond) {
            var data = value;

            if (expireSecond) {
                const obj = { TIME_MANAGER: true, data: value }, time = new Date().getTime();
                obj.timestamp = (time + expireSecond * 1000);
                data = obj;
            }
            if (typeof (data) === "object")
                data = JSON.stringify(data);

            return localStorage.setItem(key, data), value;
        },
        del: function (key) { console.log("delete", key), localStorage.removeItem(key) },
        key: function (index) { return localStorage.key(index) },
        keys: function () {
            const keys = [], len = localStorage.length;
            for (var i = 0; i < len; i++) keys.push(localStorage.key(i));
            return keys;
        },
        length: function () { return localStorage.length }
    };
    W.toast = function (text, icon, delay, className) {
        let message = text;
        if (typeof(text) === "object") {
            message = text["message"],
                icon = text["icon"],
                delay = text["delay"] || 3
        } else {
            delay = delay || 3
        }


        const layout = document.createElement("div"),
            h = [],
            showCss = "fadeInDown",
            hideCss = "fadeOutUp";

        icon && h.push('<span class="icon ',icon,'"><svg><use xlink:href="#icon-',icon,'"></use></svg></span>')
        message && h.push('<span class="text">',message,'</span>')

        layout.classList.add("toast-layout", showCss),
            layout.innerHTML = h.join("");

        className && layout.classList.add(className)

        const timer = window.setTimeout(() => {
            layout.classList.remove(showCss)
            layout.classList.add(hideCss)
            window.setTimeout(() => layout.remove(), 3000)
        }, delay * 1000)

        document.body.appendChild(layout)

        return {
            el: layout,
            hide(animated){
                timer && window.clearTimeout(timer)
                if (animated != false) {
                    layout.classList.remove(showCss)
                    layout.classList.add(hideCss)
                    window.setTimeout(() => layout.remove(), 3000)
                } else {
                    layout.remove()
                }
            }
        }
    };
    W.location.query = function(a, df = null) {
        const c = W.location.search.substring(1),b = c.match(new RegExp("(^|&)"+ a +"=([^&]*)(&|$)"));
        return b ? decodeURIComponent(b[2]) : df
    };
    W.uuid = function (format) {
        let d = new Date().getTime(), tmp = format || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        if (window.performance && isFunction(window.performance.now)) {
            d += window.performance.now();
        }
        return tmp.replace(/[xy]/g, function (c) {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        })
    };
    W.debugging = true;//(localStorage.getItem('debugging') || process.env.NODE_ENV === 'development' || false);
    W.log = {
        enable: (e) => {
            return e === undefined ? window.debugging : (window.debugging = e);
        },
        d: function (s, ...p) {
            debugging && (p.unshift(s), this.__w('debug',p));
        },
        i: function (s, ...p) {
            debugging && (p.unshift(s), this.__w('info',p));
        },
        w: function (s, ...p){
            debugging && (p.unshift(e, s), this.__w('warn',p));
        },
        e: function (e, s, ...p) {
            debugging && (p.unshift(e, s), this.__w('error',p));
        },
        __w: function (m, p){
            window['console'][m].apply(this, p)
        }
    };
    W.bug = function () {
        function e() {
            setInterval(() => Function("debugger")() , 1e3)
        }
        try {
            e()
        } catch (t) {}
    }
    //bug()
}(window);
