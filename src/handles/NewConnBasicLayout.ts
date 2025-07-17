import {SettingBasicLayout} from "@/handles/SettingBasicLayout";
import styles from "@/layouts/BasicLayout.less";
import APIs from "@/utils/APIs";
import intl from "@/utils/intl";
import eventBus from "listen-events";


export class NewConnBasicLayout extends SettingBasicLayout {

    constructor(props: any) {
        super(props);

        this.handleConnectionChange.bind(this)
    }

    componentDidMount() {
        super.componentDidMount();

        eventBus.on("eventDeleteConnection", this.handleDeleteConnection.bind(this))
        eventBus.on("eventReloadConnection", this.handleReloadConnection.bind(this))
        eventBus.on("eventEditConnection", this.handleEditConnection.bind(this))
        eventBus.on("eventReloadDatabase", this.handleReloadDatabase.bind(this))
        eventBus.on("eventReloadNamespace", this.handleReloadNamespace.bind(this))
    }


    handleDeleteConnection(serverId: string, e:HTMLButtonElement) {
        const server = this.findServerById(serverId)
        console.log("handleDisconnection", server)

    }
    handleReloadConnection(serverId: string) {
        const { serverList } = this.state
        const server = this.findServerById(serverId)

        server.state = 'connection'
        this.setServerList(serverList)

        const source = APIs.db(server.id)
        if (source) {
            source.onopen = e => {
                server.state = 'open'
                server.expand = true
                this.setServerList(serverList)
            };
            source.on("redis-db", data => {
                server.db = [...data]
                this.setServerList(serverList)
            });
        }

    }
    handleReloadDatabase(serverId: string, database: number) {
        const {selectServerId, selectDatabase, serverList} = this.state
        const server = this.findServerById(serverId || selectServerId)

        const dbs = server.db[database || selectDatabase], T = this

        dbs.state = 'query'
        this.setServerList(serverList)

        const source = APIs.keyspace(server.id, dbs.index)
        if (source) {
            source.onopen = e => {
                dbs.expand = true
                T.setServerList(serverList)
            }
            source.on("keyspace", data => {
                dbs.children = [...data.children]
                T.setServerList(serverList)
            })
            source.on("close", e => {
                dbs.state = "open"
                T.setServerList(serverList)
            })
        }
    }
    handleReloadNamespace(group: string) {

    }
    handleEditConnection(serverId: string) {
        const server = this.findServerById(serverId)
        this.setState({
            dlgConnection: true,
            editServer: {...server},
        })
    }


    handleNewConnection() {
        this.setState({dlgConnection: true})
    }
    handleAuthenticationType(evt: any) {
        const e = evt.currentTarget, val = e.value
        const el = document.getElementById(val) as HTMLDivElement

        if (val.endsWith("password")) {
            el.previousElementSibling?.setAttribute("aria-hidden", "true")
        } else {
            el.nextElementSibling?.setAttribute("aria-hidden", "true")
        }
        el.removeAttribute("aria-hidden")
    }
    handleSecurityTunnel(evt: any) {
        const e = evt.currentTarget, val = e.value
        const el = document.getElementById(val) as HTMLDivElement
        const { editServer } = this.state

        if (!el.hasAttribute("aria-hidden")) {
            el.setAttribute("aria-hidden", "true")
            e.checked = false
            if (editServer.security) {
                editServer.security.type = undefined
                editServer.security.tunnel = undefined
                editServer.security.tls = undefined
                this.setState({editServer: {...editServer}})
            }
            return
        }

        if (val.endsWith("tunnel")) {
            this.handleConnectionChange("security.type","tunnel")
            el.previousElementSibling?.setAttribute("aria-hidden", "true")
        } else {
            this.handleConnectionChange("security.type","tls")
            el.nextElementSibling?.setAttribute("aria-hidden", "true")
        }

        el.removeAttribute("aria-hidden")
    }
    handleConnectionSettings(index: number, evt: any) {
        const e = evt.currentTarget as HTMLSpanElement, p = (e.parentNode as HTMLDivElement).nextElementSibling as HTMLDivElement;

        p.childNodes.forEach((node, i) => {
            const div = node as HTMLDivElement
            if (index === i) {
                div.removeAttribute("aria-hidden")
            } else {
                div.setAttribute("aria-hidden", "true")
            }
        })

        if (index === 0) {
            e.nextElementSibling?.classList.remove(styles.active)
        } else {
            e.previousElementSibling?.classList.remove(styles.active)
        }
        e.classList.add(styles.active)

    }
    handleTestConnection(evt: any) {
        const e = evt.currentTarget as HTMLButtonElement
        const { editServer } = this.state

        e.disabled = true, e.role = 'icon-loading'
        APIs.serverTest(editServer).then(model => {
            console.log(model)

            if (model.isSuccess()) {
                const {state, version} = model.data
                if (state) {
                    const msg = intl.get("connection.error.success")
                    alert(msg + version)
                } else {
                    alert(intl.get("connection.error.fail"))
                }
            } else {
                toast(model.message)
            }

        }).finally(() => {
            e.disabled = false, e.role = ''
        })

    }
    handleSaveConnection(evt: any) {
        const e = evt.currentTarget as HTMLButtonElement
        const { editServer, serverList } = this.state

        e.disabled = true, e.role = 'icon-loading'
        APIs.serverSave(editServer).then(model => {
            const {data} = model

            console.log(model)

            if (model.isSuccess()) {
                editServer.id = data
                serverList.unshift(editServer)
                this.setState({serverList: [...serverList], dlgConnection: false})
            } else {
                alert(model.message)
            }

        }).catch((ex: any) => {
            console.log(ex)
        }).finally(() => {
            e.disabled = false, e.role = ''
        })
    }
    handleConnectionChange(field: string, value: any) {
        const server = this.state.editServer as any;
        const fs = field.split(".");

        if (fs.length > 1) {
            let d = server
            for (let i = 0; i < fs.length - 1; i++) {
                const f = fs[i]
                if (f in d) {
                    d = d[f]
                    continue
                }

                d = d[f] = {}
            }
            d = d[fs[fs.length - 1]] = value
        } else {
            server[field] = value
        }

        console.log(server, field, value)
    }
    handleSelectFile(e: HTMLInputElement) {
        const T = this
        if (e && e.files) {
            const names = e.name.split(","), filename = e.files[0].name
            const reader = new FileReader()
            reader.onload = e => {
                const val = e?.target?.result
                T.handleConnectionChange(names[0], val)
                T.handleConnectionChange(names[1], filename)
            }
            reader.readAsText(e.files[0])
        }
    }


}
