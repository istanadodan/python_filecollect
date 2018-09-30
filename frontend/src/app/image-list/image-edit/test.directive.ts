import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';

@Directive({
  selector: '[appTest]'
})
export class TestDirective {

  constructor(private templateRef:TemplateRef<any>, private viewContainer:ViewContainerRef) { }

  @Input() set appTest(con:boolean) {
    console.log('condition '+ con);
    if(con) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
