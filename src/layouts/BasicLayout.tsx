import React from 'react';
import IconsSvg from "../components/icon-svg";
import Icon from "@/components/icon";
import styles from './BasicLayout.less'
import classNames from "classnames";
import Dialog from "@/components/dialog";
import intl from "@/utils/intl";
import RedisContext,{redisContext, IRedisContext} from "@/context/redis-context";
import InputFile from "@/components/input-file";
import InputNumber from "@/components/input-number";
import RedisTree from "@/components/redis-tree";
import conf from "@/utils/conf";
import APIs from "@/utils/APIs";
import {history} from "@@/core/umiExports";
import {clipboardJS} from "@/utils/common";


interface ParamType {
    redisContext: IRedisContext;
    dlgSettings: boolean;
    dlgConnection: boolean;
    editServer: Server;
    serverList: Array<Server>;
    serverIndex: number;
    sidebarWidth: string;
}


const win = window as any
win.eventBus = {}
export default class BasicLayout extends React.PureComponent<any, ParamType> {
    constructor(props: any) {
        super(props);


        this.state = {
            redisContext,
            sidebarWidth: conf.getSidebarWidth(),
            dlgSettings: false,
            dlgConnection: false,
            editServer: {name:"",db:[]},
            serverList: [],
            serverIndex: -1,

        }

        this.handleConnectionChange.bind(this)
    }


    handleEventUpdate(id: string, db: any, name: string, key: KeyInfo) {
        const {serverList} = this.state
        const server = serverList.filter(s => s.id === id)[0]
        if (!server) {
            console.log(id + ' 服务器不存在')
            return;
        }

        const dB = server.db.filter(d => d.index == db)[0]
        if (!dB) {
            console.log(db + ' 不存在')
            return;
        }

        const find = (key: string, ar: Array<KeyInfo>): (KeyInfo | undefined) => {
            for (const k of ar) {
                if (k.full == name)
                    return k;
                if (k?.children && k.children.length > 0) {
                    const v = find(key, k.children)
                    if (v) return v
                }

            }
            return undefined
        }

        const ki = find(name, dB.children);
        if (ki) {
            ki.full = key.full
            ki.name = key.full?.split(server.advancedSettings?.namespaceSeparator || ":").reverse()[0] || key.name
            ki.size = key.size
            ki.ttl = key.ttl
            this.setState({serverList:[...serverList]})
            console.log(server)
        }

        console.log(ki, key, id, db, name)
    }
    handleEventDelete(id: string, db: any, key: KeyInfo) {
        const {serverList} = this.state
        const server = serverList.filter(s => s.id === id)[0]
        if (!server) {
            console.log(id + ' 服务器不存在')
            return;
        }

        const dB = server.db.filter(d => d.index == db)[0]
        if (!dB) {
            console.log(db + ' 不存在')
            return;
        }

        const findDelete = (ar: Array<KeyInfo>) => {
            for (let i = 0; i < ar.length; i++) {
                const k = ar[i]
                if (k.full == key.full) {
                    ar.splice(i, 1)
                    this.setState({serverList: [...serverList]})
                    break;
                }
                if (k?.children && k.children.length > 0) {
                    findDelete(k.children)
                }
            }
        }

        findDelete(dB.children);
        console.log(key, id, db)
    }


    componentDidMount() {

        win.eventBus["eventUpdate"] = this.handleEventUpdate.bind(this)
        win.eventBus["eventDelete"] = this.handleEventDelete.bind(this)

        clipboardJS(".clipboard-copy", intl.get("button.copy-tip"))

        APIs.serverList().then(model => {
            const {data} = model
            if (model.isSuccess()) {
                this.setState({serverList: [...data]})
            }
        })


        let isDragging = false, offsetX: number, initialWidth: number;
        const draggable = document.getElementById('sidebar-draggable') as HTMLDivElement
        const resizable = document.getElementById('sidebar-layout') as HTMLDivElement
        const style = getComputedStyle(resizable), minWidth = parseInt(style.minWidth), maxWidth = parseInt(style.maxWidth) / 100 * document.body.offsetWidth

        draggable.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - draggable.getBoundingClientRect().left;
            initialWidth = resizable.offsetWidth; // 初始宽度
            document.body.style.cursor = 'ew-resize';
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                let x = e.clientX - offsetX;
                let widthChange = x - initialWidth + initialWidth; // 计算宽度变化量

                if (widthChange >= maxWidth) {
                    widthChange = x = maxWidth
                } else if (widthChange <= minWidth) {
                    widthChange = x = minWidth
                }
                draggable.style.left = (x - 2) + 'px';
                resizable.style.width = widthChange + 'px'; // 更新宽度
                conf.setSidebarWidth(widthChange + 'px')
            }
        });

        document.addEventListener('mouseup', function(e) {
            e.preventDefault(), e.stopPropagation()
            if (isDragging) document.body.removeAttribute("style")
            isDragging = false;
        });


    }

    componentWillUnmount() {

    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<ParamType>, snapshot?: any) { }


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

        if (!el.hasAttribute("aria-hidden")) {
            el.setAttribute("aria-hidden", "true")
            e.checked = false
            return
        }

        if (val.endsWith("tunnel")) {
            el.previousElementSibling?.setAttribute("aria-hidden", "true")
        } else {
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
            const {state, version} = model.data
            console.log(model.data)
            if (state) {
                const msg = intl.get("connection.error.success")
                alert(msg + version)
            } else {
                alert(intl.get("connection.error.fail"))
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


    handleClickServer(server: Server) {
        const {serverList} = this.state, T = this
        const i = serverList?.findIndex(s => s.id === server.id)
        this.setState({serverIndex: i})

        if (server?.state == 'open' || server.state == 'connection') return;

        server = serverList[i]
        server.state = 'connection'
        T.setState({serverList: [...serverList]})

        const source = APIs.db(server.id)
        if (source) {
            source.onopen = e => {
                server.state = 'open'
                server.expand = true
                T.setState({serverList: [...serverList]})
            };
            source.on("redis-db", data => {
                server.db = [...data]
                T.setState({serverList: [...serverList]})
            });
        }

    }
    handleClickDb(db: DbInfo) {
        console.log(db, this.state)
        if (db.state == "query" || db.state == "open")
            return;

        const {serverList, serverIndex} = this.state, T = this
        const server = serverList[serverIndex]
        const dbs = server.db[db.index]

        dbs.state = 'query'
        T.setState({serverList: [...serverList]})

        const source = APIs.keyspace(server.id, db.index)
        if (source) {
            source.onopen = e => {
                dbs.expand = true
                T.setState({serverList: [...serverList]})
            }
            source.on("keyspace", data => {
                dbs.children = [...data.children]
                T.setState({serverList: [...serverList]})
            })
            source.on("close", e => {
                dbs.state = "open"
                T.setState({serverList: [...serverList]})
            })
        }
    }
    handleClickKey(db:DbInfo, key: KeyInfo) {
        const {serverList, serverIndex} = this.state
        const server = serverList[serverIndex]

        // /info/:id/:db/:type/:name
        history.push(["", "info", server.id, db.index, key.type, key.full as string].join("/"))
    }



    render() {
        const {children} = this.props,
            {redisContext, dlgSettings, dlgConnection, editServer, serverList, sidebarWidth} = this.state,
            theme = localTheme.theme,
            sidebarStyle: any = {}

        if (sidebarWidth)
            sidebarStyle['width'] = sidebarWidth


        return (<>
            <IconsSvg></IconsSvg>

            <RedisContext.Provider value={redisContext}>
                <div className={styles.header} id="header-layout">
                    <div className="flex-row">

                        <button type="submit" onClick={this.handleNewConnection.bind(this)}>{intl.get("button.connect-redis")}</button>

                        <span className="blank"></span>

                        <div className={classNames(styles.buttonGroups, styles.social)}>
                            <button>
                                <Icon type="icon-debug"></Icon>
                            </button>
                            <button>
                                <Icon type="icon-github"></Icon>
                            </button>
                            <button>
                                <Icon type="icon-twitter"></Icon>
                            </button>
                        </div>

                        <div className={styles.buttonGroups}>
                            <button onClick={this.handleFullScreen.bind(this)}>
                                <Icon type="icon-full-screen"></Icon>
                            </button>
                            <button onClick={this.handleSettings.bind(this)}>
                                <Icon type="icon-settings"></Icon>
                            </button>
                        </div>

                    </div>
                </div>

                <div className={classNames(styles.sidebar)} id="sidebar-layout" style={sidebarStyle}>
                    <div className={classNames(styles.serverList,"scrollbar y")}>

                        <RedisTree
                            serverList={serverList}
                            clickKey={this.handleClickKey.bind(this)}
                            clickDb={this.handleClickDb.bind(this)}
                            clickServer={this.handleClickServer.bind(this)}></RedisTree>

                    </div>
                    <div className={styles.draggable} id="sidebar-draggable"></div>
                </div>

                <div className="main" id="main-layout">
                    <div className="main-wrap">{children}</div>
                </div>
            </RedisContext.Provider>

            <Dialog visible={dlgSettings}
                    title={intl.get("settings.title")}
                    onClose={e => this.setState({dlgSettings: false})}
                    className={styles.dialogSettings}
                    cancelable noScroll>
                <div className={classNames("scrollbar y")}>
                    <table>

                        <thead>
                            <tr>
                                <th colSpan={2}>{intl.get("settings.general")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>{intl.get("settings.theme")}</th>
                                <td>
                                    <div className={styles.theme} role={theme}>
                                        <span className={styles.auto} onClick={this.handleTheme.bind(this, 'auto')}>
                                            <Icon type="icon-theme-auto"></Icon>
                                        </span>
                                        <span className={styles.light} onClick={this.handleTheme.bind(this, 'light')}>
                                            <Icon type="icon-theme-light"></Icon>
                                        </span>
                                        <span className={styles.dark} onClick={this.handleTheme.bind(this, 'dark')}>
                                            <Icon type="icon-theme-dark"></Icon>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>{intl.get("settings.language")}</th>
                                <td>
                                    <select name="lang" onChange={this.handleLocale.bind(this)} defaultValue={redisContext.lang}>
                                        {intl.getLocaleAll().map(m => <option key={m.locale} value={m.locale}>{m.name}</option>)}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>{intl.get("settings.font.family")}</th>
                                <td>
                                    <select name="uiFontFamily" onChange={this.handleSettingsChange.bind(this)} defaultValue={redisContext.uiFontFamily}>
                                        {conf.FONT_FAMILY.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>{intl.get("settings.font.size")}</th>
                                <td>
                                    <select name="uiFontSize" onChange={this.handleSettingsChange.bind(this)} defaultValue={redisContext.uiFontSize}>
                                        {conf.FONT_SIZE.map(m => <option key={m} value={m+'px'}>{m}px</option>)}
                                    </select>
                                </td>
                            </tr>
                        </tbody>

                        <thead>
                            <tr>
                                <th colSpan={2}>{intl.get("settings.value.editor")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>{intl.get("settings.font.family")}</th>
                                <td>
                                    <select name="editorFontFamily" onChange={this.handleSettingsChange.bind(this)} defaultValue={redisContext.editorFontFamily}>
                                        {conf.FONT_FAMILY.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>{intl.get("settings.font.size")}</th>
                                <td>
                                    <select name="editorFontSize" onChange={this.handleSettingsChange.bind(this)} defaultValue={redisContext.editorFontSize}>
                                        {conf.FONT_SIZE.map(m => <option key={m} value={m+'px'}>{m}px</option>)}
                                    </select>
                                </td>
                            </tr>
                        </tbody>


                        <thead>
                            <tr>
                                <th colSpan={2}>{intl.get("settings.advanced")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>{intl.get("settings.advanced.confirm-same-name-overlap")}</th>
                                <td>
                                    <InputNumber />
                                </td>
                            </tr>
                            <tr>
                                <th>{intl.get("settings.advanced.maximum-number-per-page")}</th>
                                <td>
                                    <InputNumber />
                                </td>
                            </tr>
                            <tr>
                                <th>{intl.get("settings.advanced.scan-upper-limit")}</th>
                                <td>
                                    <InputNumber />
                                </td>
                            </tr>
                        </tbody>

                    </table>
                </div>
            </Dialog>

            <Dialog visible={dlgConnection}
                    title={intl.get(editServer?.name ? "connection.title-new" : "connection.title")}
                    className={styles.dialogNewConnection}
                    onClose={e => this.setState({editServer:{name:'',db:[]},dlgConnection:false})}
                    cancelable noScroll>

                <div>
                    <div className={styles.menuList}>
                        <span onClick={this.handleConnectionSettings.bind(this,0)} className={styles.active}>{intl.get("connection.settings")}</span>
                        <span onClick={this.handleConnectionSettings.bind(this,1)}>{intl.get("connection.advanced")}</span>
                    </div>

                    <div className={styles.contentWarp}>
                        <div className={styles.connectionSettings}>
                            <div className={styles.item}>
                                <label>{intl.get("connection.settings.name")}:</label>
                                <span>
                                    <input
                                        type="text"
                                        defaultValue={editServer?.name}
                                        onInput={e => this.handleConnectionChange("name", e.currentTarget.value)}
                                        placeholder={intl.get("connection.settings.name.placeholder")}/>
                                </span>
                            </div>
                            <div className={styles.item}>
                                <label>{intl.get("connection.settings.address")}:</label>
                                <span>
                                    <input type="text"
                                        defaultValue={editServer?.host}
                                        onInput={e => this.handleConnectionChange("host", e.currentTarget.value)}
                                        placeholder={intl.get("connection.settings.address.placeholder")} />
                                </span>
                                :
                                <span className={styles.port}>
                                    <input type="number"
                                           onInput={e => this.handleConnectionChange("port", e.currentTarget.value)}
                                           placeholder={intl.get("connection.settings.port.placeholder")}
                                           defaultValue={editServer?.port || 6379} />
                                </span>
                            </div>
                            <div className={styles.item}>
                                <label>{intl.get("connection.settings.password")}:</label>
                                <span>
                                    <input type="text"
                                           defaultValue={editServer?.password}
                                           onInput={e => this.handleConnectionChange("password", e.currentTarget.value)}
                                           placeholder={intl.get("connection.settings.password.placeholder")}/>
                                </span>
                            </div>
                            <div className={styles.item}>
                                <label>{intl.get("connection.settings.username")}:</label>
                                <span>
                                    <input type="text"
                                           defaultValue={editServer?.username}
                                           onInput={e => this.handleConnectionChange("username", e.currentTarget.value)}
                                           placeholder={intl.get("connection.settings.username.placeholder")} />
                                </span>
                            </div>

                            <h2>{intl.get("connection.settings.security")}</h2>
                            <div className={styles.security}>

                                <div className={styles.radioList}>
                                    <label>
                                        <input
                                            onClick={this.handleSecurityTunnel.bind(this)}
                                            defaultValue="security-ssh-tls"
                                            defaultChecked={editServer?.security?.type == "tls"}
                                            name="tunnel"
                                            type="radio"/> {intl.get("connection.settings.security.tls")}
                                    </label>
                                    <label>
                                        <input
                                            onClick={this.handleSecurityTunnel.bind(this)}
                                            defaultValue="security-ssh-tunnel"
                                            defaultChecked={editServer?.security?.type == "tunnel"}
                                            name="tunnel"
                                            type="radio"/> {intl.get("connection.settings.security.tunnel")}
                                    </label>
                                </div>

                                <div aria-hidden={(!editServer?.security?.type || editServer.security.type === "tunnel")} id="security-ssh-tls" className={styles.sshTls} >
                                    <div className={styles.item}>
                                        <label>{intl.get("connection.settings.security.tls.public")}:</label>
                                        <span>
                                            <InputFile name="security.tls.publicKey,security.tls.publicName"
                                                       text={intl.get("connection.settings.security.tls.select-file")}
                                                       accept="application/x-x509-ca-cert"
                                                       onChange={this.handleSelectFile.bind(this)}
                                                       defaultValue={editServer?.security?.tls?.publicName}
                                                       placeholder={intl.get("connection.settings.security.tls.public.placeholder")} />
                                        </span>
                                    </div>
                                    <div className={styles.item}>
                                        <label>{intl.get("connection.settings.security.tls.private")}:</label>
                                        <span>
                                            <InputFile name="security.tls.privateKey,security.tls.privateName"
                                                       text={intl.get("connection.settings.security.tls.select-file")}
                                                       accept="application/x-x509-ca-cert"
                                                       onChange={this.handleSelectFile.bind(this)}
                                                       defaultValue={editServer?.security?.tls?.privateName}
                                                       placeholder={intl.get("connection.settings.security.tls.private.placeholder")} />
                                        </span>
                                    </div>
                                    <div className={styles.item}>
                                        <label>{intl.get("connection.settings.security.tls.authority")}:</label>
                                        <span>
                                            <InputFile name="security.tls.authorityKey,security.tls.authorityName"
                                                       text={intl.get("connection.settings.security.tls.select-file")}
                                                       accept="application/x-x509-ca-cert"
                                                       onChange={this.handleSelectFile.bind(this)}
                                                       defaultValue={editServer?.security?.tls?.authorityName}
                                                       placeholder={intl.get("connection.settings.security.tls.authority.placeholder")} />
                                        </span>
                                    </div>
                                </div>

                                <div aria-hidden={(!editServer?.security?.type || editServer.security.type === "tls")} id="security-ssh-tunnel" className={styles.sshTunnel} >
                                    <div className={styles.item}>
                                        <label>{intl.get("connection.settings.security.tunnel.address")}:</label>
                                        <span>
                                            <input type="text"
                                                   defaultValue={editServer?.security?.tunnel?.host}
                                                   onInput={e => this.handleConnectionChange("security.tunnel.ip", e.currentTarget.value)}
                                                   placeholder={intl.get("connection.settings.security.tunnel.address.placeholder")}/>
                                        </span>
                                        :
                                        <span className={styles.port}>
                                            <input
                                                onInput={e => this.handleConnectionChange("security.tunnel.port", e.currentTarget.value)}
                                                placeholder={intl.get("connection.settings.security.tunnel.port.placeholder")}
                                                defaultValue={editServer?.security?.tunnel?.port || 22} type="number" />
                                        </span>
                                    </div>
                                    <div className={styles.item}>
                                        <label>{intl.get("connection.settings.security.tunnel.user")}:</label>
                                        <span>
                                            <input type="text"
                                                   defaultValue={editServer?.security?.tunnel?.username}
                                                   onInput={e => this.handleConnectionChange("security.tunnel.user", e.currentTarget.value)}
                                                   placeholder={intl.get("connection.settings.security.tunnel.user.placeholder")} />
                                        </span>
                                    </div>
                                    <div className={classNames(styles.radioList, styles.type)}>
                                        <label>
                                            <input
                                                onClick={this.handleAuthenticationType.bind(this)}
                                                defaultChecked={(!!editServer?.security?.tunnel?.privateKey && !!editServer?.security?.tunnel?.password) || true}
                                                defaultValue="authentication-type-private-key"
                                                name="authenticationType" type="radio"/>
                                            {intl.get("connection.settings.security.tunnel.private.type")}
                                        </label>
                                        <label>
                                            <input
                                                onClick={this.handleAuthenticationType.bind(this)}
                                                name="authenticationType"
                                                defaultChecked={!!editServer?.security?.tunnel?.password}
                                                defaultValue="authentication-type-password" type="radio"/>
                                            {intl.get("connection.settings.security.tunnel.password.type")}
                                        </label>
                                    </div>
                                    <div className={styles.item} aria-hidden={editServer?.security?.tunnel?.privateKey ? false : (editServer?.security?.tunnel?.password ? true : false)} id="authentication-type-private-key">
                                        <label>{intl.get("connection.settings.security.tunnel.private")}:</label>
                                        <span>
                                            <InputFile name="security.tunnel.privateKey,security.tunnel.privateName"
                                                       onChange={this.handleSelectFile.bind(this)}
                                                       text={intl.get("connection.settings.security.tunnel.private.button")}
                                                       accept="application/x-x509-ca-cert"
                                                       defaultValue={editServer?.security?.tunnel?.privateName}
                                                       placeholder={intl.get("connection.settings.security.tunnel.private.placeholder")} />
                                        </span>
                                    </div>
                                    <div className={styles.item} aria-hidden={!editServer?.security?.tunnel?.password} id="authentication-type-password">
                                        <label>{intl.get("connection.settings.security.tunnel.password")}:</label>
                                        <span>
                                            <input type="password"
                                                   defaultValue={editServer?.security?.tunnel?.password}
                                                   onInput={e => this.handleConnectionChange("security.tunnel.password", e.currentTarget.value)}
                                                   placeholder={intl.get("connection.settings.security.tunnel.password.placeholder")}/>
                                        </span>
                                    </div>

                                </div>

                            </div>
                        </div>

                        <div aria-hidden={true} className={styles.advancedSettings}>
                            <h2>{intl.get("connection.advanced.keys-loading")}</h2>
                            <div className={styles.item}>
                                <label>{intl.get("connection.advanced.keys-loading.default-filter")}:</label>
                                <span>
                                    <input type="text"
                                           onInput={e => this.handleConnectionChange("advancedSettings.defaultFilter", e.currentTarget.value)}
                                           defaultValue={editServer?.advancedSettings?.defaultFilter || "*"}
                                           placeholder={intl.get("connection.advanced.keys-loading.default-filter.placeholder")} />
                                </span>
                            </div>
                            <div className={styles.item}>
                                <label>{intl.get("connection.advanced.keys-loading.namespace-separator")}:</label>
                                <span>
                                    <input type="text"
                                           defaultValue={editServer?.advancedSettings?.namespaceSeparator || ":"}
                                           onInput={e => this.handleConnectionChange("advancedSettings.namespaceSeparator", e.currentTarget.value)}
                                           placeholder={intl.get("connection.advanced.keys-loading.namespace-separator.placeholder")} />
                                </span>
                            </div>

                            <h2>{intl.get("connection.advanced.tl")}</h2>
                            <div className={styles.item}>
                                <label>{intl.get("connection.advanced.tl.connection-timeout")}:</label>
                                <span>
                                    <InputNumber
                                        defaultValue={editServer?.advancedSettings?.connectionTimeout || 60}
                                        onChange={e => this.handleConnectionChange("advancedSettings.connectionTimeout", e)}
                                        placeholder={intl.get("connection.advanced.tl.connection-timeout.placeholder")}/>
                                </span>
                            </div>
                            <div className={styles.item}>
                                <label>{intl.get("connection.advanced.tl.execution-timeout")}:</label>
                                <span>
                                    <InputNumber
                                        defaultValue={editServer?.advancedSettings?.executionTimeout || 60}
                                        onChange={e => this.handleConnectionChange("advancedSettings.executionTimeout", e)}
                                        placeholder={intl.get("connection.advanced.tl.execution-timeout.placeholder")}/>
                                </span>
                            </div>

                            <h2>{intl.get("connection.advanced.appearance")}</h2>
                            <div className={styles.item}>
                                <label>{intl.get("connection.advanced.appearance.icon-color")}</label>
                                <span>
                                    <input type="color"
                                           defaultValue={editServer?.appearance?.iconColor}
                                           onChange={e => this.handleConnectionChange("advancedSettings.iconColor", e.currentTarget.value)}
                                          />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.buttons}>
                        <button onClick={this.handleTestConnection.bind(this)}>
                            <Icon type="icon-loading"></Icon>
                            {intl.get("connection.button.test")}
                        </button>
                        <span></span>
                        <button onClick={this.handleSaveConnection.bind(this)} type="submit">
                            <Icon type="icon-loading"></Icon>
                            {intl.get("connection.button.submit")}
                        </button>
                    </div>
                </div>

            </Dialog>

        </>)
    }

};

