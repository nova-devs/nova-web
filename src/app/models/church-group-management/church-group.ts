import {ModelBase} from "../model-base";
import {User} from "../account/user";

export class ChurchGroup extends ModelBase {
    type: string;
    category: string;
    description: string;
    users: User[] | string[];
}
