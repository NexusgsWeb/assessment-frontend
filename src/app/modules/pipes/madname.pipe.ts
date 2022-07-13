import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'MADNamePipe',
})
export class MADNamePipe implements PipeTransform {
  //This pipe returns FirstName and LastName as a Form of FL
  transform(value: any) {
    try {
      value = value + '';
      let arr = value.split(' ');
      return (
        arr[0].toUpperCase().charAt(0) + '' + arr[1].toUpperCase().charAt(0)
      );
    } catch (err) {
      throw new Error(
        'MADNamePipe:USE THIS FORMAT:{{ firstName LastName | MADNamePipe }}'
      );
    }
  }
}
