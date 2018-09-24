import { Directive, ElementRef, OnInit, Output} from '@angular/core';
import { EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDisplay]',
  inputs:['item'],
  outputs:['remark']
})
export class DisplayDirective implements OnInit{
  private item:string;
  
  remark = new EventEmitter();

  constructor(private element:ElementRef) { }

  ngOnInit(){
    this.element.nativeElement.src=this.item;
    this.sendMsg();
  } 
  
  sendMsg() {    
    if(this.item) {
      const msg = this.item.split('/');
      // this.remark.emit(msg.substring(msg.lastIndexOf('/')+1,msg.lastIndexOf('.')));
      // console.log(msg);
      // this.remark.emit(msg.substr(msg.lastIndexOf('/')+1,6));
      // const letter = msg[msg.length-1];
      const letter = msg[msg.length-1].substr(1,5);
      // const letter2 = letter.toString();
      // console.log(letter==="017010");
      // const letter = "017012";
      this.remark.emit(letter);
    }    
    // this.remark.emit(this.item);
    // console.log(this.item);
  }
  
}