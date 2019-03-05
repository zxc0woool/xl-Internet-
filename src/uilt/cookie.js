


//cookie

export default () => {

    //获取cookit
    this.Get = () => {
       return JSON.parse(document.cookie)
    }

    //保存数据至cookie
    this.Set = (obj) => {
        
        let Data = JSON.stringify(document.cookie)

        for(let key in obj){
            
            Data[key] = obj[key]
            
        }
        document.cookie = Data;
    }
    //清空cookie 或 删除指定对象
    this.remove = (obj) =>{
        if(obj === undefined){
            document.cookie = "";
        }else{
            let Data = JSON.stringify(document.cookie)
            for(let key in obj){
                delete Data[key]
            }

        }
        document.cookie = Data;
    }
 


} ;
  