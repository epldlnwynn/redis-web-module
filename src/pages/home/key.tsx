import styles from "./key.less"
import React, {useEffect, useState} from "react";
import APIs from "@/utils/APIs";
import {useHistory, useParams} from "umi";
import RedisEditor from "@/components/redis-editor";
import intl from "@/utils/intl";
import eventBus from "listen-events";



let timeoutId = 0, eventSource: EventSource | null = null
export default () => {
    const history = useHistory()
    const {id,db,name:full} = useParams<{id:string;db:any;type:string;name:string}>()
    const [loadState, setLoadState] = useState('end')
    const [key, setKey] = useState<KeyInfo>({name:full,full,type:"",count:0,children:[],ttl:-1})
    let ttl = 0, type = window.selectKeyType || "none";


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
        console.log('type', type)
        eventSource = APIs.values(type, full)
        if (!eventSource) return undefined;

        eventSource.on("info", data => {
            key.ttl = data.ttl
            key.type = data.type || type
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
        eventSource.on("close", e => {
            setLoadState('end')
        })

        eventSource.on("message", data => {
            if ("string" === key.type) {
                key.content = data
            } else {
                key.children?.push(...data)
            }
            setKey({...key})
        })

    }
    const handleReloadValue = (e: HTMLButtonElement) => {
        e.disabled = true
        loadKeyData()
        e.disabled = false
    }
    const handleSetTTL = (ttl: number, e: HTMLButtonElement) => {
        e.disabled = true
        APIs.expire(full,ttl).then(model => {
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
        APIs.delete(name).then(model => {
            if (model.isSuccess()) {
                eventBus.emit("eventDelete", id, db, key.full)
                toast(intl.get("editor.delete.success"))
                history.push('/')
            }
        }).finally(() => {
            e.disabled  = false
        })
    }
    const handleDeleteItem = (e: HTMLButtonElement) => {
        console.log('handleDeleteItem', key.itemIndex)
        let fun: any = null
        if (key.itemIndex == undefined)
            return

        e.disabled = true
        if (key.type === "list")
            fun = APIs.list.del(full, key.itemIndex)

        if (key.type === "hash" && key.field)
            fun = APIs.hash.del(full, key.field)

        if (key.type === "zset" && key.field)
            fun = APIs.zset.del(full, key.content)

        if (key.type === "set")
            fun = APIs.sset.del(full, key.content)

        fun?.finally(() => {
            key.children?.splice(key.itemIndex || 0, 1)
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

        if (key.type === "hash") {
            if (!field){
                toast(intl.get("editor.save.hash.tip"))
                return;
            }

            fun = APIs.hash.set(full, field, value, field === key.field ? undefined : key.field).then(model => {
                if (key.itemIndex == undefined) {
                    key.children?.push({field,value})
                    key.field = "", key.content = ""
                } else {
                    // @ts-ignore
                    key.children[key.itemIndex].field = field, key.children[key.itemIndex].value = value
                }
            })
        }

        if (key.type === "zset") {
            if (!field || !value){
                toast(intl.get("editor.save.zset.tip"))
                return;
            }
            if (key.itemIndex == undefined) {
                fun = APIs.zset.add(full, field, value).then(model => {
                    key.children?.push({value:field, score:value})
                    key.field = "", key.content = ""
                })
            } else {
                fun = APIs.zset.set(full, field, value, field === key.field ? undefined : key.field).then(model => {
                    // @ts-ignore
                    key.children[key.itemIndex].value = field, key.children[key.itemIndex].score = value
                })
            }

        }

        fun?.finally(() => {

            if (key.type === "zset" && key.children) {
                const newList = key.children.sort((a,b) => b.score - a.score)
                key.children = [...newList]
            }

            setKey({...key})
            e.disabled = false
        })
    }


    const handleSaveValue = (value: string, e: HTMLButtonElement) => {
        e.disabled = true
        let fun = null;

        if (key.type === "string")
            fun = APIs.string.set(full, value).then(model => {
                key.content = isJSON(value) ? JSON.parse(value) : value
            });

        if (key.type === "list") {
            if (key.itemIndex == undefined) {
                fun = APIs.list.lPush(full, value).then(model => {
                    // @ts-ignore
                    key.children.unshift(isJSON(value) ? JSON.parse(value) : value)
                    key.content = ''
                })
            } else {
                fun = APIs.list.set(full, value, key.itemIndex).then(model => {
                    // @ts-ignore
                    key.children[key.itemIndex] = isJSON(value) ? JSON.parse(value) : value
                    key.content = isJSON(value) ? JSON.parse(value) : value
                })
            }

        }

        if (key.type === "set") {
            if (key.itemIndex == undefined) {
                fun = APIs.sset.add(full, value).then(model => {
                    // @ts-ignore
                    key.content = ""
                    key.children?.push(isJSON(value) ? JSON.parse(value) : value)
                })
            } else {
                fun = APIs.sset.set(full, value, key.content).then(model => {
                    // @ts-ignore
                    key.children[key.itemIndex] = value, key.content = isJSON(value) ? JSON.parse(value) : value
                })
            }
        }


        fun?.finally(() => {
            key.size = value.length
            setKey({...key})
            e.disabled = false
        })
    }
    const handleRenameSave = (oldKey: string, newKey: string, e: HTMLButtonElement) => {
        e.disabled = true
        APIs.rename(oldKey, newKey).then(model => {
            if (model.isSuccess()) {
                key.full = newKey
                eventBus.emit("eventUpdate", id,db, oldKey, key)
                history.push(`/info/${id}/${db}/${key.type}/${newKey}`)
            }
        }).finally(() => {
            e.disabled = false
        })
    }
    const handleSelectedItem = (item: any, index: any) => {
        console.log('handleSelectedItem', item, index)

        if (item) {
            if (key.type == "hash") {
                key.field = item.field
                key.size = item.value.toString().length
                key.content = isJSON(item.value) ? JSON.parse(item.value) : item.value
            }

            if (key.type == "list" || key.type == "set") {
                key.size = item.length
                key.content = isJSON(item) ? JSON.parse(item) : item
            }

            if (key.type == "zset") {
                key.field = item.value
                key.content = item.score
                key.size = item.score.toString().length
            }
        } else {
            key.field = undefined
            key.content = ""
        }

        key.itemIndex = index

        setKey({...key})
    }

    useEffect(() => {

        if (!window.selectServerId) window.selectServerId = id;
        if (!window.selectDatabase) window.selectDatabase = db;


        window.clearInterval(timeoutId)
        setLoadState('start')
        if (type == "none") {
            APIs.type(full).then(model => {
                window.selectKeyType = type = model.data
                loadKeyData()
            })
        } else {
            loadKeyData()
        }

        return () => eventSource?.close()
    }, [id, db, full])


    return <div className={styles.keyWrap}>

        <RedisEditor data={key}
                     state={loadState}
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
