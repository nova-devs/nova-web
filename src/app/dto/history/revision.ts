import {User} from "../../models/account/user";

export class Revision {
    id: number;
    created_at: Date;
    user: User;
}
