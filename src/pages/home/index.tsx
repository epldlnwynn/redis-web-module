import styles from "./index.less"
import React, {useEffect, useState} from "react"
import useRedisContext from "@/hooks/use-redis-context";


export default () => {
    const context = useRedisContext()

    return (<div className={styles.indexWrap}>

        <div className={styles.readme}>
            <img src="/static/favicon/logo.png" width={200} />
            <h2>Redis devhub</h2>
            <h3>A simple Redis data management tool</h3>
        </div>

    </div>)

}
