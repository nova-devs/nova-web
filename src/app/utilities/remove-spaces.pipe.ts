import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: "removewhitespaces"
})
export class RemovewhitespacesPipe implements PipeTransform {
  public transform(value: string): string {
    return value.replace(/ /g, "-");
  }
}
