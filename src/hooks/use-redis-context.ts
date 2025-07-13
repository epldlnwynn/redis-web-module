import {useContext} from "react";
import RedisContext,{IRedisContext} from "@/context/redis-context";

export default (): IRedisContext => {
    const context = useContext(RedisContext);

    return context
}
