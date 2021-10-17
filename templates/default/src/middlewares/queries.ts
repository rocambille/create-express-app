import { queries } from "../../prisma";

// `queries` factory generates CRUD middlewares:
// { findAll, find, findOrFail, persist, destroy }

// relations are disabled: the queries get scalar only
// make a custom query using prisma/client to get relations

export const User = queries("user", { hide: { password: true } });
