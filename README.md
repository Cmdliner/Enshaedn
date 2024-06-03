# ENSHAEDN

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/app.ts
```

 ## API Routes
- All API paths start at `/api/v1`
- Auth routes `/register`, `/sign-in`  and `/logout` are accessed through the `/auth` route fragment.
- Room routes mounted on `/rooms`. Delete and create actions have been implemented.

E.g. to access the register route we send a aPOST request to `<domain_name.com>/api/v1/auth/register/`


## TODO
- Use the short UUID pkg to route the rooms abstracting their actual id in the src code