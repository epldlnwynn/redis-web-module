import Icon from "@/components/icon";
import React from "react";
import styles from "./redis-menu.less"
import ReactDOM from "react-dom";
import eventBus from "listen-events";
import intl from "@/utils/intl";



const handleDeleteKey = (group: string | undefined, e: HTMLButtonElement) => {
    if (!confirm(intl.get("sidebar.menu.group.delete-confirm"))) return

    if (group)
        eventBus.emit("eventDeleteKey", group, e)
}
const handleDeleteServer = (e: HTMLButtonElement, id?: string) => {
    if (!confirm(intl.get("sidebar.menu.server.delete-confirm"))) return

    if (id)
        eventBus.emit("eventDeleteConnection", id, e)

}


export const MenuServer = (e: HTMLDivElement) => {
    const serverId = e.parentElement?.id, {url} = e.dataset
    const div = document.createElement("div")
    div.classList.add(styles.sidebarMenu)

    ReactDOM.render(<>
        <button className="tooltipped tooltipped-w" aria-label={intl.get("sidebar.menu.server.reload-tip")}
                onClick={e => eventBus.emit("eventReloadConnection", serverId, e.currentTarget)}>
            <Icon type="icon-refresh"></Icon>
        </button>
        <button className="tooltipped tooltipped-w" aria-label={intl.get("sidebar.menu.server.edit-tip")}
                onClick={e => eventBus.emit("eventEditConnection", serverId, e.currentTarget)}>
            <Icon type="icon-settings"></Icon>
        </button>
        <button className="tooltipped tooltipped-w clipboard-copy" aria-label={intl.get("sidebar.menu.server.copy-tip")} data-clipboard-text={url}>
            <Icon type="icon-copy-link"></Icon>
        </button>
        <button type="button" className="tooltipped tooltipped-w" aria-label={intl.get("sidebar.menu.server.delete-tip")}
                onClick={e => handleDeleteServer(e.currentTarget, serverId)}>
            <Icon type="icon-delete"></Icon>
        </button>
    </>, div)

    e.appendChild(div)
    return div
}

export const MenuDb = (e:HTMLDivElement) => {
    const div = document.createElement("div")
    div.classList.add(styles.sidebarMenu)

    ReactDOM.render(<>
        <button className="tooltipped tooltipped-w" aria-label={intl.get("sidebar.menu.db.filter-tip")}
                onClick={e => eventBus.emit("eventFilterDatabase", e.currentTarget)}>
            <Icon type="icon-filter"></Icon>
        </button>
        <button className="tooltipped tooltipped-w" aria-label={intl.get("sidebar.menu.db.reload-tip")}
                onClick={e => eventBus.emit("eventReloadDatabase", null, null, null, e.currentTarget)}>
            <Icon type="icon-refresh"></Icon>
        </button>
        <button className="tooltipped tooltipped-w" aria-label={intl.get("sidebar.menu.group.add-tip")}
                onClick={e => eventBus.emit("eventAddNewKey", null, e.currentTarget)}>
            <Icon type="icon-add"></Icon>
        </button>
    </>, div)

    e.appendChild(div)
    return div
}

export const MenuGroup = (e:HTMLDivElement) => {
    const div = document.createElement("div"), {group} = e.dataset
    div.classList.add(styles.sidebarMenu)

    ReactDOM.render(<>
        <button className="tooltipped tooltipped-w" aria-label={intl.get("sidebar.menu.group.reload-tip")}
                onClick={e => eventBus.emit("eventReloadNamespace", group, e.currentTarget)}>
            <Icon type="icon-refresh"></Icon>
        </button>
        <button className="tooltipped tooltipped-w" aria-label={intl.get("sidebar.menu.group.add-tip")}
                onClick={e => eventBus.emit("eventAddNewKey", group, e.currentTarget)}>
            <Icon type="icon-add"></Icon>
        </button>
        <button className="tooltipped tooltipped-w clipboard-copy" data-clipboard-text={group+'*'} aria-label={intl.get("sidebar.menu.group.copy-tip")}>
            <Icon type="icon-copy"></Icon>
        </button>
        <button className="tooltipped tooltipped-w" aria-label={intl.get("sidebar.menu.group.delete-tip")}
                onClick={e => handleDeleteKey(group, e.currentTarget)}>
            <Icon type="icon-delete"></Icon>
        </button>
    </>, div)

    e.appendChild(div)
    return div
}

export const MenuInfo = (e:HTMLDivElement) => {
    const div = document.createElement("div")
    div.classList.add(styles.sidebarMenu)

    ReactDOM.render(<>
        <button className="tooltipped tooltipped-w clipboard-copy" data-clipboard-text={e.id} aria-label={intl.get("sidebar.menu.info.copy-tip")}>
            <Icon type="icon-copy"></Icon>
        </button>
    </>, div)

    e.appendChild(div)
    return div
}


