function ajax(option){
    var xhr = new XMLHttpRequest();

    return new Promise(function(resolve, reject){
        var method = option.method || 'GET',
            url = option.url,
            data = option.data || null,
            sendMsg = '',
            dataType = option.dataType || 'text',
            contentType = option.contentType || 'json';

        xhr.onload = function(){
            if(xhr.status == 200){
                if(dataType == 'json'){
                    resolve(JSON.parse(xhr.responseText));
                }else if(dataType == 'image'){
                    var blob = xhr.response;
                    var img = document.createElement('img');
                    img.src = window.URL.createObjectURL(blob);
                    document.body.appendChild(img);
                }else{
                    resolve(xhr.responseText);
                }
            }else{
                reject();
            }
        };
        xhr.open(method, url, true);
        if(method == 'GET'){
            xhr.send();
        }else{
            if(contentType == 'json'){
                xhr.setRequestHeader("Content-type","application/json");
                xhr.send(JSON.stringify(data));
            }else if(data instanceof FormData){
                xhr.send(data);
            }
            else{
                for(var prop in data){
                    sendMsg += prop+'='+data[prop]+'&';
                }
                sendMsg = sendMsg.slice(0, -1);
                xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                xhr.send(sendMsg);
            }
        }
    });
}
function get(url, option){
    return ajax({
        method:'GET',
        url:url,
        dataType:option.dataType || 'text'
    });
}
function post(url, data, option){
    return ajax({
        method:'POST',
        url:url,
        data:data,
        dataType:option?option.dataType:'text',
        contentType:option?option.contentType:'json'
    });
}
