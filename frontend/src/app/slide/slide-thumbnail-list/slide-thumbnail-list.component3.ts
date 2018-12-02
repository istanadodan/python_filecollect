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
  direction:string;
  index:number;
  VIEW_SIZE:number;
  counter:number=0; 
  imgLoader:ImgLoader;
  slideHandler:SlideHandler;
  
  @Output() click01 = new EventEmitter(); //이미지클릭된후 생성된 이벤트
  @Output() emit01 = new EventEmitter(); //슬라이드방향이 변경된후 생성된 이벤트
  
  constructor(private service:StatusinfoService, 
    private SlideDirCond:SlideDirectionControl) {
    this.VIEW_SIZE = service.VIEW_COUNT; 
    }
    
  //전체이미지데이타 주입
  @Input() list; 

  //슬라이드 타이머이벤트 처리
  @Input() 
   set ix(view_index) {
    }
  @Input()
   set dir(dir) {
     this.direction = dir;
   } 
    ngOnInit() { 
      console.log("ngOninit",this.dir,this.VIEW_SIZE,this.list[0]);
      // this.slideHandler = new SlideHandler(this.VIEW_SIZE);
      // this.slideHandler.setDir(this.dir);
      // this.slideHandler.setIndex(0);
      // this.imgLoader = new ImgLoader(this.list,this.VIEW_SIZE);
      // this.imgLoader.setDir(this.dir);
      // this.imgLoader.setIndex(0);
      // 초기 이미지목록 생성
      // this.aList = this.imgLoader.getBox();
    }

  getTransferData(n:number):object {
    console.log("transferData:index",this.index);
    const link = {
      src:this.list[this.index||0][0] || "",
      total:this.VIEW_SIZE || 0,
      index:this.index || 0
    }
    console.log("transferData",link);
    return link;
  }
  onClick(elm:object, n:number) {
    const link = this.getTransferData(n);
    this.click01.emit(link);
  }
  
  setDeSelect(target) {
    target['on'] = false;
  }
  setSelect(target) {
    target['on'] = true;
    this.selected_image = target;
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