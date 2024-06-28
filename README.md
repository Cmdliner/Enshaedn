# ENSHAEDN

## To install dependencies:

```bash
bun install
```

## To run:

```bash
bun run src/app.ts
```

## For ENV  Cnfiguration:
- Create a `.env` file and add the following to it
```bash
CORS_ORIGN=<client@example.com>
MONGO_URI=<path/to/mongo_db_database>
JWT_SECRET=<SOME_IMPORTANT_SECRET>
```
 ## API Routes
- All API paths start at `/api/v1`
- Auth routes `/register`, `/sign-in`  and `/logout` are accessed through the `/auth` route fragment.
- Room routes mounted on `/rooms`.
- User actions are mounted on `/user`

### Auth Actions
A user is allowed to `register`, `sign-in` or `logout`
- A post request to `/register` containing a `username` and `password` field in the request body. **N.B => Cors and credentials must be properly implemented**
- For `/sign-in` the same params as register above are required in the request body, a `Authorization` cookie  is sent back to the client. **No headers are set here**
- A post request to '/logout' unsets the `Authorization` cookie that mught have been previously set by `/registet` or `/sign-in` route thereby invalidating the user's auth.
- **The Authentication by verifying the token with a middleware on each request to a protected route.**


## HOW TO USE
To consume the API you send a request to the server @`SERVER_URI/api/v1/<action>` where <action> is either a room, user or auth action.
E.g to get all the rooms in which a user is a participant using the fetch API, we do:
```ts
const res = await fetch('http://example.com/api/v1/user/rooms', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
    mode: 'cors', // important for cors
    credentials: 'include' // important for sending stuff like cookies using cors
});
const data = await res.json();
/* Note that you need to check the data for an "errMssg" key as that's where any errors are passed into*/
if(data["errMssg"]) console.error(data["errMssg"]);
else {/* Update state here maybe set a list or rooms or something */}

```
E.g. to access the register route we send a POST request to `<domain_name.com>/api/v1/auth/register/`


## TODO
- Implement a socket.io server
- Validation Errors aren't handled correctly.
