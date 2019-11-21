
export const xmlhttpRequest = (type = 'get', isAsync = true, url, data, headersData, callback) => {
  let requestObj;
  if (window.XMLHttpRequest)
  { // code for IE7+, Firefox, Chrome, Opera, Safari
    requestObj = new XMLHttpRequest();
  }
  else
  { // code for IE6, IE5
    /* eslint-disable */
    requestObj = new ActiveXObject('Microsoft.XMLHTTP');
  }
  type = type.toLowerCase();
  if (type == 'get' || type == 'delete') {
    let dataStr = '';
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&';
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      if (url.indexOf('?') >0 ){
        url = url + '&' + dataStr;
      } else {
        url = url + '?' + dataStr;
      }
    }
  }
  requestObj.open(type, url, isAsync);
  if(typeof headersData === 'object') {
    for(let k in headersData ) {
      requestObj.setRequestHeader(k, headersData[k] );
    }
  }
  let sendData = '';
  if (type === 'post' || type === 'put') {
    requestObj.setRequestHeader("Content-type", "application/json; charset=utf-8");
    sendData = JSON.stringify(data);
  }
  requestObj.send(sendData);
  
  requestObj.onreadystatechange = ()=> {
    if(requestObj.readyState === 4) {
      if(requestObj.status === 200){
        let obj = requestObj.response;
        if (typeof obj !== 'object') {
          obj = JSON.parse(obj);
        }
        if(typeof callback === 'function') {
          callback(obj);
        }
      }
    }
  }

}
