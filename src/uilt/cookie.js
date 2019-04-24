
import cookie from 'react-cookies';
//cookie
const ToCookie = {

    //获取cookit
    "Get": (key) => {
        return cookie.load(key)
    },

    //保存数据至cookie
    "Set": (key, obj) => {
        cookie.save(key, obj);
    },
    //清空cookie 或 删除指定对象 
    /**
     * obj 字符串
     */
    "remove": (key) => {
        cookie.remove(key);
    },

    // 获取cookie
    "getCookie": (key) => {
        const name = key + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            const c = ca[i].trim();
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "{}";
    },

    // 设置cookie
    "setCookie": (key, value) => {
        const d = new Date();
        d.setTime(d.getTime() + (9999 * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toGMTString();
        document.cookie = key + "=" + value + "; " + expires;

    }
}

export default ToCookie;