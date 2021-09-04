import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appMessageHost]'
})
export class MessageHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { 
     
  }

}