import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ImageListComponent } from './image-list/image-list.component';
import { AlbumListComponent } from './album-list/album-list.component';
import { StatusinfoService, EventShareService, SlideDirectionControl} from './statusinfo.service';
import { DisplayDirective } from './image-list/display.directive';
import { ImageEditComponent } from './image-list/image-edit/image-edit.component';
import { FormsModule } from '@angular/forms';
import { TestDirective } from './image-list/image-edit/test.directive';
import { AlbumHomeComponent } from './album-home/album-home.component';
import { SlideComponent } from './slide/slide.component';
import { SlideThumbnailListComponent } from './slide/slide-thumbnail-list/slide-thumbnail-list.component';

@NgModule({
  declarations: [
    AppComponent,
    AlbumListComponent,
    ImageListComponent,
    DisplayDirective,
    ImageEditComponent,
    TestDirective,
    AlbumHomeComponent,
    SlideComponent,
    SlideThumbnailListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([{
      path:"albumlist",
      component:AlbumListComponent},{
      path:'imagelist',
      component:ImageListComponent},{
      path:'home',
      component:AlbumHomeComponent},{
      path:'slide',
      component:SlideComponent
      }] 
    )
  ], 
  providers: [
    {provide:APP_BASE_HREF, useValue:environment.baseHref},
    StatusinfoService,
    EventShareService,
    SlideDirectionControl
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
