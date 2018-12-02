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
  selectId:number; //테두리설정 판단용
  VIEW_SIZE:number;
  totalcount:number;

  imgLoader:ImgLoader;
  slideHandler:SlideHandler;
  
  @Output() onEmit01 = new EventEmitter(); //이미지클릭된후 생성된 이벤트
  @Output() onEmit02 = new EventEmitter(); //슬라이드방향이 변경된후 생성된 이벤트
    
  //전체이미지데이타 주입
  @Input() list;
  
  @Input()
   set dir(dir:string) {
      console.log("INPUT DIR:",dir,"index",this.index);
      this.direction = dir;
      if(this.index!=null) {
        this.onEmit02.emit(this.getTransferData());
      }
   } 
   
  //슬라이드 타이머이벤트 처리
  @Input() 
   set ix(ix:number) {
    console.log("INPUT IX",ix);
    //처리할 순번을 받음.
    if(this.slideHandler==null || this.imgLoader==null) {
      return;
    }

    this.slideHandler.setDir(this.direction);
    this.setIndex(this.slideHandler.getNext())
    console.log("this.index",this.index);

    //호스트에 선택될 이미지정보 반송
    this.onEmit01.emit(this.getTransferData());
    
    //다시읽어오기 조건이 만족될때 재로딩
    this.imgLoader.setDir(this.direction);
    if(this.imgLoader.isLoadable(this.index)) {
      this.imgLoader.update();
      this.aList = this.imgLoader.getBox();
      //최초기준값이 변경됨에 따라 테두리처리 갱신.
      this.chkSelectId();
    }
   }
  
   constructor(private service:StatusinfoService, 
    private SlideDirCond:SlideDirectionControl) {
    this.VIEW_SIZE = service.VIEW_COUNT; 
    this.direction = service.slideDirection;
    console.log("Main:constructor");
    }

   ngOnInit() { 
    console.log("ngOninit");
    
    this.totalcount = Object.keys(this.list).length;
    const count = Math.min(this.VIEW_SIZE, this.totalcount);
    console.log("ngOnInit:count",count,"totalcount",this.totalcount);

    this.slideHandler = new SlideHandler(this.totalcount);
    this.slideHandler.setDir(this.direction);
    this.slideHandler.setIndex(0);

    this.imgLoader = new ImgLoader(count);
    this.imgLoader.setList(this.list);
    this.imgLoader.setOption(0);
    this.imgLoader.setDir(this.direction);

    // 초기 이미지목록 생성
    this.aList = this.imgLoader.getBox();
    console.log("constructor",this.aList);

    //호스트에 선택될 이미지정보 반송
    this.setIndex(0);
    this.onEmit01.emit(this.getTransferData());
    }
  // 입력파라미터를 체크해서 인텍스변수에 넣는다.
  private setIndex(index:number) {

    this.index = index % this.totalcount;
    //index가 설정될때 테두리판단설정처리
    this.chkSelectId();
  }  
  getTransferData():object {
    if(this.list==null || this.index==null)
      return;

    console.log("transferData:index",this.index);
    const link = {
      src:this.list[this.index][0] || "",
      total:this.VIEW_SIZE || 0,
      index:this.index
    }
    console.log("transferData",link);
    return link;
  }
  onClick(elm:object, n:number) {
    this.setIndex(this.imgLoader.initNo + n);
    this.slideHandler.setIndex(this.index);
    const link = this.getTransferData();
    this.onEmit01.emit(link);
  }
  //테두리대상인지를 점검
  private chkSelectId() {
    if(this.imgLoader==null) {
      this.selectId = 0;
    }
      
    const diff = this.index - this.imgLoader.initNo;
    const targetid = (diff >= 0)? diff: diff + this.totalcount;
    this.selectId = targetid % Math.min(this.totalcount, this.VIEW_SIZE);
    console.log("selected ID ",targetid,"init no",this.index-diff,"base no",Math.min(this.totalcount, this.VIEW_SIZE));
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

class ImgLoader { 
  //이미지의 축출시점번호
  initNo:number;  
  dir:string;
  //option => 0:sequeence, 1:random  
  option:number; 
  //이미지목록 전체크기 
  totalNo:number;
  //이미지목록, 축출방향, 컨테이너크기(축출갯수)
  list:Array<any>;
  
  constructor(private size:number){
    this.initNo = 0;
  }
  
  setList(list:Array<any>) {
    this.list = list;
    this.totalNo = list==null? 0 :Object.keys(list).length;
  }
  setDir(direction:string) {
    this.dir = direction;
    console.log("ImgLoader:setDir",this.dir);
  }
  setOption(option:number) {
    this.option = option;
  }
  // 초기값을 설정할 수 있다. 기본은 0;
  setIndex(index:number) {
    this.initNo = index;
  }
  update() {
    //배열변경따라 최초값을 갱신한다.
    this.initNo = this._getNextInitNo()['start'];
  }
  private _getNextInitNo():object {
    let index:number, n:number;
    if(this.dir=='right') {
      index = this._conv(this.initNo + this.size);
      n = index;
    }
    if(this.dir=='left') {
      index = this._conv(this.initNo -1);
      n = index - this.size +1
    }
    return {present:index, start:n};
  }
  isLoadable(index):boolean {
    return (index == this._getNextInitNo()['present']);
  }
  getBox():Array<any> {
    const output = new Array<any>();
    if(this.option==0) {
      this._each( ix => {
        output.push(this.list[ix]);
      });
    } else if(this.option ==1 ) {
        const tmp = Array<any>();
        let rnd_ix = 0;
        this._each( ix => {
          while(true) {
            rnd_ix = Math.floor(Math.random() * this.totalNo);
            const test = tmp.filter(v => rnd_ix == v);
            if(test==null || test ==[]) {
              break;
            }
          }
          output.push(this.list[rnd_ix]);
        })
    }
    console.log("ImgLoader:getBox()",output,":",this.option,":");

    return output;
  }
  private _conv(order:number) {
    return order<0? this.totalNo + order : order % this.totalNo;
  }
  private _each(callback) {
    console.log("_each:initNo",this.initNo);
    console.log("_each:size",this.size);
    for(let i=this.initNo;i<this.size+this.initNo;i++){
      //로테이션하도록 변환된 값을 넘김.
      console.log("ImgLoader:each",this._conv(i));
      callback( this._conv(i) ); 
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
    const next = (this.dir=='right')? ++this.order:--this.order;
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