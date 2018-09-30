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
import { DisplayDirective } from './image-list/display.directive';
import { ImageEditComponent } from './image-list/image-edit/image-edit.component';
import { FormsModule } from '@angular/forms';
import { TestDirective } from './image-list/image-edit/test.directive';

@NgModule({
  declarations: [
    AppComponent,
    AlbumListComponent,
    ImageListComponent,
    DisplayDirective,
    ImageEditComponent,
    TestDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
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
