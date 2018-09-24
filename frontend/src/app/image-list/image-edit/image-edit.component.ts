import { Component, OnInit, Input } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html',
  styleUrls: ['./image-edit.component.css'],
  // inputs:['path']
})
export class ImageEditComponent implements OnInit {
  
  @Input() path:String;
  
  constructor(private http:HttpClient,
              ) { }

  ngOnInit() {
  }
  log(data) {
    console.log(data);
  }

  do_send(myform) {

    let send_data_form = {
          'path':this.path,
          'angle':'',
          'resample':'',
          'translate':''}

    myform._directives.forEach(e=>{
      send_data_form[e.name]=e.value;
    });
    console.log(send_data_form);
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    // headers.append('Content-type', 'application/x-www-form-urlencoded');
    this.http.post('http://localhost:5000/edit_image',send_data_form).subscribe(rst=>{
      this.path = rst['data'];
    });
  }
}
