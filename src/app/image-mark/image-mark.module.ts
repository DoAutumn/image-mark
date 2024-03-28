import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ImageMarkComponent } from './image-mark.component';

import { LockOutline, UnlockOutline, UnorderedListOutline } from '@ant-design/icons-angular/icons';



@NgModule({
  declarations: [
    ImageMarkComponent,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    FormsModule,
    NzIconModule.forRoot([LockOutline, UnlockOutline, UnorderedListOutline]),
    NzInputModule
  ],
  exports: [
    ImageMarkComponent
  ]
})
export class ImageMarkModule { }
