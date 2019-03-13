
import cookie from 'react-cookies';
//cookie
const ToCookie = {

    //获取cookit
    "Get" : (key) => {
        return cookie.load(key)
    },
   
    //保存数据至cookie
    "Set" : (key,obj) => {
        cookie.save(key, obj);
    },
    //清空cookie 或 删除指定对象 
    /**
     * obj 字符串
     */
    "remove" : (key) =>{
        cookie.remove(key);
    }
 


};

export default ToCookie;