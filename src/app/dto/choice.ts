export class Choice {
    value: any;
    display_name: string;

    constructor(value?: string, display_name?: string) {
        this.value = value;
        this.display_name = display_name;
    }
}
