import {NewConnBasicLayout} from "@/handles/NewConnBasicLayout";
import APIs from "@/utils/APIs";
import eventBus from "listen-events";



export class NewKeyBasicLayout extends NewConnBasicLayout {
    protected addKeySettings: any = {type:"string"}

    constructor(props: any) {
        super(props);

        this.handleAddKeyChange.bind(this)
    }


    componentDidMount() {
        super.componentDidMount()

        eventBus.on("eventAddNewKey", this.handleAddNewKey.bind(this))
        eventBus.on("eventDeleteKey", this.handleDeleteKey.bind(this))
    }

    handleAddNewKey(group: string) {
        this.addKeySettings = {name: group || "", type:"string"}
        this.setState({dlgNewKey: true})
    }
    handleAddKeyChange(name: string, value: string) {
        this.addKeySettings[name] = value
    }
    handleAddKeySelectType(e: HTMLSelectElement) {
        this.handleAddKeyChange("type", e.value)
        const div = e.parentElement?.parentElement?.nextElementSibling
        if (div) div.role = e.value
    }
    handleAddKeySave(e: any) {
        e.stopPropagation(), e.preventDefault()
        const btn = e.currentTarget as HTMLButtonElement

        const T = this
        const {selectServerId, selectDatabase} = window
        let fun: any = null, {type, name, field, value, score, member} = this.addKeySettings

        btn.disabled = true, btn.role = 'icon-loading'

        if (type === "string")
            fun = APIs.string.set(selectServerId, selectDatabase, name, value)

        if (type === "hash")
            fun = APIs.hash.set(selectServerId, selectDatabase, name, field, value)

        if (type === "zset")
            fun = APIs.zset.add(selectServerId, selectDatabase, name, member, score)

        if (type === "list")
            fun = APIs.list.lPush(selectServerId, selectDatabase, name, value)

        if (type === "set")
            fun = APIs.sset.add(selectServerId, selectDatabase, name, value)

        fun?.then((model: any) => {
            if (model.isSuccess()) {
                const server = T.findServerById(selectServerId);
                const db = server.db[selectDatabase], sep = server?.advancedSettings?.namespaceSeparator || ":"
                const ks = name.split(sep)

                if (ks.length == 1) {
                    db.count = db.count + 1;
                    db.children.push({full: name, name, type, count: 0})
                }

                if (ks.length > 1) {
                    let data: any = db, key = '';
                    for (let i = 0; i < ks.length - 1; i++) {
                        key = ks[i]
                        const ar = data.children.filter((p: any) => p.name === key)

                        if (ar.length == 0) {
                            data.children.push({full: ks.slice(0, i + 1).join(sep), name: key, count: 0, children:[]})
                            data = data.children[data.children.length - 1]
                        } else {
                            data = ar[0]
                        }
                        console.log(key, i, ar)
                    }

                    key = ks[ks.length - 1]
                    data.count = data.count + 1;
                    data.children.push({full:name, name:key, type, count:0, children:[]})

                    console.log(db)
                }

                T.updateServerList()
                T.setState({dlgNewKey: false})
                btn?.form?.reset()
            }
        }).finally(() => {
            btn.disabled = false, btn.role = ''
        })

    }
    handleDeleteKey(groupKey: string, e: HTMLButtonElement) {
        const {selectServerId, selectDatabase} = window

        e.disabled = true
        APIs.delete(selectServerId, selectDatabase, groupKey, true).then(model => {
            if (model.isSuccess()) {
                this.deleteKey(groupKey)
            } else {
                toast(model.message)
            }
        }).finally(() => {
            e.disabled = false
        })
    }



}
