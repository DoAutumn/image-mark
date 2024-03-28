import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { getClientSize, getFitContentPosition, getOffset } from 'ng-zorro-antd/image';
import { isNotNil } from 'ng-zorro-antd/core/util';

export type NzImageContainerOperation = {
  icon: string;
  type: string;
  onClick(): void;
}

/**
 * 框选的矩形信息
 */
export type Rect = {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  relativeX: number;
  relativeY: number;
  mouseover?: boolean;
}

const initialPosition = {
  x: 0,
  y: 0
};

@Component({
  selector: 'app-image-mark',
  templateUrl: './image-mark.component.html',
  styleUrls: ['./image-mark.component.less']
})
export class ImageMarkComponent {

  images: any = [
    { src: 'https://img11.iqilu.com/1/2020/09/15/0a2ad07095cc2950d6c0146ec74c3d8c.jpg' },
    { src: 'https://pic1.zhimg.com/v2-06e85d62b17a4979c6e9201079e00030_r.jpg' },
    { src: 'https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2024%2F0325%2F99209218j00savru400a1d000p000anp.jpg&thumbnail=660x2147483647&quality=80&type=jpg' },
  ];
  index = 0;
  isDragDisabled = false;

  previewImageTransform = '';
  operations: NzImageContainerOperation[] = [
    {
      icon: 'zoom-in',
      onClick: () => {
        this.onZoomIn();
      },
      type: 'zoomIn'
    },
    {
      icon: 'zoom-out',
      onClick: () => {
        this.onZoomOut();
      },
      type: 'zoomOut'
    },
    {
      icon: 'rotate-right',
      onClick: () => {
        this.onRotateRight();
      },
      type: 'rotateRight'
    },
    {
      icon: 'rotate-left',
      onClick: () => {
        this.onRotateLeft();
      },
      type: 'rotateLeft'
    },
    {
      icon: 'unordered-list',
      onClick: () => {
        this.rectBoxVisible = true;
      },
      type: 'unorderedList'
    }
  ];

  zoomOutDisabled = false;
  position = { ...initialPosition };

  @ViewChild('imgRef') imageRef!: ElementRef<HTMLImageElement>;

  private zoom: number;
  private rotate: number;

  constructor() {
    this.zoom = 1;
    this.rotate = 0;
    this.updateZoomOutDisabled();
    this.updatePreviewImageTransform();
  }

  next(): void {
    if (this.index < this.images.length - 1) {
      this.reset();
      this.index++;
      this.updatePreviewImageTransform();
      this.updateZoomOutDisabled();
    }
  }

  prev(): void {
    if (this.index > 0) {
      this.reset();
      this.index--;
      this.updatePreviewImageTransform();
      this.updateZoomOutDisabled();
    }
  }

  onZoomIn(): void {
    this.zoom += 1;
    this.updatePreviewImageTransform();
    this.updateZoomOutDisabled();
    this.position = { ...initialPosition };
  }

  onZoomOut(): void {
    if (this.zoom > 1) {
      this.zoom -= 1;
      this.updatePreviewImageTransform();
      this.updateZoomOutDisabled();
      this.position = { ...initialPosition };
    }
  }

  onRotateRight(): void {
    this.rotate += 90;
    this.updatePreviewImageTransform();
  }

  onRotateLeft(): void {
    this.rotate -= 90;
    this.updatePreviewImageTransform();
  }

  onSwitchLeft(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.prev();
  }

  onSwitchRight(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.next();
  }

  onDragStarted(event: MouseEvent): void {
    if (this.isDragDisabled) {
      this.mousedownInfo.isDown = true;
      this.mousedownInfo.downX = event.clientX;
      this.mousedownInfo.downY = event.clientY;
      this.imageRect = this.imageRef.nativeElement.getBoundingClientRect();
    }
  }

  onDragReleased(): void {
    const width = this.imageRef.nativeElement.offsetWidth * this.zoom;
    const height = this.imageRef.nativeElement.offsetHeight * this.zoom;
    const { left, top } = getOffset(this.imageRef.nativeElement);
    const { width: clientWidth, height: clientHeight } = getClientSize();
    const isRotate = this.rotate % 180 !== 0;
    const fitContentParams = {
      width: isRotate ? height : width,
      height: isRotate ? width : height,
      left,
      top,
      clientWidth,
      clientHeight
    };
    const fitContentPos = getFitContentPosition(fitContentParams);
    if (isNotNil(fitContentPos.x) || isNotNil(fitContentPos.y)) {
      this.position = { ...this.position, ...fitContentPos };
    }
  }

  private updatePreviewImageTransform(): void {
    this.previewImageTransform = `scale3d(${this.zoom}, ${this.zoom}, 1) rotate(${this.rotate}deg)`;
    this.rects.length = 0;
  }

  private updateZoomOutDisabled(): void {
    this.zoomOutDisabled = this.zoom <= 1;
  }

  private reset(): void {
    this.zoom = 1;
    this.rotate = 0;
    this.position = { ...initialPosition };
    this.rects.length = 0;
  }


  /** ------------------------------- 框选矩形，给图片做标记 ------------------------------- */

  rects: Rect[] = [];
  tempRect: Rect = { name: '', x: 0, y: 0, w: 0, h: 0, relativeX: 0, relativeY: 0 };
  imageRect!: DOMRect;
  mousedownInfo = { isDown: false, downX: 0, downY: 0, target: null, targetX: 0, targetY: 0 };
  rectBoxVisible = false;

  @HostListener('document:mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    if (!this.mousedownInfo.isDown) return;
    const { downX, downY } = this.mousedownInfo;
    let newX = event.clientX, newY = event.clientY;
    if (newX <= this.imageRect.x) newX = this.imageRect.x;
    if (newX >= this.imageRect.right) newX = this.imageRect.right;
    if (newY <= this.imageRect.y) newY = this.imageRect.y;
    if (newY >= this.imageRect.bottom) newY = this.imageRect.bottom;
    this.tempRect.x = newX > downX ? downX : newX;
    this.tempRect.y = newY > downY ? downY : newY;
    this.tempRect.w = Math.abs(newX - downX);
    this.tempRect.h = Math.abs(newY - downY);
  }

  @HostListener('document:mouseup', ['$event']) onMouseUp(event: MouseEvent) {
    this.mousedownInfo.isDown = false;
    if (this.tempRect.w > 0 && this.tempRect.h > 0) {
      const rect = { ...this.tempRect };
      rect.name = `标记${this.rects.length + 1}`;
      rect.relativeX = rect.x - this.imageRect.x;
      rect.relativeY = rect.y - this.imageRect.y;
      this.rects.push(rect);
      this.tempRect.w = this.tempRect.h = 0;
      this.rectBoxVisible = true;
    }
  }

}
