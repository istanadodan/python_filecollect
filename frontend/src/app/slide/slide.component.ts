import { Component, OnInit } from '@angular/core';
import { StatusinfoService} from '../statusinfo.service';
import { Observable, Subscription } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.css']
})
export class SlideComponent implements OnInit {

  images:JSON;
  selected_image:JSON;
  path:string;
  size:number;
  op_mode:MODE;
  index:number;
  ix:number;
  slideDirection;
  INTERVAL:number = 2000;
  timer$:Subscription;

  constructor(private service:StatusinfoService) { 
    this.size = this.service.size();
    this.images = this.service.slideList;
    this.slideDirection = this.service.slideDirection;
  }

  ngOnInit() {
    this._initial();
    this.setMode('slide');
    this.start();
    console.log(this.op_mode);
  }
  _initial() {
    this.index=0;
    this.ix=0;
    this.selected_image = this.service.slideList?this.service.slideList[0]:{};
    this.selected_image['on'] = true;
    this.path = this.service.slideList[0][0];
  }
  getClass() {
    if (this.op_mode['mode']=='slide') {
      return {'slide':true}
    }
    else {
      return {'slide':false,'stop':true}
    }
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
  setSlider(clk_ix) {
    this.timer$.unsubscribe();    
    this.index = clk_ix; //clicked image's no
    this.selected_image = this.images[clk_ix]; //slide image
    this.path = this.selected_image[0]; //src
    this.start();
  }
  
  private start(){
    const interval$ = Observable.interval(this.INTERVAL);
    const observer = (x) => {      
      if(this.slideDirection == 'left') {
        this.index = (this.index-1)<0? this.size-1: this.index-1;
      } else if(this.slideDirection == 'right') {
        this.index++;
      }
      this.ix = ( this.index + 0 ) % this.size;
      this.selected_image =this.service.slideList[this.ix];
      this.path =this.selected_image[0];
        // console.log("inx",this.index);
    }
    this.timer$ = interval$.subscribe(observer);
  }
  routing(url) {
    this.timer$.unsubscribe();
    this.service.navigate(url);
  }
  dirChange(dir) {
    //이 시점에서 this.slideDirection은 변동이 없음...
    this.timer$.unsubscribe();
    this.start();
  }
  change_mode(){
    if (this.op_mode['mode']=='slide') {
      this.timer$.unsubscribe();
      this.setMode('stop');
    } else {
      this.setMode('slide');
      this.start();
    }
  }
}
interface MODE {
  mode:string;
  txt:string;
}
