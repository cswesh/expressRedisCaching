const express = require('express')
require('isomorphic-fetch')
const redis = require('redis')
const router = express.Router()

const client = redis.createClient({
    host:'127.0.0.1',
    port:6379
})

let sourceURL = 'https://jsonplaceholder.typicode.com/todos';

router.get('/',async(req, res)=>{   
        await client.connect();
        const value = await client.get('todos');
        
        if(value){
            console.log("from cached data")
            res.send(JSON.parse(value))
        }
        else{
            const resp = await fetch(sourceURL)
               .then((response) => response.json());
            await client.set('todos', JSON.stringify(resp)); 
            console.log("from source data")
            res.send(resp);
        }
        await client.disconnect();
})

module.exports = router