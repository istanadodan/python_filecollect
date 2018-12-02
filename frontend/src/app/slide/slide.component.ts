import { Component, OnInit } from '@angular/core';
import { StatusinfoService} from '../statusinfo.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.css']
})
export class SlideComponent implements OnInit {

  images:JSON;
  link:iLink;
  tiktok:number;
  path:string;
  size:number;
  op_mode:MODE;
  slideDirection:string;
  INTERVAL:number = 3000;
  timer$:Subscription;

  constructor(private service:StatusinfoService) { 
    this.size = this.service.size();
    this.images = this.service.slideList;
    this.slideDirection = this.service.slideDirection;
  }

  ngOnInit() {
    this._initial();
    this.setMode('stop');
    this.startSlide()
    console.log("slide.component",this.op_mode);
  }
  _initial() {
    this.tiktok = 100;
  }
  //섬네일이미지 클릭
  onClick01() {
    this.stopSlide();
  } 
  //섬네일컴포로부터 발생한 이벤트처리
  onEmit01(link:iLink) {
    this.link = link;
    this.path = this.link.src;
    console.log("섬네일컴포로부터 발생한 이벤트처리",this.link.src);
    this.startSlide();
  } 
  //슬라이드방향이 변경될때 발생되는 이벤트
  onChange01(){
    this.stopSlide();
  }
  onEmit02(link:iLink) {
    console.log("parent Direction Emit02");
    this.link = link;
    this.startSlide();
  }
  private startSlide() {
    if (this.timer$!=null) {
      this.stopSlide();
    }
    const observer = (v) =>{
      this.tiktok = v;
      console.log("handler",this.tiktok);  
    }
    this.timer$ = Observable.interval(this.INTERVAL).subscribe(observer);
    this.setMode("slide");
  }
  //슬라이딩 인터벌용 핸들러
  //핸들러안에서는 this는 oberable객체를 가르킴.
  private handler01(v){
    this.tiktok = v;
    this.size++;
    console.log("handler",this.tiktok);
  }
  private stopSlide() {
    this.timer$.unsubscribe();
    this.timer$ = null;
    this.setMode("stop");
  }  
  getClass() {
    const isSlide:boolean = this.op_mode['mode']=='slide';
    return {'slide':isSlide,'stop':!isSlide};
  }
  setMode(mode) {
    switch(mode) {
      case 'slide':
        this.op_mode = {'mode':'slide','txt':'슬라이드중지'}
        break;
      case 'stop':
        this.op_mode = {'mode': 'stop','txt':'슬라이드개시'};
        break;
    }
  }
 
  routing(url) {
    this.timer$.unsubscribe();
    this.service.navigate(url);
  }
  dirChange(dir) {
    //이 시점에서 this.slideDirection은 변동이 없음...
    this.timer$.unsubscribe();
    this.startSlide();
  }
  change_mode(){
    if (this.op_mode['mode']=='slide') {
      this.stopSlide();
      this.setMode('stop');
    } else {
      this.setMode('slide');
      this.startSlide();
    }
  }
}
interface iLink {
  src:string;
  total:number;
  index:number;
}
interface MODE {
  mode:string;
  txt:string;  
}

class State {
  STATE:Array<string> = ['slide','stop'];
  DIRECTION:Array<string>=['left','right'];
  name:string;
  description:string;
  nIndex:number;
  dir:string;
  operate() {
    switch(this.name) {
      case this.STATE[0]:

      case this.STATE[1]:
        
    }
  }
}