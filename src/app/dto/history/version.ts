import {Revision} from "./revision";

export class Version<T> {
    revision: Revision;
    object: T;
}
