import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class StatusinfoService {
  album_name: string;
  slideList:JSON;


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

}
