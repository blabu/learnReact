const STAT = "/api/v1/info"
const CLIENT = "/api/v1/client"
const ALL_CLIENTS = "/api/v1/clients"
const CHECK_KEY = "/api/v1/checkKey"
const PERM = "/api/v1/perm"
const MARKER = "/loc.png"
const SERVER_ADDR = "" // "https://195.60.229.164:3555"

const formURL = (command, ...param) => {
    const url = SERVER_ADDR;
    const requestParam = param.map(e=>`${e.key}=${e.value}`).join("&");
    return `${url}${command}?${requestParam}`
}

function ResolveAfter(timeout, ...resolveParam) {
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve(...resolveParam);
        }, timeout);
    })
}

function GetFetch(command, ...param) {
    return new Promise((resolve, reject) => {
        fetch(formURL(command, ...param),
        {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            headers: {"Content-Type":"application/json"},
        })
        .then(answer => {
            if(!answer.ok) {
                throw (new Error(`Responce status ${answer.status}, ${answer.statusText}`));
            }
            return answer.json()
        })
        .then(result => resolve(result))
        .catch(err => reject(err))
        .finally(()=>console.log("Finaly method in get is worked..."))
    })
}

function PostFetch(command, postData, ...param) {
    return new Promise((resolve, reject) => {
        fetch(formURL(command, param),
        {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {"Content-Type":"application/json"},
            body: postData,
        })
        .then(answer => answer.json())
        .then(result => resolve(result))
        .catch(err => reject(err))
        .finally(()=>console.log("Finaly method in post is worked"))
    })
}

async function Request(url, method="GET", data=null) {
    const headers = {};
    let body;
    if(data) {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(data);
    }
    try {
        const resp = await fetch(url, {
            method,
            headers,
            body,
        });
        return await resp.json();
    } catch(e) {
        console.warn(e);
    }
}

async function LoadImage(url) {
    return fetch(url)
    .then(response=> response.blob())
    .then(blob => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', ()=>resolve(reader.result));
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    });
}

export {
    Request,
    LoadImage,
    GetFetch as Get,
    PostFetch as Post,
    ResolveAfter, 
    STAT, 
    CLIENT, 
    ALL_CLIENTS, 
    CHECK_KEY, 
    MARKER, 
    PERM, 
    SERVER_ADDR
};