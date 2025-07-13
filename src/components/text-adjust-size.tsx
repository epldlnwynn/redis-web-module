import classNames from 'classnames';
import React, {FC, ReactNode, useEffect, useRef} from "react";
import ReactDOM from 'react-dom';


interface TextAdjustSizeParam {
    fontSize: number;
    minSize?: number;
    maxSize?: number;

    children?: ReactNode;
}

const TextAdjustSize: FC<TextAdjustSizeParam> = (p: TextAdjustSizeParam) => {
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onAdjustTextSize = () => {
            const div = textRef.current;
            if (!div) return;

            const w = div.offsetWidth, max = p.maxSize, min = p.minSize || 0;

            let fs = p.fontSize;
            div.style.fontSize = `${fs}px`;

            while (div.scrollWidth > w && fs > min) {
                fs -= 1;
                div.style.fontSize = `${fs}px`;
            }
        };

        window.addEventListener('resize', onAdjustTextSize);
        onAdjustTextSize()

        return () => window.removeEventListener('resize', onAdjustTextSize);
    }, [])

    return <div ref={textRef}>{p.children}</div>
}


export default TextAdjustSize
