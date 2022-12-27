import axios, {Method} from 'axios';

export const executeRequest = (endpoint: string, method: Method, body? : any) =>{
    const headers = {'Content-Type' : 'application/json'} as any;

    const token = localStorage.getItem('accessToken');
    if(token){
        headers['Authorization'] = 'Bearer ' + token;
    }
    
    const URL = 'http://localhost:3000/api/'+endpoint;
    console.log(`executando: ${URL}, método: ${method} e body: ${body}`);
    return axios.request({
        url: URL,
        method,
        data: body? body : '',
        headers,
        timeout: 30000
    });
}