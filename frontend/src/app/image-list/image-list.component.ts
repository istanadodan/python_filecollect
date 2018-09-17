import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { StatusinfoService } from '../statusinfo.service'

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css']
})
export class ImageListComponent implements OnInit {
  serverData:JSON;
  constructor(private http:HttpClient, 
              private status: StatusinfoService,
              public router: Router) { }
  navigate(url) {
    this.status.album_name = "";
    this.router.navigateByUrl(url);
  }
  ngOnInit() {
    this.http.get('http://localhost:5000/api/imagelist/'+this.status.album_name).subscribe(data=>{
      this.serverData = data as JSON;
     //  console.log(data);
    });
  }

}
