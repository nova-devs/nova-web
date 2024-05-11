import {ModelBase} from "../model-base";
import {User} from "../account/user";
import {ChurchGroup} from "./church-group";

export class ChurchGroupUser extends ModelBase {
    user: User | string;
    church_group: ChurchGroup | string;
    association_type: string;
}
