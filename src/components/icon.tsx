import React from "react";
import classNames from 'classnames';

export default ({ type, className, style}: { type: string; className?: string, style?: any}) => {
    return (<svg className={classNames("icon", className)} role={type} style={style}>
        <use xlinkHref={`#${type}`}></use>
    </svg>);
}
