

import request  from 'supertest'
import app from '../src/app';

describe('GET /', () => {


    // This is an individual test case
    it('should return Hello, TypeScript with Express!', async () => {
        // Make a GET request to the root endpoint ('/') using Supertest
        const res = await request(app).get('/');

        // Assert that the HTTP status code of the response is 200 (OK)
        expect(res.statusCode).toEqual(200);

        // Assert that the response body contains the expected text
        expect(res.text).toBe('Hello, TypeScript with Express!');
    });
});