import { Directive, ElementRef, OnInit, HostBinding, ChangeDetectorRef} from '@angular/core';
import { EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDisplay]',
  inputs:['item'],
  outputs:['remark','on_style_width']
})
export class DisplayDirective implements OnInit{
  private item:string;
  
  remark = new EventEmitter();
  on_style_width = new EventEmitter();
  // @HostBinding('style.width.px') _width: string;
  // @HostBinding('style.height.px') _height: string;
  // @HostBinding('style.left.px') _left: string;
  // @HostBinding('style.top.px') _top: string;

  constructor(private element:ElementRef, private cdr:ChangeDetectorRef) { }

  ngOnInit(){
    this.element.nativeElement.src=this.item[0];
    // this.element.nativeElement.width=this.item[1];
    this.sendMsg();
  } 
  
  sendMsg() {    
    if(this.item) {
      // console.log(this.item);
      const msg = this.item[0].split('/');
      // this.remark.emit(msg.substring(msg.lastIndexOf('/')+1,msg.lastIndexOf('.')));
      // console.log(msg);
      // this.remark.emit(msg.substr(msg.lastIndexOf('/')+1,6));
      // const letter = msg[msg.length-1];
      const letter = msg[msg.length-1].substr(1,5);
      // const letter2 = letter.toString();
      // console.log(letter==="017010");
      // const letter = "017012";
      this.remark.emit(letter);
      // this.cdr.detectChanges();
    }    
    // this.remark.emit(this.item);
    // console.log(this.item);
  }
  
}