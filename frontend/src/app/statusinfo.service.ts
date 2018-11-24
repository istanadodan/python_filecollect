import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable()
export class StatusinfoService {
  album_name: string;
  slideList:JSON;
  slideDirection:string="left";
  VIEW_COUNT:number=6;
  constructor(private router: Router) { }
  navigate(url) {
    this.album_name="";
    switch (url) {
      case 'home':
        this.router.navigateByUrl('/home');
        console.log('home navigate');
        break;
      case 'slide':
      this.router.navigateByUrl('/slide');
      console.log('slide navigate');
      break;
    }
  }
  size(){
    return this.slideList? Object.keys(this.slideList).length: 0;
  }
}

@Injectable()
export class EventShareService {
  private emitChangeSource = new Subject<any>();
  changeEmitted$ = this.emitChangeSource.asObservable();
  emitChange(change:any) {
    this.emitChangeSource.next(change);
  }
}

@Injectable()
export class SlideDirectionControl {
  direction:string;
  VIEW_COUNT:number;
  current_index:number;
  flag:Boolean; //line feed? No:false, Yes:True
  
  constructor(private service:StatusinfoService){
    this.direction = service.slideDirection;
    this.VIEW_COUNT = service.VIEW_COUNT;
    console.log("DIR:",this.direction,"COUNT:",this.VIEW_COUNT);
    this.reset();
  }
  getIndex() {
    return this.current_index;
  }
  setIndex(ix:number) {
    this.current_index = ix;
  }
  setDir(dir:string) {
    this.direction = dir;
  }
  setViewCount(count:number) {
    this.VIEW_COUNT = count;
  }
  reset() {
    this.clearFlag();

    if(this.direction=='right') {
      this.setIndex(0);
    } else if(this.direction=='left') {
      this.setIndex(this.VIEW_COUNT-1);
    } else {
      this.setIndex(0);
    }
    console.log("CLEAR COMPLETE2");
  }
  activate() {
    if(this.direction=='right') {
      this.current_index++;
    } else if(this.direction=='left') {
      this.current_index--;
    }
    this._checkLinefeed();
    console.log("index:",this.current_index,"flag:",this.flag);
  }
  private setFlag() {
    this.flag = true; 
  }
  private clearFlag() {
    this.flag = false;
  }
  private _checkLinefeed() {
    if(this.current_index >= this.VIEW_COUNT || this.current_index <0) {
        this.setFlag();
    }
  }
}