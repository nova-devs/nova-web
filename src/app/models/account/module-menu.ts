import {Module} from "./module";
import {Menu} from "./menu";

export class ModuleMenu {
    url: string;
    id: number;
    root: string | Menu;
    module: string | Module;
    menu: any | Menu;
    order: number;
    is_active: boolean;

    // extra fields
    granted: boolean;
}
