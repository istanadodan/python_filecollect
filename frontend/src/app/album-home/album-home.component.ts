import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';

import { StatusinfoService,EventShareService } from '../statusinfo.service'

@Component({
  selector: 'app-album-list',
  templateUrl: './album-home.component.html',
  styleUrls: ['./album-home.component.css'],
})
export class AlbumHomeComponent implements OnInit {

  serverData: JSON;
  album_name:string;
  private start_img = environment.viewStartAlbum;
  constructor(private http: HttpClient, 
              private share:EventShareService,
              private status: StatusinfoService, 
              private router:Router){}

  setAlbumName(name: string) {
    this.status.album_name = name;
    this.album_name = name;
    this.share.emitChange('click');
  }
  ngOnInit(){
    this.http.get('http://localhost:5000/api/albumlist').subscribe(data=>{
       this.serverData = data as JSON;
       this.setAlbumName(this.start_img)
     });
    }
}
