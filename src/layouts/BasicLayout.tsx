import React from 'react';
import IconsSvg from "../components/icon-svg";
import Icon from "@/components/icon";
import styles from './BasicLayout.less'
import classNames from "classnames";
import Dialog from "@/components/dialog";
import intl from "@/utils/intl";
import RedisContext from "@/context/redis-context";
import InputFile from "@/components/input-file";
import InputNumber from "@/components/input-number";
import RedisTree from "@/components/redis-tree";
import conf, {DEFAULT_SERVER} from "@/utils/conf";
import APIs from "@/utils/APIs";
import {history} from "@@/core/umiExports";
import {clipboardJS, dragByWidth} from "@/utils/common";
import {NewKeyBasicLayout} from "@/handles/NewKeyBasicLayout";




export default class BasicLayout extends NewKeyBasicLayout {

    constructor(props: any) {
        super(props);
    }


    componentDidMount() {
        super.componentDidMount()


        clipboardJS(".clipboard-copy", intl.get("button.copy-tip"))

        APIs.serverList().then(model => {
            const {data} = model
            if (model.isSuccess()) {
                this.setState({serverList: [...data]})
            }
        })

        dragByWidth("sidebar-draggable", "sidebar-layout", styles.active)

    }



    handleClickServer(server: Server) {
        if (server?.state == 'open' || server.state == 'connection') return;

        if (!server.id) return;

        this.handleReloadConnection(server.id)

        window.selectServer = server;
        window.selectServerId = server.id;
        window.selectDatabase = -1;
    }
    handleClickDb(serverId: string, db: DbInfo) {
        if (db.state == "query" || db.state == "open")
            return;

        window.selectServer = this.findServerById(serverId);
        window.selectServerId = serverId;
        window.selectDatabase = db.index;

        this.handleReloadDatabase(serverId, db.index)
    }
    handleClickKey(serverId: string, db:DbInfo, key: KeyInfo) {
        window.selectServer = this.findServerById(serverId);
        window.selectServerId = serverId;
        window.selectDatabase = db.index;
        window.selectKeyType = key.type

        history.push(["", "info", serverId, db.index, key.full as string].join("/"))
    }



    render() {
        const {children} = this.props,
            {redisContext, dlgSettings, dlgConnection, dlgNewKey, editServer, serverList, sidebarWidth} = this.state,
            {selectDatabase, selectServer} = window,
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
                            <button onClick={e => window.open('https://github.com/epldlnwynn/redis-web-module/issues')}>
                                <Icon type="icon-debug"></Icon>
                            </button>
                            <button onClick={e => window.open('https://github.com/epldlnwynn/redis-web-module')}>
                                <Icon type="icon-github"></Icon>
                            </button>
                        </div>

                        <div className={styles.buttonGroups}>
                            <button onClick={this.handleFullScreen.bind(this)}>
                                <Icon type="icon-full-screen"></Icon>
                            </button>
                            <button onClick={this.handleSettings.bind(this)}>
                                <Icon type="icon-settings" style={{padding: '1px'}}></Icon>
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
                    onClose={e => this.setState({editServer:{...DEFAULT_SERVER},dlgConnection:false})}
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
                                                   onInput={e => this.handleConnectionChange("security.tunnel.host", e.currentTarget.value)}
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
                                                   onInput={e => this.handleConnectionChange("security.tunnel.username", e.currentTarget.value)}
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


            <Dialog visible={dlgNewKey}
                    title={`Add New Key to ${selectServer?.host}:db${selectDatabase}`}
                    className={styles.dialogAddKey}
                    onClose={e => this.setState({dlgNewKey: false})}
                    cancelable noScroll>
                <form className={styles.keyWrap}>
                    <div className={styles.listItem}>
                        <div className={styles.keyName}>
                            <label>Key Name<i>*</i></label>
                            <input type="text"
                                   autoFocus={true}
                                   defaultValue={this.addKeySettings?.name}
                                   onInput={e => this.handleAddKeyChange('name', e.currentTarget.value)}
                                   autoComplete="off"
                                   placeholder="Enter key name" name="key-name" />
                        </div>
                        <div className={styles.keyType}>
                            <label>Key Type</label>
                            <select name="key-type" onChange={e => this.handleAddKeySelectType(e.currentTarget)}>
                                <option value="string">String</option>
                                <option value="hash">Hash</option>
                                <option value="list">List</option>
                                <option value="set">Set</option>
                                <option value="zset">Sorted Set</option>
                            </select>
                        </div>
                    </div>
                    <div role="string" className={styles.keyValue}>

                        <div className={styles.hash}>
                            <input autoComplete="off" type="text" placeholder="Enter field name" name="field"
                                   onInput={e => this.handleAddKeyChange('field', e.currentTarget.value)} />

                            <textarea placeholder="Enter field value" name="value"
                                      onInput={e => this.handleAddKeyChange('value', e.currentTarget.value)}></textarea>
                        </div>

                        <div className={styles.zset}>
                            <input autoComplete="off" type="text" placeholder="Enter member" name="member"
                                   onInput={e => this.handleAddKeyChange('member', e.currentTarget.value)} />

                            <input autoComplete="off" type="text" placeholder="Enter score" name="score"
                                      onInput={e => this.handleAddKeyChange('score', e.currentTarget.value)} />
                        </div>

                        <div className={styles.other}>
                            <textarea placeholder="Enter key value" name="value"
                                      onInput={e => this.handleAddKeyChange('value', e.currentTarget.value)}></textarea>
                        </div>


                    </div>

                    <div className={styles.buttons}>
                        <button type="submit" onClick={e => this.handleAddKeySave(e)}>
                            <Icon type="icon-loading"></Icon>
                            Add Key
                        </button>
                    </div>
                </form>
            </Dialog>

        </>)
    }

};

