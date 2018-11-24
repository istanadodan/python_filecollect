import { Component, OnInit,HostBinding,ElementRef, TemplateRef, ViewChild, ViewContainerRef, EmbeddedViewRef, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StatusinfoService } from '../statusinfo.service'
import { TemplateAst } from '@angular/compiler';
import 'rxjs/add/observable/from';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css'],
  inputs:['data']
})
export class ImageListComponent implements OnInit {
  slideList:JSON;
  comment:string;
  selected_img_path:string;
  imgSize:number=240;
  isChecked:boolean = false;
  disp_type:string='type1';
  layout_type:string='Default';
  magnifyCheck:boolean = false;
  private _baseUrl = "http://localhost:5000/api/";

  private viewer:EmbeddedViewRef<any> = null;
  @ViewChild('test1',{read:TemplateRef}) template1:TemplateRef<any>;
  @ViewChild('test2',{read:TemplateRef}) template2:TemplateRef<any>;
  @ViewChild('imageList',{read:ViewContainerRef}) viewContainer:ViewContainerRef;
  @HostBinding('style.background-color') public color: string = 'black';

  constructor(private http:HttpClient, 
              private status: StatusinfoService,
              private element: ElementRef,
              private view:ViewContainerRef,
              ) { }
  
  ngOnInit() { }

  changeDispType() {
    console.log('표시형식 변경');
    this.http.get('http://localhost:5000/api/disp_type/'+this.status.album_name+'/'+this.disp_type).subscribe(data=>{
      this.slideList = data as JSON;
    });
  }
  changeLayoutType() {
    console.log('레이아웃 변경');
    // data형식 :
    const observer = data => {
      this.slideList = data as JSON;
      this.status.slideList = this.slideList;
      Object.keys(this.status.slideList).forEach( (el,ix) => {
        this.status.slideList[ix][2] = ix;
      } );
    }
    const url = this.getConcat("layout/",this.status.album_name, this.disp_type, this.layout_type)
    // this.http.get('http://localhost:5000/api/layout/'+this.status.album_name+'+'+this.disp_type+'+'+this.layout_type)
    this.http.get(url).subscribe(observer);
  }
  private getConcat(path,...params) {
    const delimit = "+";
    let ret = this._baseUrl.concat(path);
    params.forEach(arg=>{ //for(let arg of params)
      ret = ret.concat(arg).concat(delimit);
    });
    console.log("url결과 :",ret.substr(0, ret.length-1));
    return ret.substr(0, ret.length-1);
  }
  @Input()
  set data(name:string) {
    if( name != null) {
      this.status.album_name = name;
      if(this.layout_type=='Defalut'){
        this.changeLayoutType();
      } else {
        // this.changeDispType();
        this.changeLayoutType();
      }
    }
  }
  private zIndex:number;
  private width:string;
  private height:string;

  setOverFlow(event:MouseEvent, flag:string){
    // console.log('check'+this.magnifyCheck);
    if(!this.magnifyCheck) {
        return;
    }
    if(flag=='visible') {
      this.zIndex = event.target['style'].zIndex;
      this.width =  event.target['style'].width;
      this.height = event.target['style'].height;
      event.target['style'].zIndex = 100000;
      event.target['style'].width= Number(this.width.split('px')[0]) * 2 +'px';
      event.target['style'].height = Number(this.height.split('px')[0]) * 2 + 'px';
      // console.log(this.height);
    } else {
      event.target['style'].zIndex = this.zIndex;
      event.target['style'].width= this.width;
      event.target['style'].height = this.height;
    }
    event.target['style'].overflow = flag;
  }
  
  closeTemplate(){
    this.viewContainer.remove(0);
  }
  load_edit_window(event:MouseEvent, url:string) {
    this.selected_img_path = url;
    if(this.viewer) {
      this.viewContainer.remove(0);
      // this.viewer.destroy();
      // this.viewer = null;
    }
    this.viewer = this.viewContainer.createEmbeddedView(this.template1);
  }
  routing(url) {
    this.status.navigate(url);
  }
  getComment(msg) {
    this.comment = msg.data;
  }

}
