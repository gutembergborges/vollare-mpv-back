const restify = require ('restify')

const server = restify.createServer({
    name: 'vollare-mpv-back',
    version: '0.0.1'
})

const users = [
    {id: 'b739fba7-cdea-42f9-8d22-7b7a80455d80', name: 'Xiang Ling'},
    {id: '8129764b-eab0-4235-bb2e-b36b0f2ec70e', name: 'Ast Mona'}
]

server.get('/users', (req, resp, next)=>{
    resp.json(users)
})

server.get('/users/:id', (req, resp, next)=>{
    const filtered = users.filter(user => user.id === req.params.id)
    if(filtered.length){
        resp.json(filtered[0])
    } else {
        resp.status(404)
        resp.json({message: 'not found'})
    }
    return next()
})

server.listen(8080, ()=>{
    console.log('API listening on 8080')
})