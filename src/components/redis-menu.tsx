import Icon from "@/components/icon";
import React from "react";
import styles from "./redis-menu.less"
import ReactDOM from "react-dom";
import eventBus from "listen-events";



const handleDeleteKey = (group: string | undefined, e: HTMLButtonElement) => {
    if (!confirm(`Do you really want to delete the ${group}* key?`)) return

    if (group)
        eventBus.emit("eventDeleteKey", group, e)
}
const handleDeleteServer = (e: HTMLButtonElement, id?: string) => {
    if (!confirm("Do you really want to delete connection?")) return

    if (id)
        eventBus.emit("eventDeleteConnection", id, e)

}


export const MenuServer = (e: HTMLDivElement) => {
    const serverId = e.parentElement?.id, {url} = e.dataset
    const div = document.createElement("div")
    div.classList.add(styles.sidebarMenu)

    ReactDOM.render(<>
        <button className="tooltipped tooltipped-w" aria-label="Reload Server"
                onClick={e => eventBus.emit("eventReloadConnection", serverId, e.currentTarget)}>
            <Icon type="icon-reload"></Icon>
        </button>
        <button className="tooltipped tooltipped-w" aria-label="Edit Connection Settings"
                onClick={e => eventBus.emit("eventEditConnection", serverId, e.currentTarget)}>
            <Icon type="icon-settings"></Icon>
        </button>
        <button className="tooltipped tooltipped-w clipboard-copy" aria-label="Copy Redis Uri" data-clipboard-text={url}>
            <Icon type="icon-copy-link"></Icon>
        </button>
        <button type="button" className="tooltipped tooltipped-w" aria-label="Delete Connection"
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
        <button className="tooltipped tooltipped-w" aria-label="Open Keys Filter">
            <Icon type="icon-filter"></Icon>
        </button>
        <button className="tooltipped tooltipped-w" aria-label="Reload Keys in Database"
                onClick={e => eventBus.emit("eventReloadDatabase", null, null, e.currentTarget)}>
            <Icon type="icon-reload"></Icon>
        </button>
        <button className="tooltipped tooltipped-w" aria-label="Add New Key"
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
        <button className="tooltipped tooltipped-w" aria-label="Reload Namespace"
                onClick={e => eventBus.emit("eventReloadNamespace", group, e.currentTarget)}>
            <Icon type="icon-reload"></Icon>
        </button>
        <button className="tooltipped tooltipped-w" aria-label="Add New Key"
                onClick={e => eventBus.emit("eventAddNewKey", group, e.currentTarget)}>
            <Icon type="icon-add"></Icon>
        </button>
        <button className="tooltipped tooltipped-w clipboard-copy" data-clipboard-text={group+'*'} aria-label="Copy Namespace Pattern">
            <Icon type="icon-copy"></Icon>
        </button>
        <button className="tooltipped tooltipped-w" aria-label="Delete Namespace" onClick={e => handleDeleteKey(group, e.currentTarget)}>
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
        <button className="tooltipped tooltipped-w clipboard-copy" data-clipboard-text={e.id} aria-label="Copy Key Name">
            <Icon type="icon-copy"></Icon>
        </button>
    </>, div)

    e.appendChild(div)
    return div
}


