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
        }

    }

    componentDidMount() {

        eventBus.on("eventUpdate", this.handleEventUpdate.bind(this))
        eventBus.on("eventDelete",this.handleEventDelete.bind(this))

    }


    handleEventUpdate(id: string, db: any, name: string, key: KeyInfo) {
        const ki = this.findKey(name), server = window.selectServer;
        if (ki) {
            ki.full = key.full
            ki.name = key.full?.split(server.advancedSettings?.namespaceSeparator || ":").reverse()[0] || key.name
            ki.size = key.size
            ki.ttl = key.ttl
            this.updateServerList()
        }

        console.log(ki, key, id, db, name)
    }
    handleEventDelete(id: string, db: any, key: string) {
        console.log(key, id, db)
        this.deleteKey(key)
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
    updateServerList() {
        this.setState({serverList: [...this.state.serverList]})
    }


    findKey(keyName: string): KeyInfo | null {
        const {selectServerId, selectDatabase} = window
        const server = this.findServerById(selectServerId)
        const db = server.db[selectDatabase]

        return this.findKeysByName(keyName, db.children)
    }
    findKeysByName(keyName: string, keys: Array<KeyInfo>) {
        const find = (ar: Array<KeyInfo>): any => {
            for (const k of ar) {
                if (k.full == keyName)
                    return k;
                if (k?.children && k.children.length > 0) {
                    const v = find(k.children)
                    if (v) return v
                }
            }
            return null
        }
        return find(keys)
    }
    deleteKey(keyName: string) {
        const {selectServerId, selectDatabase} = window
        const server = this.findServerById(selectServerId)
        const db = server.db[selectDatabase]

        const find = (key: any) => {
            for (let i = 0; i < key.children.length; i++) {
                const k = key.children[i]
                if(k.full === keyName) {
                    key.children.splice(i, 1)
                    key.count = key.count - k.count
                    this.updateServerList()
                    break;
                }
                if (k?.children && k.children.length > 0) {
                    find(k)
                }
            }
        }

        find(db)
    }

}
