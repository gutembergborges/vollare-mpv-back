const { TestScheduler } = require('jest')

// import tests lib
require('jest')
const request = require('supertest')
// import conf to use env variables
const config = require('../config')

// testing GET
test('get /users', () => {
    return request(config.base_url)     // return to use a request like a promise
        .get('/users')
        .then(response => {
            expect(response.status).toBe(200)   // awaits response status is 200
            expect(response.body).toBeInstanceOf(Array)
        }).catch(fail)  // global function to transform error in fail test
})

// testing POST
test('post /users', () => {
    return request(config.base_url)     // return to use a request like a promise
        .post('/users')
        .send({
            name: 'admin',
            email: 'admin@vollare.com',
            password: '123456',
            role: 'Administrador'
        })
        .then(response => {
            expect(response.status).toBe(200)   // awaits response status is 200
            // expect(response.body).toBeInstanceOf(Array)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('admin')
            expect(response.body.email).toBe('admin@vollare.com')
            expect(response.body.role).toBe('Administrador')
            expect(response.body.password).toBeUndefined()   // because don't return password
        }).catch(fail)  // global function to transform error in fail test
})
