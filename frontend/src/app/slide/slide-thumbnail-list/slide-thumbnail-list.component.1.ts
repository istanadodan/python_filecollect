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
  imgLoader:ImgLoader;
  slideHandler:SlideHandler;
  
  @Output() click01 = new EventEmitter(); //이미지클릭된후 생성된 이벤트
  
  constructor(private service:StatusinfoService, 
    private SlideDirCond:SlideDirectionControl) {
    this.VIEW_SIZE = service.VIEW_COUNT; 
    }

    ngOnInit() { 
      console.log("ngOninit",this.dir,this.VIEW_SIZE,this.list[0]);
      this.slideHandler = new SlideHandler(this.VIEW_SIZE);
      this.slideHandler.setDir(this.dir);
      this.slideHandler.setIndex(0);
      this.imgLoader = new ImgLoader(this.list,this.VIEW_SIZE);
      this.imgLoader.setDir(this.dir);
      this.imgLoader.setIndex(0);
      //초기 이미지목록 생성
      // this.aList = this.imgLoader.getBox();

      // this.index = 0;
      // this.selected_image = this.list[this.index];
      // this.selected_image['on'] = true;
      // this.adjustList();
    }

  //전체이미지데이타 주입
  @Input() list; 

  //슬라이드 타이머이벤트 처리
  @Input() 
   set ix(view_index) {
     console.log("THUMB-List:input()",view_index);
     //처리할 순번을 받음.
     this.index = this.slideHandler.getNext();
    //  this.index = 0;    

     //호스트에 선택될 이미지정보 반송
    //  const link = this.getTransferData();
    //  this.click01.emit(link);
     
     //다시읽어오기 조건이 만족될때 재로딩
    //  if(this.index % this.VIEW_SIZE == 0) {
       console.log("test2",this.index);
      //  this.imgLoader.setIndex(this.index);
        // this.aList = this.imgLoader.getBox();
    //  }

    //  this.index = view_index;
    //   if (this.selected_image) {
    //     this.selected_image['on'] = false;
    //   }
    //   this.selected_image = this.list[this.index];
    //   this.selected_image['on'] = true;
    //   // console.log("% ::",view_index % this.VIEW_SIZE, view_index % this.VIEW_SIZE==0);
    //   // if( this.counter % this.VIEW_SIZE == 0 ) {
    //   //   this.adjustList();
    //   // }
    //   this.SlideDirCond.activate();
    //   if(this.SlideDirCond.flag) {
    //     this.adjustList();
    //     this.SlideDirCond.reset();
    //   }      
    //   ++this.counter;
    }
  @Input()
   set dir(dir) {
      console.log("THUMBNAIL DIR:",dir);
      this.dir = dir;
      this.slideHandler.setDir(this.dir);
      this.imgLoader.setDir(this.dir);
      // this.service.slideDirection = dir;
      // const index = this.SlideDirCond.getIndex();
      // this.SlideDirCond.setDir(dir)
      // this.SlideDirCond.reset();
      // this.SlideDirCond.setIndex(index);
   } 
  getTransferData():object {
    const link = {
      'src':this.list[this.index][0],
      'total':this.VIEW_SIZE,
      'index':this.index
    }
    return link;
  }
  onClick(elm:object, n:number) {
    const link = this.getTransferData();
    this.click01.emit(link);
  }
  // clickImage(elm:object, n:number) {
  //   const ix = elm[2];
  //   // this.counter = n;
  //   this.SlideDirCond.setIndex(n);
  //   this.setDeSelect(this.selected_image);
  //   this.setSelect(this.list[ix]);
  //   this.clk_ix.emit(ix);
  //   // this.selected_image.forEach(element => {
  //   //   console.log(element);
  //   // });
  // }
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

class ImgLoader { 
  //이미지의 축출시점번호
  initNo:number;  
  dir:string;
  //option => 0:sequeence, 1:random  
  option:number;  
  //이미지목록, 축출방향, 컨테이너크기(축출갯수)
  
  constructor(private list:Array<any>, private size:number){}
  
  setDir(direction:string) {
    this.dir = direction;
  }
  setOption(option:number) {
    this.option = option;
  }
  setIndex(index:number) {
    if(this.dir=='right') {
      this.initNo = index;
    } else if(this.dir=='left') {
      this.initNo = index - this.size -1;
    } else {
      console.log("ImgLoader:setIndex",this.dir);
    }
  }
  getBox():Array<any> {
    const output = Array<any>();
    if(this.option==0) {
      this._each( ix => {
        output[ix] = this.list[ix];
      });
    } else if(this.option ==1 ) {
        const tmp = Array<any>();
        let rnd_ix = 0;
        this._each( ix => {
          while(true) {
            rnd_ix = Math.floor(Math.random() * this.list.length);
            const test = tmp.filter(v => rnd_ix == v);
            if(test==null || test ==[]) {
              break;
            }
          }
          output[ix] = this.list[rnd_ix];
        })
    }
    console.log("ImgLoader:getBox()",output);
    return output;
  }
  private _each(callback) {
    for(let i=this.initNo;i<this.size+this.initNo;i++){
      callback(i); 
    }
  }
}
class SlideHandler {
  order:number;
  dir:string; 
  constructor(private size:number){
    console.log("SlideHandler constructor");
  } 
  getNext(){
    const next = (this.dir=='right')? this.order++:this.order--;
    console.log("getNext",next);
    if(next<0) {
      this.order = this.size -1;
    } else {
      this.order = next % this.size;
    }
    console.log("Slidehandler:getNext()",this.order,"(direction)",this.dir);
    return this.order;
  }
  //이미지클릭용
  setIndex(index:number) {
    this.order = index;
  }
  //방향전환용
  setDir(direction:string) {
    this.dir = direction;
  }
}