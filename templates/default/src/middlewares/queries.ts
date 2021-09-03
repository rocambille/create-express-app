import { queries } from "../../prisma";

export const User = queries("user", { hide: { password: true } });
