import { Component, OnInit, Input, EventEmitter,ChangeDetectorRef,ViewContainerRef, TemplateRef, ViewChild, ContentChild } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.css'],
  inputs:['data'],
  outputs:['closeTemplate']
})
export class ImageEditComponent implements OnInit {
  
  private data;
  @Input() path:String;
  @ContentChild(TemplateRef) tml:TemplateRef<any>;
  closeTemplate = new EventEmitter();

  transfer_items = ['path','angle','resample','translat'];  
  constructor(private http:HttpClient,
              private view:ViewContainerRef,
              private cdrf:ChangeDetectorRef
              ) { }

  ngOnInit() { 
    const size = this.data.length;
    const intv = Observable.interval(3000);
    const observer=(x)=>console.log(x);
    const slide = Observable.from(this.data);
    const slider = slide.map((x)=>x[0]).subscribe(observer);
    intv.subscribe((i)=>{
      // console.log(this.data[i][0]);
      this.path = this.data[i % size][0];
    }); 
   }

  onCloseTemplate() {
    this.closeTemplate.emit();
  }
  log(data) {
    console.log(data);
  }

  do_send(myform) {
    
    let send_data_form ={}
    send_data_form["path"] = this.path;

    // let send_data_form1 = {
    //       'path':this.path,
    //       'angle':'',
    //       'resample':'',
    //       'translate':''}

    myform._directives.forEach(e=>{
      send_data_form[e.name]=e.value;
    });
    let context = {form:send_data_form, items:this.transfer_items}
    this.view.createEmbeddedView(this.tml, context);

    // console.log(send_data_form);
    // let headers = new HttpHeaders();
    // headers.append('Content-Type', 'application/json');
    // // headers.append('Content-type', 'application/x-www-form-urlencoded');
    // this.http.post('http://localhost:5000/edit_image',send_data_form).subscribe(rst=>{
    //   this.path = rst['data'];
    //   this.cdrf.markForCheck();
    // });
  }
}
