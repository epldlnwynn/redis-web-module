import Service from "@/utils/service-base";


const APIs = {

    serverList() {
        return Service.get("list")
    },
    serverSave(server: Server) {
        return Service.post("save", server)
    },
    serverTest(server: Server) {
        return Service.post("test", server)
    },
    serverDel(serverId: string) {
        return Service.get("delete/" + serverId)
    },



    db(id: string | undefined) {
        if (!id) return null;
        return Service.eventSource(id)
    },
    keyspace(filter?: string) {
        const {selectServerId,selectDatabase} = window
        const url = [selectServerId, '/', selectDatabase];
        if (filter) url.push("?filter=", filter)
        return Service.eventSource(url.join(""))
    },

    values(type: string, key: string) {
        const {selectServerId,selectDatabase} = window
        return Service.eventSource([selectServerId, selectDatabase, "get", type, key].join("/"))
    },


    sendCmd(opOrMethod:string, type:string | null, data: any) {
        const {selectServerId,selectDatabase} = window
        const uri = [selectServerId, selectDatabase, opOrMethod]
        type && uri.push(type)

        return Service.post(uri.join("/"), data).then(model => {
            if (model.code == 505)
                return model;

            if (!model.isSuccess())
                toast(model.message)

            return model
        })
    },
    type(key: string) {
        return this.sendCmd("type", null, {key})
    },
    expire(key:string, seconds:number) {
        return this.sendCmd("expire", null, {key,value:seconds})
    },
    delete(key:string, isGroup?:boolean) {
        return this.sendCmd("delete", null, {key,isGroup})
    },
    rename(oldKey: string, key:string) {
        const data = {force:0, oldKey, key}
        return this.sendCmd("rename", null, data).then(model => {
            if (model.code == 505 && confirm("The key name already exists, do you want to overwrite it?")) {
                data.force = 1
                return this.sendCmd("rename", null, data)
            }
            return model
        })
    },

    string: {
        set(key:string, value: any){
            return APIs.sendCmd("set", "string", {key,value})
        },
    },

    hash: {
        set(key:string, field:string, value: any, oldField?:string){
            if (oldField)
                return this.rename(key, oldField, field, value)
            return APIs.sendCmd("set", "hash", {key,field,value,oldField})
        },
        del(key:string, field:string){
            return APIs.sendCmd("del", "hash", {key,field})
        },
        rename( key:string, oldField:string, newField:string, value?:any){
            const data = {key,oldField,newField,value,force:0}
            return APIs.sendCmd("rename", "hash", data).then(model => {
                if (model.code == 505 && confirm("The key name already exists, do you want to overwrite it?")) {
                    data.force = 1
                    return APIs.sendCmd("rename", "hash",data)
                }
                return model
            })
        },
    },

    zset: {
        add(key:string, value:any, score:any){
            return APIs.sendCmd("add", "zset",{key,value,score})
        },
        set(key:string, value:any, score:any, oldValue?:any){
            if (oldValue)
                return this.rename(key, oldValue, value, score)
            return APIs.sendCmd("set", "zset",{key,value,score})
        },
        del(key:string, value:any){
            return APIs.sendCmd("del", "zset",{key,value})
        },
        rename(key:string, oldValue:any, newValue:any, score:any){
            return APIs.sendCmd("rename", "zset",{key,oldValue,newValue,score})
        }
    },

    list: {
        lPush(key:string, value:any){
            return APIs.sendCmd("lpush", "list",{key,value})
        },
        rPush(key:string, value:any){
            return APIs.sendCmd("rpush", "list",{key,value})
        },
        set(key:string, value:any, index:any){
            return APIs.sendCmd("set", "list",{key,value,index})
        },
        del(key:string, index:any){
            return APIs.sendCmd("del", "list",{key,index})
        }
    },

    sset: {
        add(key:string, value:any){
            return APIs.sendCmd("add", "set",{key,value})
        },
        set(key:string, value:any, oldValue: any){
            return APIs.sendCmd("set", "set",{key,value,oldValue})
        },
        del(key:string, value:any){
            return APIs.sendCmd("del", "set",{key,value})
        },
    },



}

export default APIs
