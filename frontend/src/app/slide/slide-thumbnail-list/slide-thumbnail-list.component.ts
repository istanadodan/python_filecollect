import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StatusinfoService, SlideDirectionControl} from '../../statusinfo.service';

@Component({
  selector: 'app-slide-thumbnail-list',
  templateUrl: './slide-thumbnail-list.component.html',
  styleUrls: ['./slide-thumbnail-list.component.css']
})
export class SlideThumbnailListComponent implements OnInit {

  selected_image:object;
  aList:Array<any>;
  index:number;
  VIEW_SIZE:number;
  counter:number=0;
  // @Input() ix; //선택된 이미지의 고유번호
  @Input() list; //전체이미지 데이타
  @Output() clk_ix = new EventEmitter(); //이미지클릭되면 발생되는 이벤트    
  @Input() 
   set ix(view_index) {
     console.log("index:::",view_index);
     this.index = view_index;
      if (this.selected_image) {
        this.selected_image['on'] = false;
      }
      // const ln = Object.keys(this.list).length;  
      this.selected_image = this.list[this.index];
      // console.log(this.ix % ln, this.selected_image);
      this.selected_image['on'] = true;
      // console.log("% ::",view_index % this.VIEW_SIZE, view_index % this.VIEW_SIZE==0);
      // if( this.counter % this.VIEW_SIZE == 0 ) {
      //   this.adjustList();
      // }
      this.SlideDirCond.activate();
      if(this.SlideDirCond.flag) {
        this.adjustList();
        this.SlideDirCond.reset();
      }      
      ++this.counter;
    }
  @Input()
   set dir(dir) {
      console.log("THUMBNAIL DIR:",dir);
      this.service.slideDirection = dir;
      const index = this.SlideDirCond.getIndex();
      this.SlideDirCond.setDir(dir)
      this.SlideDirCond.reset();
      this.SlideDirCond.setIndex(index);
   }

  constructor(private service:StatusinfoService, private SlideDirCond:SlideDirectionControl) {
    this.VIEW_SIZE = service.VIEW_COUNT;
   }

  ngOnInit() { 
    this.aList = []; 
    this.index = 0;
    // this.selected_image = this.list[this.index];
    // this.selected_image['on'] = true;
    this.adjustList();
  }

  clickImage(elm:object, n:number) {
    const ix = elm[2];
    // this.counter = n;
    this.SlideDirCond.setIndex(n);
    this.setDeSelect(this.selected_image);
    this.setSelect(this.list[ix]);
    this.clk_ix.emit(ix);
    // this.selected_image.forEach(element => {
    //   console.log(element);
    // });
  }
  adjustList() {
    // const box = new BoxMaker(this.list,"basic",600);
    let mgr:Container;
    if(this.service.slideDirection == 'left') {
      mgr = new LeftHandler(this.list, this.index, this.VIEW_SIZE);
    } else if (this.service.slideDirection == 'right') {
      mgr = new RightHandler(this.list, this.index, this.VIEW_SIZE);
    }

    this.aList = mgr.create();
    // this.aList = mgr.create("random");
    // console.log("thumb :",this.aList);
  }
  setDeSelect(target) {
    target['on'] = false;
  }
  setSelect(target) {
    target['on'] = true;
    this.selected_image = target;
  }
}

class BoxMaker {
  width:number = 160;
  height:number = 240;
  size:number;
  output:Array<any>=[];
  constructor(private lst:Array<any>,private type:string, private sWidth:number){
    this.size = lst.length;
    this.createBox();
  }
  private createBox() {
    let box:object;
    if (this.type.toLowerCase()=='basic') {
      const cnt = Math.floor(this.sWidth / this.width);
      const ratio = ( this.sWidth - cnt * this.width) / this.sWidth * 100;
      this.width *= (1 + ratio/100);
      for(let i=0;i<cnt;i++){
        box = {id:i, width:this.width, height:this.height};
        this.output.push(box);
      }
      console.log(this.output);
    } else {

    }
  }

}
abstract class Container {
  start:number;
  end:number;
  amount:number;
  size:number;
  output:Array<any>;
  constructor(protected lst:Array<any>){
    this.size = lst.length;
   }
  
  abstract next(id:number);
  
  create():Array<any>{
    this._each( (i) => {
        let el = this.lst[ this.next(i) ];
      return el;
      });
    return this.output;
  }
  private _each(cb) {
    this.output=[];
    for(let i=this.start; i<= this.end; ++i) {
      this.output.push( cb(i) );
    }
  }
}
class RightHandler extends Container{
  start:number;
  end:number;
  amount:number;

  constructor(lst:Array<any>, start:number, amount:number){ 
    super(lst);
    this.amount = Math.min( amount , this.size );
    this.start = start;
    this.end = this.start + this.amount -1;
    console.log("RightHandler start::");
  }
  
  next(ix:number) {
    let ret:number = 0;
    ret = (ix + 0)>=this.size? (ix + 0)-this.size : ix + 0;
    // console.log("Right::ret",ret);
    return ret;
  }  
}

class LeftHandler extends Container{
  start:number;
  end:number;
  amount:number;
  constructor(lst:Array<any>, start:number, amount:number){ 
    super(lst);
    this.amount = Math.min( amount , this.size);
    this.start = start - amount;
    this.end = this.start + this.amount -1;
    console.log("LeftHandler start::");
  }
  next(ix:number) {
    let ret:number;
    // ix -= this.amount; //보정
    ret = (ix +1)<0? (ix + 1) + this.size : ix + 1;
    // } else {
    //   ret = Math.floor( Math.random() * this.size );
    // }
    // console.log("LEFT::ret",ret);
    return ret;
  }  
}