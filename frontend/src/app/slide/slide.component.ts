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
  selected_image:JSON;
  path:string="";
  size:number;
  op_mode:MODE;
  index:number;
  ix:number;
  slide_class:string;
  timer$:Subscription;

  constructor(private service:StatusinfoService) { 
    this.size = Object.keys(this.service.slideList).length;
    this.images = this.service.slideList;
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
    this.selected_image = this.service.slideList[0];
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
    const interval$ = Observable.interval(3000);
    const observer = (x) => {
        // this.selected_image['on'] = false;
        this.ix = ( this.index + 1 ) % this.size;
        this.selected_image =this.service.slideList[this.ix];
        this.path =this.selected_image[0];
        // this.selected_image['on'] = true;
        this.index++;
        // console.log("inx",x);
    }
    this.timer$ = interval$.subscribe(observer);
  }
  routing(url) {
    this.timer$.unsubscribe();
    this.service.navigate(url);
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
