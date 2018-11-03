import { Directive, ElementRef, OnInit, HostBinding, ChangeDetectorRef, AfterViewInit, HostListener, Renderer} from '@angular/core';
import { EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDisplay]',
  inputs:['item','flag'],
  outputs:['remark','on_style_width']
})
export class DisplayDirective implements OnInit,AfterViewInit{
  private item:string;
  private flag:boolean;
  private el:ElementRef;

  remark = new EventEmitter();
  on_style_width = new EventEmitter();
  @HostBinding('style.width.px') _width: number;
  @HostBinding('style.height.px') _height: number;
  @HostBinding('style.left.px') _left: number;
  @HostBinding('style.top.px') _top: number;
  
  constructor(private element:ElementRef,
              private render:Renderer) { }
  ngAfterViewInit(){
    // this.element.nativeElement.style.overflow = 'auto';
  }
  ngOnInit(){
    // [style.width.px]="item[1][0]" 
    // [style.top.px]="item[2][1]" 
    // [style.left.px]="item[2][0]" 
    // [style.height.px]="item[0].indexOf('.')>0?item[1][1]:0"

    this._width = Number(this.item[1][0]);
    this._height = this.item[0].indexOf('.')>0? Number(this.item[1][1]) : 0;
    this._left = Number(this.item[2][0]);
    this._top = Number(this.item[2][1]);
    this.el = this.element.nativeElement;
    // this.item[0]this.element.nativeElement.src=this.item[0];
    // this.element.nativeElement.style.overflow = '';
    // this.sendMsg();
    // this.element.nativeElement.ownerDocument.body.style.overflow = null;    
  } 
  private zIndex:number;
  private width:string;
  private height:string;
  // private style:any;
  // private property_list = ['zIndex','wdith','height'];
  @HostListener('mouseenter') mouseenter(){
    if (!this.flag) return;
    
    this.zIndex = this.el['style'].zIndex;
    this.width =  this.el['style'].width;
    this.height = this.el['style'].height;
    // this.property_list.forEach((x)=>{
    //   this.style[x] = this.el['style'][x];
    // });
    // this.el['style'].map((x)=>Object.assign(this.style, x) );
    this.el['style'].zIndex = 100000;
    this.el['style'].width= Number(this.width.split('px')[0]) * 2 +'px';
    this.el['style'].height = Number(this.height.split('px')[0]) * 2 + 'px';
    this.el['style'].overflow = 'visible';
  }
  @HostListener('mouseleave') mouseleave(){
    if (!this.flag) return;

    this.el['style'].zIndex = this.zIndex;
    this.el['style'].width= this.width;
    this.el['style'].height = this.height;
    
    this.el['style'].overflow = 'hidden';
  }
  /**
 * Returns a deep copy of the object
 */
private deepCopy(oldObj: any): object{
  var newObj = oldObj;
  if (oldObj && typeof oldObj === "object") {
      newObj = Object.prototype.toString.call(oldObj) === "[object Array]" ? [] : {};
      for (var i in oldObj) {
          newObj[i] = this.deepCopy(oldObj[i]);
      }
  }
  return newObj;
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