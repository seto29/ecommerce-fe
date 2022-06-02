import axios from "axios";
import ls from "local-storage"
import {tokenRecreate} from "./services/User"
const instance = axios.create({
    baseURL: "https://api-dev.hijiofficial.com/v2/",
    headers: { 'Authorization': 'Bearer ' + ls.get('token') }
     
    
});

async function reFetch(originalRequest){
  const result = await axios({
    method: originalRequest.method,
    url: "https://api-dev.hijiofficial.com/v2/"+originalRequest.url,
    headers: originalRequest.headers
  });
  return result
}
async function reFetchData(originalRequest){
  const result = await axios({
    method: originalRequest.method,
    url: "https://api-dev.hijiofficial.com/v2/"+originalRequest.url,
    data:originalRequest.data,
    headers: originalRequest.headers
  });
  return result
}

async function reFetchToken(response){
  const responseT = await axios({
    method: 'post',
    url: "https://api-dev.hijiofficial.com/v2/"+'auth/reCreate.php',
    headers: { 'Authorization': 'Bearer ' + ls.get('token') }
  });
  //console.log(responseT)
    if (responseT.data.status === 200) {
      ls.remove('token')
      ls.set('token',responseT.data.token)
    const originalRequest = response.config;
    originalRequest.headers['Authorization'] = 'Bearer ' + responseT.data.token
    if(typeof originalRequest.data==="undefined"){
      const result = await reFetch(originalRequest)
      //console.log(result)
      return result
    }else{
      const result = await reFetchData(originalRequest)
      //console.log(result)
      return result
    }
  }
}

instance.defaults.timeout = 5000;
instance.interceptors.request.use((config) => {
  // //console.log(config.headers)
    config.headers = {}
    config.headers['Authorization'] = 'Bearer ' + ls.get('token')
    return config;
  });
instance.interceptors.response.use( async function (response) {
  //console.log(response)
  if (response.data.status === 401 || response.status!==200 || typeof response === "undefined") {
     const ress = await reFetchToken(response)
     //console.log(ress)
    
     return ress;
  } else {
    return response;

  }
});
export default instance;