import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ImageListComponent } from './image-list/image-list.component';
import { AlbumListComponent } from './album-list/album-list.component';
import { StatusinfoService} from './statusinfo.service';

@NgModule({
  declarations: [
    AppComponent,
    AlbumListComponent,
    ImageListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([{
      path:"albumlist",
      component:AlbumListComponent},{
      path:'imagelist',
      component:ImageListComponent  
      }] 
    )
  ], 
  providers: [
    {provide:APP_BASE_HREF, useValue:environment.baseHref},
    StatusinfoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
