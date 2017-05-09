const db = require('./util/_db');
const request = require('./util/_request');
const assert = require('chai').assert;

describe.only('User Management Api', () => {

    before(db.drop);

    it('initial /GET returns empty list', () => {
        return request
            .get('/users')
            .then(res => {
                const users = res.body;
                assert.deepEqual(users, []);
            });
    });

    let keeley = {
        name: 'Keeley',
        email: 'keeleyhammond@me.com',
        password: 'hunter2',
        spotify: {
            spotify_id: 'vertedinde',
            access_token: ''
        },
        friends: [],
        faveGenre: ['acoustic', 'afrobeat', 'alt-rock']
    };

    let mississippiStudios = {
        name: 'Mississippi Studios',
        email: 'fakeUser3@fake.com',
        spotify: {
            spotify_id: 'mississippipstudios',
            access_token: ''
        },
        password: 'fakePassword',
        friends: [],
        faveGenre: ['opera', 'afrobeat', 'alt-rock'],
    };


    let Ivy = {
        name: 'Ivy',
        email: 'ivy@fake.com',
        password: 'fakePassword',
        friends: [],
        faveGenre: ['opera', 'afrobeat', 'alt-rock'],
    };


    let colssoccer12 = {
        name: 'Colin Hammond',
        email: 'fakeUser3@fake.com',
        password: 'fakePassword',
        spotify: {
            spotify_id: 'colssoccer12',
            access_token: ''
        },
        friends: [],
        faveGenre: ['acoustic', 'afrobeat', 'alt-rock'],
    };

    function saveUser(user) {
        return request
            .post('/users')
            .send(user)
            .then(res => res.body);
    }

    it('roundtrips a new user', () => {
        return saveUser(keeley)
            .then(savedUser => {
                assert.ok(savedUser._id, 'saved has id');
                keeley = savedUser;
            })
            .then(() => {
                return request.get(`/users/${keeley._id}`);
            })
            .then(res => res.body)
            .then(gotUser => {
                assert.deepEqual(gotUser, keeley);
            });
    });

    it('GET returns 404 for non-existent id', () => {
        const fakeId = '5201103b8896909da4402997';
        return request.get(`/users/${fakeId}`)
            .then(
            () => { throw new Error('expected 404'); },
            res => {
                assert.equal(res.status, 404);
            }
            );
    });

    it('saves a second user', () => {
        return saveUser(colssoccer12)
            .then(savedUser => {
                assert.ok(savedUser._id, 'saved has id');
                colssoccer12 = savedUser;
            });
    });

    it('saves two other users as friends', () => {
        return saveUser(mississippiStudios)
            .then(savedUser => {
                assert.ok(savedUser._id, 'saved has id');
                mississippiStudios = savedUser;
                keeley.friends = [mississippiStudios._id, colssoccer12._id];
            })
            .then(() => {
                return request.put(`/users/${keeley._id}`)
                    .send(keeley)
                    .then(res => res.body)
                    .then(user => {
                        assert.deepEqual(user, keeley);
                    });
            });

    });

    it('returns list of all users', () => {
        return saveUser(Ivy)
            .then(savedUser => {
                Ivy = savedUser[0];
            })
            .then(() => request.get('/users'))
            .then(res => res.body)
            .then(users => {
                assert.equal(users.length, 4);
                function test(fakeUser) {
                    console.log(fakeUser);
                    assert.include(users, {
                        name: fakeUser.name,
                        artist: fakeUser.artist,
                        _id: fakeUser._id,
                        spotifyId: fakeUser.spotifyId,
                        genre: fakeUser.genre,
                    });
                }

                test(keeley);
                test(mississippiStudios);
                test(Ivy);
            });
    });




});