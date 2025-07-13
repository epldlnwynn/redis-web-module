import {FC} from "react";
import classNames from "classnames";
import Icon from "@/components/icon";

interface Parameter {
    name?: string;
    text?: string;
    icon?: string;
    className?: string;
    defaultValue?: any;
    placeholder?: string;
    onChange?: (value: string) => void;
    onClick?: (value: string, e: HTMLButtonElement) => void;
}

const InputButton : FC<Parameter> = (p) => {
    return <div className={classNames("input-button", p.className)}>
        <input type="text" name={p.name}
               autoCapitalize="off"
               onInput={e => {p.onChange && p.onChange(e.currentTarget.value)}}
               placeholder={p.placeholder}
               defaultValue={p.defaultValue} />
        <button type="button" onClick={e => p.onClick && p.onClick((e.currentTarget.previousElementSibling as HTMLInputElement).value, e.currentTarget)}>
            {p.icon && <Icon type={p.icon}></Icon>}
            {p.text || ""}
        </button>
    </div>
}


export default InputButton
