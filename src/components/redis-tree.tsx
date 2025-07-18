import React, {FC} from "react";
import Icon from "@/components/icon";
import classNames from "classnames";
import {MenuDb, MenuGroup, MenuInfo, MenuServer} from "@/components/redis-menu";



interface Props {

    serverList?: Array<RedisInfo>;

    expandAll?: boolean;

    clickKey?: (serverId:string, db: DbInfo, key: KeyInfo) => void;
    clickDb?: (serverId:string, db: DbInfo) => void;
    clickServer?: (server: any) => void;

}


const redisToUrl = (server: Server) => {
    const url = new URL("redis://")
    if (server.host) url.host = server.host;
    if (server.username) url.username = server.username;
    if (server.password) url.password = server.password;

    url.port = (server.port || 6379).toString()

    return url.toString()
}


let prevNode: any = null
const handleClickNode = (evt: any) => {
    const e = evt.currentTarget as HTMLDivElement,
        node = e.parentNode as HTMLDivElement,
        next = node.nextElementSibling as HTMLDivElement,
        svg = e.firstElementChild,
        active = node.classList.contains("active")

    prevNode?.menu?.remove()
    prevNode?.classList.remove("active")
    node.classList.add("active")

    prevNode = node
    if (node.role === "server")
        prevNode.menu = MenuServer(node)
    if (node.role === "db")
        prevNode.menu = MenuDb(node)
    if (node.role === "group")
        prevNode.menu = MenuGroup(node)
    if (node.role === "info")
        prevNode.menu = MenuInfo(node)

    if (!next) return

    const hidden = next.getAttribute("aria-hidden") || "false"
    if (hidden == "false" && !active) {

    } else if (hidden === "true") {
        next.setAttribute("aria-hidden", "false")
        svg?.classList.add("down")
    } else {
        next.setAttribute("aria-hidden", "true")
        svg?.classList.remove("down")
    }

}
const handleClickKey = async (evt: any, serverId:string, db: DbInfo, key:KeyInfo, props: Props) => {
    handleClickNode(evt)

    props.clickKey && props.clickKey(serverId, db, key)
}
const handleClickDb = async (evt: any, serverId: string, db: DbInfo, props: Props) => {
    handleClickNode(evt)

    props.clickDb && await props.clickDb(serverId, db)

}
const handleClickServer = async (evt: any, server: RedisInfo, props: Props) => {
    handleClickNode(evt)

    props.clickServer && await props.clickServer(server)

}

const keyList = (p: Props, serverId: string, db: DbInfo, keys: Array<KeyInfo>, isDb: boolean = false) => {
    if (!keys || keys.length == 0)
        return null

    return <div className="tree" aria-hidden={isDb ? (db.expand ? false : !p.expandAll) : !p.expandAll}>
        {keys.map((key: any) => {
            return <div key={key.full || key.name}>
                {("type" in key) ?
                    <div role="info" className="info" id={key.full}>
                        <div onClick={e => handleClickKey(e, serverId, db, key, p)}>
                            <p role={key.type}>{key.type == "none" && <Icon type="icon-keys"></Icon>}</p>
                            <span>{key.name}</span>
                        </div>
                    </div>
                    :
                    <div role="group" data-group={key.full || key.name} className="node">
                        <div onClick={e => handleClickNode(e)}>
                            <Icon type="icon-arrow-right-fill" className={classNames({"down": p.expandAll},"arrow")}></Icon>
                            <Icon type={`icon-folder-${key.expand ? "" : (p.expandAll ? "open-" : "")}fill`}></Icon>
                            <span>{key.name + (key.count > 0 ? ` (${key.count})` : '')}</span>
                        </div>
                    </div>
                }

                {keyList(p, serverId, db, key.children || [])}
            </div>
        })}
    </div>
};

const dbList: FC<Props> = (p, server) => {
    if (!server.db || server.db.length == 0)
        return null

    return <div className="tree" aria-hidden={server.expand ? false : !p.expandAll}>
        {server.db.map((db: DbInfo) => {
            return <div key={'db' + db.index}>
                <div className="node" role="db">
                    <div onClick={e => handleClickDb(e, server.id, db, p)}>
                        {db.state == 'query' ?
                            <Icon type="icon-loading-fill"></Icon>
                            :
                            <Icon type="icon-arrow-right-fill" className={classNames({
                                "down": db.expand || p.expandAll,
                                "visibility": db.count == 0
                            },"arrow")}></Icon>
                        }

                        <Icon type="icon-data-table"></Icon>
                        <span>db{db.index + (db.count > 0 ? ` (${db.count})` : '')}</span>
                    </div>
                </div>
                {keyList(p, server.id, db, db.children, true)}
            </div>
        })}
    </div>
};

const RedisTree : FC<Props> = (p) => {

    return <div className="server-list">
        {p.serverList?.map((server: any) => {
            const style: any = {}
            if (server?.appearance?.iconColor)
                style['--sidebar-icon-color'] = server?.appearance?.iconColor

            return <div className="server" key={server.id || server.name} id={server.id} style={style}>
                <div className="node" role="server" data-url={redisToUrl(server)}>
                    <div onClick={e => handleClickServer(e, server, p)}>
                        {server.state === "connection" ?
                            <Icon type="icon-loading-fill"></Icon>
                            :
                            <Icon type="icon-arrow-right-fill" className={classNames({
                                "down": server.expand || p.expandAll,
                                "visibility": server.state != 'open'
                            },"arrow")}></Icon>
                        }
                        <Icon type="icon-database"></Icon>
                        <span>{server.name}</span>
                    </div>
                </div>
                {dbList(p, server)}
            </div>
        })}

    </div>
}


export default RedisTree

