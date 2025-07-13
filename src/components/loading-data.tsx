import React, { FC } from "react";
import classNames from 'classnames';

export default ({ show, className, style, id }: { show: boolean; className?: string, style?: any, id?:string }) => {
    return (show ?<div className={classNames("loader-data", className)} style={style} id={id}>
        <svg viewBox="0 0 120 120" className="process">
            <circle className="process-inner-circle" cx="60" cy="60" r="44" />
        </svg>
    </div> : null);
}
