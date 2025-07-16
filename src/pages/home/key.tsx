import styles from "./key.less"
import React, {useEffect, useState} from "react";
import APIs from "@/utils/APIs";
import {useHistory, useParams} from "umi";
import RedisEditor from "@/components/redis-editor";
import intl from "@/utils/intl";
import eventBus from "listen-events";


const win = window as any
let timeoutId = 0
export default () => {
    const history = useHistory()
    const {id,db,type,name:full} = useParams<{id:string;db:any;type:string;name:string}>()
    const [key, setKey] = useState<KeyInfo>({name:full,full,type,count:0,children:[],ttl:-1})
    let ttl = 0;


    const intervalTimer = (time: number) => {
        ttl = time
        window.clearInterval(timeoutId);
        timeoutId = window.setInterval(() => {
            if (ttl < 1) {
                window.clearInterval(timeoutId);
                return
            }
            const i = document.querySelector(`#info_ttl i`)
            if (i) i.innerHTML = (--ttl).toString();
        }, 1000)
    }
    const loadKeyData = () => {
        const source = APIs.values(id,db,type,full)
        if (!source) return undefined;

        source.on("info", data => {
            key.ttl = data.ttl
            key.type = type
            key.name = data.name
            key.full = data.full
            key.size = data.size
            key.children = []
            key.itemIndex = undefined
            key.content = '', key.field = ''
            setKey({...key})

            if (data.ttl > 0)
                intervalTimer(data.ttl)

        });

        source.on("message", data => {
            if ("string" === type) {
                key.content = data
            } else {
                key.children?.push(...data)
            }
            setKey({...key})
        })

        return source
    }
    const handleReloadValue = (e: HTMLButtonElement) => {
        e.disabled = true
        loadKeyData()
        e.disabled = false
    }
    const handleSetTTL = (ttl: number, e: HTMLButtonElement) => {
        e.disabled = true
        APIs.expire(id,db,full,ttl).then(model => {
            if (model.isSuccess()) {
                key.ttl = ttl
                setKey({...key})
                intervalTimer(parseInt(ttl.toString()))
            }
        }).finally(() => {
            e.disabled = false
        })
    }
    const handleDelete = (name: string, e: HTMLButtonElement) => {
        e.disabled = true
        APIs.delete(id, db, name).then(model => {
            if (model.isSuccess()) {
                eventBus.emit("eventDelete", id, db, key)
                toast(intl.get("editor.delete.success"))
                history.push('/')
            }
        }).finally(() => {
            e.disabled  = false
        })
    }
    const handleDeleteItem = (e: HTMLButtonElement) => {
        let fun: any = null, index = key.itemIndex || -1
        if (index == undefined || index == -1)
            return

        e.disabled = true
        if (type === "list")
            fun = APIs.list.del(id, db, full, key.itemIndex)

        if (type === "hash" && key.field)
            fun = APIs.hash.del(id, db, full, key.field)

        if (type === "zset" && key.field)
            fun = APIs.zset.del(id,db, full, key.content)

        if (type === "set")
            fun = APIs.sset.del(id, db, full, key.content)

        fun?.finally(() => {
            key.children?.splice(index, 1)
            key.field = undefined
            key.content = undefined
            key.itemIndex = undefined
            setKey({...key})
            e.disabled = false
        })
    }
    const handleSaveItem = (field: string, value: string, e: HTMLButtonElement) => {
        e.disabled = true
        let fun: any = null

        if (type === "hash") {
            fun = APIs.hash.set(id, db, full, field, value, field === key.field ? undefined : key.field).then(model => {
                // @ts-ignore
                key.children[key.itemIndex].field = field, key.children[key.itemIndex].value = value
            });
        }

        if (type === "zset")
            fun = APIs.zset.set(id, db, full, field, value, field === key.field ? undefined : key.field).then(model => {
                // @ts-ignore
                key.children[key.itemIndex].value = field, key.children[key.itemIndex].score = value
            })


        fun?.finally(() => {
            setKey({...key})
            e.disabled = false
        })
    }


    const handleSaveValue = (value: string, e: HTMLButtonElement) => {
        e.disabled = true
        let fun = null;

        if (type === "string")
            fun = APIs.string.set(id, db, full, value).then(model => {
                key.content = isJSON(value) ? JSON.parse(value) : value
            });

        if (type === "list")
            fun = APIs.list.set(id, db, full, value, key.itemIndex).then(model => {
                if (key.itemIndex != undefined && key.children) {
                    key.children[key.itemIndex] = value
                    key.content = isJSON(value) ? JSON.parse(value) : value
                }
            })

        if (type === "set")
            fun = APIs.sset.set(id, db, full, value, key.content).then(model => {
                // @ts-ignore
                key.children[key.itemIndex] = value, key.content = isJSON(value) ? JSON.parse(value) : value
            })


        fun?.finally(() => {
            key.size = value.length
            setKey({...key})
            e.disabled = false
        })
    }
    const handleRenameSave = (oldKey: string, newKey: string, e: HTMLButtonElement) => {
        e.disabled = true
        APIs.rename(id, db, oldKey, newKey).then(model => {
            if (model.isSuccess()) {
                key.full = newKey
                eventBus.emit("eventUpdate", id,db, oldKey, key)
                history.push(`/info/${id}/${db}/${type}/${newKey}`)
            }
        }).finally(() => {
            e.disabled = false
        })
    }
    const handleSelectedItem = (item: any, index: number) => {
        if (type == "hash") {
            key.field = item.field
            key.size = item.value.toString().length
            key.content = isJSON(item.value) ? JSON.parse(item.value) : item.value
        }

        if (type == "list" || type == "set") {
            key.size = item.length
            key.content = isJSON(item) ? JSON.parse(item) : item
        }

        if (type == "zset") {
            key.field = item.value
            key.content = item.score
            key.size = item.score.toString().length
        }

        key.itemIndex = index

        setKey({...key})
    }



    useEffect(() => {
        window.clearInterval(timeoutId)
        const source = loadKeyData()

        return () => source?.close()
    }, [id, db, type, full])


    return <div className={styles.keyWrap}>

        <RedisEditor data={key}
                     handleDeleteItem={handleDeleteItem}
                     handleSelectedItem={handleSelectedItem}
                     handleSaveTtl={handleSetTTL}
                     handleDelete={handleDelete}
                     handleSaveValue={handleSaveValue}
                     handleSaveItem={handleSaveItem}
                     handleRenameSave={handleRenameSave}
                     handleReloadValue={handleReloadValue}></RedisEditor>

    </div>
}
