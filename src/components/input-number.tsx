import {FC} from "react";
import classNames from "classnames";
import Icon from "@/components/icon";

interface Parameter {
    name?: string;
    className?: string;
    onChange?: (value: number) => void;
    defaultValue?: any;
    max?: number;
    min?: number;
    placeholder?: string;
    readOnly?: boolean;
    step?: number;
}

const InputNumber : FC<Parameter> = (p) => {

    const handlePlus = (e: HTMLSpanElement) => {
        const i = e.previousElementSibling as HTMLInputElement, val = Number(i.value || "0")
        if (p.max && p.max >= val) return;

        const num = val + (p.step || 1)
        i.value = num.toString()
        p.onChange && p.onChange(num)
    }
    const handleMinus = (e: HTMLSpanElement) => {
        const i = e.nextElementSibling as HTMLInputElement, val = Number(i.value || "0")
        if (p.min && val <= p.min) return;

        const num = val + (p.step || 1)
        i.value = num.toString()
        p.onChange && p.onChange(num)
    }
    const handleInput = (e: HTMLInputElement) => {
        p.onChange && p.onChange(Number(e.value || "0"))
    }


    return <div className={classNames("input-number", p.className)}>
        <span onClick={e => handleMinus(e.currentTarget)}>
            <Icon type="icon-minus" />
        </span>
        <input type="text" name={p.name} onInput={e => handleInput(e.currentTarget)} placeholder={p.placeholder} defaultValue={p.defaultValue} readOnly={p.readOnly}/>
        <span onClick={e => handlePlus(e.currentTarget)}>
            <Icon type="icon-plus" />
        </span>
    </div>
}


export default InputNumber
