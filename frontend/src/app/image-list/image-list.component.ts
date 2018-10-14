import { Component, OnInit,HostBinding } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { StatusinfoService } from '../statusinfo.service'

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css'],
  // host:{'background-color':'black'}  
})
export class ImageListComponent implements OnInit {
  serverData:JSON;
  comment:string;
  selected_img_path:string;
  imgSize:number=240;
  isChecked:boolean = false;

  @HostBinding('style.background-color') public color: string = 'black';
  constructor(private http:HttpClient, 
              private status: StatusinfoService
              ) { }

  ngOnInit() {
    this.http.get('http://localhost:5000/api/imagelist/'+this.status.album_name).subscribe(data=>{
      this.serverData = data as JSON;
      // console.log("raw data : " + data);
    });
  }

  ret(e:string) {
      this.comment = e;
  }
  
  load_edit_window(url:string) {
    this.selected_img_path = url
  }

}
