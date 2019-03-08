


//cookie

export default {

    //获取cookit
    Get : () => {
        
        if(document.cookie === ""){
            document.cookie = JSON.stringify({});
        }

       return JSON.parse(document.cookie)
    },

    //保存数据至cookie
    Set : (obj) => {
        
        if(document.cookie === ""){
            document.cookie = JSON.stringify({});
        }
        let Data = JSON.parse(document.cookie)

        for(let key in obj){
            
            Data[key] = obj[key]
            
        }
        document.cookie = JSON.stringify(Data);
    },
    //清空cookie 或 删除指定对象 
    /**
     * obj 字符串
     */
    remove : (obj) =>{
        if(obj === undefined){
            document.cookie = "";
        }else{
            let Data = JSON.parse(document.cookie);
            //删除当前对象
            delete Data[obj];
            document.cookie = JSON.stringify(Data);
        }
       
    }
 


} ;
  