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



    db(id: string | undefined) {
        if (!id) return null;
        return Service.eventSource(id)
    },
    keyspace(id: string | undefined, db: number | undefined) {
        return Service.eventSource([id, db].join("/"))
    },

    values(id: string, db: number, type: string, key: string) {
        return Service.eventSource([id, db, "get", type, key].join("/"))
    },


    sendCmd(id:string, db:number, opOrMethod:string, type:string | null, data: any) {
        const uri = [id, db, opOrMethod]
        type && uri.push(type)

        return Service.post(uri.join("/"), data).then(model => {
            if (model.code == 505)
                return model;

            if (!model.isSuccess())
                toast(model.message)

            return model
        })
    },
    expire(id:string, db:number, key:string, seconds:number) {
        return this.sendCmd(id, db, "expire", null, {key,value:seconds})
    },
    delete(id:string, db:number, key:string) {
        return this.sendCmd(id,db,"delete", null, {key})
    },
    rename(id: string, db: number, oldKey: string, key:string) {
        const data = {force:0, oldKey, key}
        return this.sendCmd(id,db,"rename", null, data).then(model => {
            if (model.code == 505 && confirm("The key name already exists, do you want to overwrite it?")) {
                data.force = 1
                return this.sendCmd(id, db, "rename", null, data)
            }
            return model
        })
    },

    string: {
        set(id:string, db:number, key:string, value: any){
            return APIs.sendCmd(id,db,"set", "string", {key,value})
        },
    },

    hash: {
        set(id:string, db:number, key:string, field:string, value: any, oldField?:string){
            if (oldField)
                return this.rename(id, db, key, oldField, field, value)
            return APIs.sendCmd(id,db,"set", "hash", {key,field,value,oldField})
        },
        del(id:string, db:number, key:string, field:string){
            return APIs.sendCmd(id,db,"del", "hash", {key,field})
        },
        rename(id:string, db:number, key:string, oldField:string, newField:string, value?:any){
            const data = {key,oldField,newField,value,force:0}
            return APIs.sendCmd(id,db,"rename", "hash", data).then(model => {
                if (model.code == 505 && confirm("The key name already exists, do you want to overwrite it?")) {
                    data.force = 1
                    return APIs.sendCmd(id, db, "rename", "hash",data)
                }
                return model
            })
        },
    },

    zset: {
        add(id:string, db:number, key:string, value:any, score:any){
            return APIs.sendCmd(id,db,"add", "zset",{key,value,score})
        },
        set(id:string, db:number, key:string, value:any, score:any, oldValue?:any){
            if (oldValue)
                return this.rename(id, db, key, oldValue, value, score)
            return APIs.sendCmd(id,db,"set", "zset",{key,value,score})
        },
        del(id:string, db:number, key:string, value:any){
            return APIs.sendCmd(id,db,"del", "zset",{key,value})
        },
        rename(id:string, db:number, key:string, oldValue:any, newValue:any, score:any){
            return APIs.sendCmd(id,db,"rename", "zset",{key,oldValue,newValue,score})
        }
    },

    list: {
        lPush(id:string, db:number, key:string, value:any){
            return APIs.sendCmd(id,db,"lpush", "list",{key,value})
        },
        rPush(id:string, db:number, key:string, value:any){
            return APIs.sendCmd(id,db,"rpush", "list",{key,value})
        },
        set(id:string, db:number, key:string, value:any, index:any){
            return APIs.sendCmd(id,db,"set", "list",{key,value,index})
        },
        del(id:string, db:number, key:string, index:any){
            return APIs.sendCmd(id,db,"del", "list",{key,index})
        }
    },

    sset: {
        add(id:string, db:number, key:string, value:any){
            return APIs.sendCmd(id,db,"add", "set",{key,value})
        },
        set(id:string, db:number, key:string, value:any, oldValue: any){
            return APIs.sendCmd(id,db,"set", "set",{key,value,oldValue})
        },
        del(id:string, db:number, key:string, value:any){
            return APIs.sendCmd(id,db,"del", "set",{key,value})
        },
    },



    save(id: string, db: number, data: ISave) {
        return Service.post(["/api/redis/save/",id, "/", db].join(""), data).then(model => {
            if (model.code == 505)
                return model;

            if (!model.isSuccess())
                toast(model.message)

            return model
        })
    }



}

interface ISave {
    op: 'delete' | 'update' | 'add' | 'rename' | 'lpush';
    type: 'key' | 'ttl' | 'item' | 'value' | 'list' | 'zset' | 'set';

    [key: string]: any;
}


export default APIs
