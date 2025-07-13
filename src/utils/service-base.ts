import Axios, { AxiosRequestConfig } from 'axios';


// 创建请求处理对象
const axios = Axios.create({
    baseURL: process.env.server_url,
    timeout: 60000,
    withCredentials: false,
});

// 基础数据模型
export class ModelBaseImpl {
    id: any = null;
    data: any = null;
    message: string = 'OK';
    code: number = 0;

    constructor(data: any = null) {
        if (data) {
            var th: any = this;
            for (var k in data) {
                k && (th[k] = data[k])
            }
        }
    }

    isSuccess(): boolean {
        return this.message === 'OK' && this.code === 0;
    }

    static ok() {
        return new ModelBaseImpl()
    }
}

export interface ModelBase<T> extends ModelBaseImpl {
    id: any;
    message: string;
    code: number;
    data: T;
}

axios.interceptors.request.use(conf => {
    return conf;
});

// 响应拦截器
axios.interceptors.response.use(resp => {
    // 对响应数据做点什么
    const type = resp.request.responseType
    if (type === "blob") return resp;

    const data = new ModelBaseImpl(resp.data);
    if (resp.status != 200) data.code = resp.status

    return data;
}, error => {
    return Promise.reject(error);
},
);


EventSource.prototype.listeners = {}
EventSource.prototype.on = function (name, listener) {
    const call = (e: MessageEvent) => {
        const {data} = e
        if (data && isJSON(data)) {
            listener(JSON.parse(data))
            return;
        }

        listener(data)
    }
    this.listeners[name] = call
    this.addEventListener(name, call, false)
    return this
}
EventSource.prototype.off = function (name) {
    const fn = this.listeners[name]
    if (fn) this.removeEventListener(name, fn, false)
    return this
}

const Service = {
    Axios: Axios,
    baseURL: axios.defaults.baseURL,
    get<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) {
        return axios.get<T, ModelBase<T>>(url, config);
    },
    delete<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) {
        return axios.delete<T, ModelBase<T>>(url, config);
    },
    head<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) {
        return axios.head<T, ModelBase<T>>(url, config);
    },
    options<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) {
        return axios.options<T, ModelBase<T>>(url, config);
    },
    post<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
        return axios.post<T, ModelBase<T>>(url, data, config);
    },
    put<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
        return axios.put<T, ModelBase<T>>(url, data, config);
    },
    patch<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
        return axios.patch<T, ModelBase<T>>(url, data, config);
    },
    upload<T = any, D = any>(url: string, files: FileList, config?: AxiosRequestConfig<D>) {
        let param = new FormData()
        for (let i = 0; i < files.length; i++) {
            const f = files.item(i)
            f && param.append('file' + (i + 1), f, f.name)
        }

        config = config || {headers:{}}
        if (!config.headers) config.headers = {}
        config.headers["Content-Type"] = "multipart/form-data"

        return axios.post<T, ModelBase<T>>(url, param, config)
    },
    eventSource(url: string, onMessage?: (e: MessageEvent) => void) {
        if (!url.startsWith("http"))
            url = (axios.defaults.baseURL || "") + url;

        const source = new EventSource(url)
        source.addEventListener("close", e => source.close(), false)
        source.onerror = function(e){
            source.close()
            console.error(e)
        }

        if (onMessage)
            source.onmessage = e => onMessage(JSON.parse(e.data))

        return source
    }
};

export default Service;
