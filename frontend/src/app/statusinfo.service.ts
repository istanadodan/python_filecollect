import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class StatusinfoService {
  album_name: string;
  constructor(private router: Router) { }

  navigate(url) {
    this.album_name="";
    switch (url) {
      case 'home':
        this.router.navigateByUrl('/albumlist');
        console.log('home navigate');
        break;
    }
    
  }

}
