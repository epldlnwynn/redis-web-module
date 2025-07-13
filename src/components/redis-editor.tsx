import {FC} from "react";
import styles from "./redis-editor.less"
import Icon from "@/components/icon";
import classNames from "classnames";
import intl from "@/utils/intl";
import cryptos from "@/utils/cryptos";
import {downloadFile} from "@/utils/common";
import Dialog from "@/components/dialog";
import InputButton from "@/components/input-button";


interface Props {
    data: KeyInfo;

    handleReloadValue?: (e: HTMLButtonElement) => void;
    handleDelete?: (name: string, e: HTMLButtonElement) => void;
    handleSaveTtl?: (ttl: any, e: HTMLButtonElement) => void;
    handleRenameSave?: (oldName: string, newName: string, e: HTMLButtonElement) => void;
    handleSaveItem?: (field: string, value: string, e: HTMLButtonElement) => void;
    handleSaveValue?: (value: string, e: HTMLButtonElement) => void;
    handleSelectedItem?: (item: any, index: number) => void;
}


let index = 0;

const hash: FC<Props> = (p) => {

    return <table>
        <colgroup>
            <col style={{width:'100px'}} />
            <col style={{width:'40%'}} />
            <col />
        </colgroup>
        <thead>
            <tr>
                <th>#</th>
                <th>Key</th>
                <th>Value</th>
            </tr>
        </thead>
        <tbody>
            {p.data.children?.map((item, i) => {
                return <tr key={item.field} onClick={e => handleItem(p, item, i, e)} className={i == p.data.itemIndex ? styles.active : ''}>
                    <td>{++index}</td>
                    <td>{item.field}</td>
                    <td>{item.value}</td>
                </tr>
            })}
        </tbody>
    </table>
};
const zset: FC<Props> = (p) => {

    return <table>
        <colgroup>
            <col style={{width:'100px'}} />
            <col style={{width:'40%'}} />
            <col />
        </colgroup>
        <thead>
            <tr>
                <th>#</th>
                <th>Value</th>
                <th>Score</th>
            </tr>
        </thead>
        <tbody>
        {p.data.children?.map((item, i) => {
            return <tr key={item.value} onClick={e => handleItem(p, item, i, e)} className={i == p.data.itemIndex ? styles.active : ''}>
                <td>{++index}</td>
                <td>{item.value}</td>
                <td>{item.score}</td>
            </tr>
        })}
        </tbody>
    </table>
};
const listOrSet: FC<Props> = (p) => {

    return <table>
        <colgroup>
            <col style={{width:'100px'}} />
            <col />
        </colgroup>
        <thead>
        <tr>
            <th>#</th>
            <th>Value</th>
        </tr>
        </thead>
        <tbody>
        {p.data.children?.map((item, i) => {
            return <tr key={index} onClick={e => handleItem(p, item, i, e)} className={i == p.data.itemIndex ? styles.active : ''}>
                <td>{++index}</td>
                <td>{item}</td>
            </tr>
        })}
        </tbody>
    </table>
}




const SERIALIZE_LIST = ["Plain Text","JSON","HEX","Binary","Base64 To Text","Base64 To JSON"]
const handleSelectChange = (e: HTMLSelectElement, rawData: any) => {
    const div = e.parentNode as HTMLDivElement, ta = div.nextElementSibling as HTMLTextAreaElement
    const type = e.value

    try {

        if (type === "0") {
            ta.value = isStr(rawData) ? rawData : JSON.stringify(rawData)
        }

        if (type === "1")
            ta.value = JSON.stringify(isObject(rawData) ? rawData : JSON.parse(rawData), undefined, 4)

        if (type === "2")
            ta.value = cryptos.decodeHex(rawData)

        if (type === "3")
            ta.value = cryptos.binary(rawData)

        if (type === "4")
            ta.value = cryptos.decodeHex(rawData)

        if (type === "5")
            ta.value = JSON.stringify(cryptos.decodeHex(rawData), undefined, 4)

    } catch (e) {
        // @ts-ignore
        e && toast(e.message)
        console.error(e)
    }

}
const handleRenameSave = (p: Props, e: HTMLButtonElement) => {
    if (!confirm(intl.get("editor.save.key.confirm"))) return;

    const input = e.previousElementSibling as HTMLInputElement
    const oleName = input.defaultValue || input.value

    if (oleName == input.value) return;

    p.handleRenameSave && p.handleRenameSave(oleName, input.value, e)
}
const handleDelete = (p: Props, e: HTMLButtonElement) => {
    if (!confirm(intl.get("editor.delete.tip.confirm"))) return;

    p.handleDelete && p.handleDelete(p.data.full || p.data.name, e)
}

let prevTr: any = null
const handleItem = (p:Props, item: KeyInfo, index: number, e: any) => {
    const tr = e.currentTarget
    tr.classList.add(styles.active)
    prevTr?.classList.remove(styles.active)
    prevTr = tr

    p.handleSelectedItem && p.handleSelectedItem(item, index)
}


const handleExportFile = (e: HTMLButtonElement, key: KeyInfo) => {
    const div = e.parentNode as HTMLDivElement, ta = div.nextElementSibling as HTMLTextAreaElement
    const val = ta.value

    const isJSON = val.startsWith('{') || val.startsWith('[')
    const filename = key.name + (isJSON ? ".json" : ".txt")

    downloadFile(val, filename, isJSON ? "application/json" : "text/plain")
}
const handleSaveValue = (p: Props, e: HTMLButtonElement) => {
    // @ts-ignore
    const ta = e.parentNode?.nextElementSibling as HTMLTextAreaElement
    console.log(ta, ta.value)
    p.handleSaveValue && p.handleSaveValue(ta.value, e)
}
const handleSaveItem = (p: Props, e: HTMLButtonElement) => {
    // @ts-ignore
    const editor = e.parentNode.parentNode.parentNode
    const key = editor?.querySelector("#editor-key") as HTMLTextAreaElement
    const val = editor?.querySelector("#editor-value") as HTMLTextAreaElement
    p.handleSaveItem && p.handleSaveItem(key.value, val.value, e)
}
const handleTtlEdit = (e: HTMLButtonElement) => {
    const dlg = document.getElementById("setting-key-ttl")
    dlg?.removeAttribute("hidden")
}
const handleSaveTtl = (p: Props, value: string, e: HTMLButtonElement) => {
    const dlg = document.getElementById("setting-key-ttl")
    if (p.data?.ttl?.toString() == value) {
        dlg?.setAttribute("hidden", "true")
        return;
    }

    const unitTime = [1,60 * 100, 60 * 60 * 1000];
    const unit = dlg?.querySelector<HTMLSelectElement>("#setting-key-ttl-unit")
    const ttl = Math.floor(parseFloat(value) * unitTime[unit?.selectedIndex || 0])

    p.handleSaveTtl && p.handleSaveTtl(ttl, e)
    dlg?.setAttribute("hidden", "true")
}


const serializeType = (data: any) => {
    if (isObject(data) || isJSON(data))
        return 1

    return 0
}

const RedisEditor: FC<Props> = (p) => {
    index = 0;
    const key = p.data
    let serializeIndex = serializeType(key.content)
    const content = isObject(key.content) ? JSON.stringify(key.content, undefined, 4) : key.content

    return <div className={styles.stringItem}>

        <div className={styles.header}>
            <label>{key.type}</label>
            <InputButton
                icon="icon-save"
                defaultValue={key.full}
                key={key.full}
                name="key-name"
                onClick={(v, e) => handleRenameSave(p, e)}></InputButton>
            <button id={`info_ttl`} type="button" onClick={e => handleTtlEdit(e.currentTarget)}>
                <Icon type="icon-time"></Icon>
                TTL: <i>{key.ttl}</i>
            </button>
            <button type="button" onClick={e => handleDelete(p, e.currentTarget)}>
                <Icon type="icon-delete"></Icon>
                {intl.get("editor.toolbar.button.delete")}
            </button>
            <button type="button" onClick={e => p.handleReloadValue && p.handleReloadValue(e.currentTarget)}>
                <Icon type="icon-reload"></Icon>
                {intl.get("editor.toolbar.button.reload")}
            </button>
        </div>

        <div className={styles.editorContainer}>

            <div role={key.type} aria-hidden={key.type == "string"} className={classNames(styles.editTable, "scrollbar y")}>
                {key.type === "hash" && hash(p)}
                {key.type === "zset" && zset(p)}
                {key.type === "list" && listOrSet(p)}
                {key.type === "set" && listOrSet(p)}
            </div>

            <div role={key.type} aria-hidden={key.type == "string" || key.type == "list" || key.type == "set"} className={styles.editorKey}>

                <div className={styles.toolbar}>
                    <dl>
                        <dt>{intl.get("editor.toolbar.length.title")}:</dt>
                        <dd>{key.children?.length || 0} {intl.get("editor.toolbar.length.unit")}</dd>
                    </dl>
                    <p></p>
                    <button type="button" className="clipboard-copy" data-clipboard-action="copy" data-clipboard-target="#editor-key">
                        <Icon type="icon-copy"></Icon>
                        {intl.get("editor.toolbar.button.copy")}
                    </button>
                    <button type="button" onClick={e => handleSaveItem(p, e.currentTarget)}>
                        <Icon type="icon-save"></Icon>
                        {intl.get("editor.toolbar.button.save")}
                    </button>
                </div>

                <textarea
                    key={key.field + "_" + key.full}
                    id="editor-key"
                    name="editor-key"
                    defaultValue={key.field}></textarea>

            </div>

            <div role={key.type} className={classNames(styles.editorValue)}>

                <div className={styles.toolbar}>
                    <dl>
                        <dt>{intl.get("editor.toolbar.size.title")}:</dt>
                        <dd>{p.data.size} {intl.get("editor.toolbar.size.unit")}</dd>
                    </dl>
                    <p></p>
                    <select key={serializeIndex} onChange={e => handleSelectChange(e.currentTarget, key.content)} defaultValue={serializeIndex}>
                        {SERIALIZE_LIST.map((name,i) => <option key={name} value={i} defaultChecked={i === serializeIndex}>{name}</option>)}
                    </select>
                    <button type="button" className="clipboard-copy" data-clipboard-action="copy" data-clipboard-target="#editor-value">
                        <Icon type="icon-copy"></Icon>
                        {intl.get("editor.toolbar.button.copy")}
                    </button>
                    <button type="button" onClick={e => handleExportFile(e.currentTarget, key)}>
                        <Icon type="icon-export"></Icon>
                        {intl.get("editor.toolbar.button.export")}
                    </button>
                    <button type="button" aria-hidden={key?.type == 'hash' || key.type == "zset"} onClick={e => handleSaveValue(p, e.currentTarget)}>
                        <Icon type="icon-save"></Icon>
                        {intl.get("editor.toolbar.button.save")}
                    </button>
                </div>

                <textarea
                    key={content+key.full}
                    id="editor-value"
                    name="editor-value"
                    defaultValue={content}></textarea>

            </div>

        </div>

        <Dialog id="setting-key-ttl" title={intl.get("editor.toolbar.ttl.title")} visible={false} className={styles.dialogEditorTTL}>
            <div>
                <select id="setting-key-ttl-unit" defaultValue={1}>
                    {intl.get("editor.toolbar.ttl.unit").map((name: string, index: number) => <option key={index} value={index}>{name}</option>)}
                </select>
                <InputButton icon="icon-save"
                             defaultValue={key.ttl}
                             placeholder={intl.get("editor.toolbar.ttl.placeholder")}
                             onClick={(value, e) => handleSaveTtl(p, value, e)}
                />
            </div>
        </Dialog>

    </div>
}


export default RedisEditor
