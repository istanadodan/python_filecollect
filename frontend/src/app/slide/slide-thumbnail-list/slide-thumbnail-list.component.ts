import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { S_IXGRP } from 'constants';

@Component({
  selector: 'app-slide-thumbnail-list',
  templateUrl: './slide-thumbnail-list.component.html',
  styleUrls: ['./slide-thumbnail-list.component.css']
})
export class SlideThumbnailListComponent implements OnInit {

  selected_image=[];
  // @Input() ix; //선택된 이미지의 고유번호
  @Input() list; //전체이미지 데이타
  @Output() clk_ix = new EventEmitter(); //이미지클릭되면 발생되는 이벤트    
  @Input() 
   set ix(ix) {
      this.selected_image['on'] = false;
      this.selected_image = this.list[ix];
      this.selected_image['on'] = true;
    }

  constructor() { }

  ngOnInit() {
  }
  clickImage(ix:number) {
    this.setDeSelect(this.selected_image);
    this.setSelect(this.list[ix]);
    this.clk_ix.emit(ix);
    // this.selected_image.forEach(element => {
    //   console.log(element);
    // });
  }
  setDeSelect(target) {
    target['on'] = false;
  }
  setSelect(target) {
    target['on'] = true;
    this.selected_image = target;
  }
}
