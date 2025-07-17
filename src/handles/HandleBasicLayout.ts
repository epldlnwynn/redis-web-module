import React from "react";
import {IRedisContext, redisContext} from "@/context/redis-context";
import conf, {DEFAULT_SERVER} from "@/utils/conf";
import eventBus from "listen-events";




interface ParamType {
    redisContext: IRedisContext;


    dlgSettings: boolean;
    dlgConnection: boolean;
    dlgNewKey: boolean;


    editServer: Server;
    serverList: Array<Server>;
    sidebarWidth: string;


    selectServerId: string;
    selectDatabase: number;
    selectKey?: string;
}


export class HandleBasicLayout extends React.PureComponent<any, ParamType> {

    constructor(props: any) {
        super(props);

        this.state = {
            redisContext,
            sidebarWidth: conf.getSidebarWidth(),
            dlgSettings: false,
            dlgConnection: false,
            dlgNewKey: false,
            serverList: [],
            editServer: {...DEFAULT_SERVER},
            selectServerId: '',
            selectDatabase: -1,
        }

    }

    componentDidMount() {

        eventBus.on("eventUpdate", this.handleEventUpdate.bind(this))
        eventBus.on("eventDelete",this.handleEventDelete.bind(this))

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



    componentWillUnmount() {

    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<ParamType>, snapshot?: any) { }


    findServerById(id: string) {
        const [server] = this.state.serverList.filter(s => s.id === id)
        return server
    }
    setServerList(serverList: Server[]) {
        this.setState({serverList: [...serverList]})
    }

}
