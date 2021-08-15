import { queries } from "../../prisma";

export const User = queries("user", { public: { id: true, email: true } });
