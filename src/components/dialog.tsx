import classNames from 'classnames';
import React, {FC, MouseEventHandler, ReactNode, useState} from "react";
import ReactDOM from 'react-dom';
import IconSvg from '@/components/icon'

interface DialogParam {
    id?: string;
    title?: string;
    visible: boolean;
    cancelable?: boolean;
    noScroll?: boolean
    className?: string;
    onClose?: MouseEventHandler | undefined;
    children?: ReactNode;
    backgroundColor?: string;
    nonClose?: boolean;
}

const Dialog: FC<DialogParam> = (p: DialogParam) => {
    const handleCancelable = (e: any) => {
        const { id, classList } = e.target;
        if (e && id && classList.contains("dialog-layout")) {
            handleClose(e)
        }
    }

    const handleClose = (e: any) => {
        p.noScroll && document.querySelectorAll('html,body').forEach(el => el.removeAttribute('aria-scroll'))

        if (p.onClose) {
            p.onClose(e)
            return
        }

        const el = e.currentTarget;
        if (el.tagName === "DIV") {
            el.hidden = true
            return;
        }

        var n = el.parentNode, i = 5;
        while (i > 0) {
            if (n.classList.contains("dialog-layout")) {
                n.hidden = true
                break
            }
            n = n.parentNode, ++i
        }
    };

    const attr: any = {
        className: "dialog-layout not-select",
        onClick: (e: any) => p.cancelable && handleCancelable(e),
        hidden: !p.visible,
        style:{}
    };

    if (p.id) attr.id = p.id;
    if (p.backgroundColor) attr.style.backgroundColor = p.backgroundColor;

    if (p.noScroll && p.visible) {
        document.body.setAttribute("aria-scroll", "true")
    } else {
        document.body.removeAttribute("aria-scroll")
    }

    const el = React.createElement("div", attr, <div className={classNames("dialog-wrap", p.className)}>
        {p.title ? <div className="flex-row head">
            <h3>{p.title}</h3>
            {!p.nonClose && <a className="close" onClick={e => handleClose(e)} hidden={closed}><IconSvg type="icon-close" /></a>}
        </div> : (p.nonClose ? null : <a className="close tr" onClick={e => handleClose(e)} hidden={closed}><IconSvg type="icon-close" /></a>)}
        {p.children}
    </div>)

    return ReactDOM.createPortal(el, document.body)
}


export default Dialog
