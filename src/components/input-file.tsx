import {FC} from "react";
import classNames from "classnames";


interface Parameter {
    name?: string;
    text: string;
    className?: string;
    placeholder?: string;
    onChange?: (e: HTMLInputElement) => void;
    accept?: string;
    defaultValue?: string;
}

const InputFile: FC<Parameter> = (p) => {
    const handleChange = (e: any) => {
        const f = e.currentTarget as HTMLInputElement, i = f?.parentElement?.previousElementSibling as HTMLInputElement
        p.onChange && p.onChange(f)

        if (f && f.files)
            i.value = f.files[0].name
    }

    return <div className={classNames("input-file", p.className)}>
        <input disabled defaultValue={p.defaultValue} placeholder={p.placeholder} />
        <span>
            {p.text}
            <input type="file" name={p.name} title="" accept={p.accept} alt="" onChange={handleChange} />
        </span>
    </div>
}

export default InputFile
