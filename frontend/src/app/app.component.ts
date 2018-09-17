import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../environments/environment.prod';
import { Router } from '@angular/router'
import {StatusinfoService } from './statusinfo.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = '앨범';
  
  constructor(@Inject(DOCUMENT) private document,
              private router:Router,
              public info: StatusinfoService){}

  ngOnInit(){
    let tags = this.document.getElementsByTagName('base');
    if (tags.length > 0) {
      tags[0].setAttribute('href',environment.baseHref);
      console.log("href changed to ",environment.baseHref);
    }
    this.router.navigateByUrl('/albumlist');
  }
}
