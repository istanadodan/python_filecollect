import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../environments/environment.prod';
import { Router } from '@angular/router'
import {StatusinfoService,EventShareService } from './statusinfo.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = '앨범';
  @ViewChild('btn_slide') slide_btn:ElementRef;
  constructor(@Inject(DOCUMENT) private document,
              private router:Router,
              private share:EventShareService,
              public info: StatusinfoService){}

  ngOnInit(){
    // let tags = this.document.getElementsByTagName('base');
    // if (tags.length > 0) {
    //   tags[0].setAttribute('href',environment.baseHref);
    //   console.log("href changed to ",environment.baseHref);
    // }
    //this.router.navigateByUrl('/home');
    this.share.changeEmitted$.subscribe(()=>this.enableSlideBtn());
  }
  enableSlideBtn(){
    this.slide_btn.nativeElement.disabled = false;
    console.log("slide button enabled");
  }
}
