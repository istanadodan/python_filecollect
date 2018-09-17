import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { StatusinfoService } from '../statusinfo.service'

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {

  serverData: JSON;
  constructor(private http: HttpClient, 
              private status: StatusinfoService, 
              private router:Router){}

  getImageList(name: string) {
    this.status.album_name = name;
    this.router.navigateByUrl('/imagelist');
  }
  ngOnInit(){   
    this.http.get('http://localhost:5000/api/albumlist').subscribe(data=>{
       this.serverData = data as JSON;
     });
    }
}
