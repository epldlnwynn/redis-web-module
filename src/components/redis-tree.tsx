import React, {FC} from "react";
import Icon from "@/components/icon";
import classNames from "classnames";



interface Props {

    serverList?: Array<RedisInfo>;

    expandAll?: boolean;

    clickKey?: (db: DbInfo, key: KeyInfo) => void;
    clickDb?: (db: DbInfo) => void;
    clickServer?: (server: RedisInfo) => void;

}



const handleClickNode = (evt: any, data: any, props: Props) => {
    const e = evt.currentTarget as HTMLDivElement,
        next = e.nextElementSibling as HTMLDivElement,
        svg = e.firstElementChild

    if (!next) return

    const hidden = next.getAttribute("aria-hidden") || "false"
    if (hidden === "true") {
        next.setAttribute("aria-hidden", "false")
        svg?.classList.add("down")
    } else {
        next.setAttribute("aria-hidden", "true")
        svg?.classList.remove("down")
    }

}
const handleClickDb = async (evt: any, db: DbInfo, props: Props) => {
    handleClickNode(evt, db, props)

    props.clickDb && await props.clickDb(db)

}
const handleClickServer = async (evt: any, server: RedisInfo, props: Props) => {
    handleClickNode(evt, server, props)

    props.clickServer && await props.clickServer(server)

}

const keyList = (p: Props, db: DbInfo, keys: Array<KeyInfo>, isDb: boolean = false) => {
    if (!keys || keys.length == 0)
        return null


    return <div className="tree" aria-hidden={isDb ? (db.expand ? false : !p.expandAll) : !p.expandAll}>
        {keys.map((key: KeyInfo) => {
            return <div key={key.full || key.name}>
                {("type" in key) && <div className="info" id={key.full} onClick={e => p.clickKey && p.clickKey(db, key)}>
                    <p role={key.type}>
                        <label>{key.type}</label>
                    </p>
                    <span>{key.name}</span>
                </div>}

                {!("type" in key) && <div className="node" onClick={e => handleClickNode(e, key, p)}>
                        <Icon type="icon-arrow-right-fill" className={classNames({"down": p.expandAll},"arrow")}></Icon>
                        <Icon type={`icon-folder-${key.expand ? "" : (p.expandAll ? "open-" : "")}fill`}></Icon>
                        <span>{key.name + (key.count > 0 ? ` (${key.count})` : '')}</span>
                    </div>
                }

                {keyList(p, db, key.children || [])}
            </div>
        })}
    </div>
}
const dbList: FC<Props> = (p, server) => {
    if (!server.db || server.db.length == 0)
        return null

    return <div className="tree" aria-hidden={server.expand ? false : !p.expandAll}>
        {server.db.map((db: DbInfo) => {
            return <div key={'db' + db.index} id={'db' + db.index}>
                <div className="node" onClick={e => handleClickDb(e, db, p)}>
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
                {keyList(p, db, db.children, true)}
            </div>
        })}
    </div>
}

const RedisTree : FC<Props> = (p) => {

    return <div className="server-list">
        {p.serverList?.map((server: any) => {
            const style: any = {}
            if (server?.appearance?.iconColor)
                style['--sidebar-icon-color'] = server?.appearance?.iconColor

            return <div className="server" key={server.id || server.name} id={server.id} style={style}>
                <div className="node" onClick={e => handleClickServer(e, server, p)}>
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
                {dbList(p, server)}
            </div>
        })}

    </div>
}


export default RedisTree

