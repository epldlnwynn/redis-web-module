import {localeInfo} from "@@/plugin-locale/localeExports";
import React from "react";
import conf from "@/utils/conf";



export interface Intl {
    get(id: string, variables?: any): any;
    getHTML(id: string, variables?: any, type?: string): React.DOMElement<any, Element>;

    isLocale(locale: string): boolean;

    getLocale(): string;
    setLocale(lang: string): void;

    getLocaleAll(): {name:string;locale:string}[];
}



class IntlImpl implements Intl {
    #locale: string

    constructor() {
        this.#locale = this.getLocale()
    }

    get(id: string, variables?: any) {
        const lang = this.#locale, msg = localeInfo[lang]?.messages[id] || id
        return variables ? msg.format(variables) : msg
    }
    getHTML(id: string, variables?: any, type: string = 'span') {
        const lang = this.getLocale(), msg = localeInfo[lang]?.messages[id] || id
        const options: any = {
            dangerouslySetInnerHTML: {
                __html: variables ? msg.format(variables) : msg
            }
        }
        if (variables && variables['className'])
            options.className = variables.className;

        var el = React.createElement(type, options);
        var defaultMessage = function defaultMessage() {
            return el;
        };
        return Object.assign({ defaultMessage: defaultMessage, d: defaultMessage }, el)
    }


    isLocale(locale: string) {
        return this.getLocale() === locale
    }
    setLocale(lang: string) {
        localStorage.setItem("umi_locale", this.#locale = lang)
    }
    getLocale() {
        if (this.#locale)
            return this.#locale;

        let language = (localStorage.getItem("umi_locale") || navigator.language || navigator.languages[0]);
        if (!localeInfo[language])
            language = conf.DEFAULT_LANGUAGE

        return this.#locale = language
    }
    getLocaleAll() {
        const all: {name:string;locale:string}[] = [];
        Object.values(localeInfo).map(m => {
            const {locale, messages} = m
            all.push({locale, name: messages["locale.name"]})
        })
        return all
    }

}

const instance = new IntlImpl()
const get = instance.get.bind(instance)
const getHTML = instance.getHTML.bind(instance)
const isLocale = instance.isLocale.bind(instance)
const getLocale = instance.getLocale.bind(instance)
const setLocale = instance.setLocale.bind(instance)
const getLocaleAll = instance.getLocaleAll.bind(instance)

export default {
    get, getHTML, isLocale, setLocale, getLocale, getLocaleAll
}
