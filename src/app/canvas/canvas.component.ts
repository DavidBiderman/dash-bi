import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, ElementRef, HostListener, Injector, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Rectangle } from './canvas-models/rectangle.model';
import { ContainerComponent } from '../shared/components/container/container.component';
import { MessageHostDirective } from '../shared/directives/message-host.directive';
import { isColliding } from './utils/canvas-utils';
import { TableComponent } from '../shared/components/table/table.component';
import { ModalComponent } from '../shared/components/modal/modal.component';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit {

  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  @ViewChild('mainCanvas', {static: false}) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('addWidgetPopup', {static: false}) popup!: ModalComponent;
  @ViewChildren(MessageHostDirective) widgetContainers!: QueryList<MessageHostDirective>;
  public widgets: Array<any> = [];
  public showModal!: boolean;
  private ctx!: CanvasRenderingContext2D;
  private components: Array<ComponentRef<ContainerComponent>> = [];
  private rectangles: Array<Rectangle> = [];
  private objectActive: boolean = false;
  private activeObject!: Rectangle | undefined;
  private precisionThreshold: number = 35; // in px
  private dragTL!: boolean;
  private dragTR!: boolean;
  private dragBL!: boolean; 
  private dragBR!: boolean;
  private isResizing!: boolean;
  private original!: Rectangle;
  private distanceFromCorner: Array<number> = [-1, -1];

  constructor(private resolver: ComponentFactoryResolver, private cd: ChangeDetectorRef, private injector: Injector) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.canvas.nativeElement.width = this.container.nativeElement.clientWidth;
    this.canvas.nativeElement.height = this.container.nativeElement.clientHeight;
    if (this.canvas.nativeElement.getContext) {
      this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
      this.responsiveDraw();
    } else {
      alert('Canvas unsupported in browser');
    }
  }

  resize = () => {
    this.canvas.nativeElement.width = this.container.nativeElement.clientWidth;
    this.canvas.nativeElement.height = this.container.nativeElement.clientHeight;
    this.clearScreen();
    this.redraw();
  }

  clearScreen = () => {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  responsiveDraw = () => {
    this.canvas.nativeElement.addEventListener('mousemove', (event) => this.movementHandler(event));
    this.canvas.nativeElement.addEventListener('mousedown', (event) => this.mousedownHandler(event));
    this.canvas.nativeElement.addEventListener('mouseup', () => this.mouseupHandler());
  }

  addWidget = ($event: any): void => {
    // XXX '#2f313a' -> use this color for dark theme (approixmation... Find a more suitable color after...)
    const newRect = new Rectangle($event.offsetX + 250, $event.offsetY + 150, '#FFF', 500, 250);
    this.rectangles.push(newRect);
    this.redraw();
    this.createWidget(newRect);
  }

  mousedownHandler = (event: any): void => {
    this.rectangles.forEach(rect => rect.setActive(false));
    // check if coords overlap any one of the rects that we already created.
    const rectangle = this.rectangles.find((rectangle) => this.isInFocus(rectangle, event.offsetX, event.offsetY));
    if (rectangle) {
      this.original = {...rectangle};
      this.activeObject = rectangle;
      rectangle.isDragging = true;
      if (this.setResize(rectangle, event.offsetX, event.offsetY)) {
        this.isResizing = true;
        this.rectangles.forEach((rectangle) => rectangle.draw(this.ctx));
        this.activeObject.setActive(true);
        this.objectActive = true;
      } else { 
        // const svg = htmlToSvg(widget);
        const image = '/assets/images/drag-images/table-placeholder.png';
        this.canvas.nativeElement.classList.add('dragging');
        this.objectActive = true;
        this.distanceFromCorner[0] = event.offsetX - rectangle.x;
        this.distanceFromCorner[1] = event.offsetY - rectangle.y;
        rectangle.setImg(image);
        this.hideWidget((rectangle as Rectangle));
        rectangle.draw(this.ctx);
      }
    } else {
      this.objectActive = false;
    }
  }

  movementHandler = (event: any): void => {
    // We need to check if this is movement of resize
    const existingRectangle = this.activeObject || this.rectangles.find((rectangle) => this.isInFocus(rectangle, event.offsetX, event.offsetY));
    if (existingRectangle) {
      if (this.checkIfCornerDragging(existingRectangle, event.offsetX, event.offsetY)) {
        this.canvas.nativeElement.classList.remove('drag');
        this.canvas.nativeElement.classList.add('resize');
      } else {
        this.canvas.nativeElement.classList.remove('resize');
        this.canvas.nativeElement.classList.add('drag');
      }
      if (this.objectActive) {
        if (this.isResizing) { // we are dragging a corner
          this.clearScreen();
          this.resizeDraw(existingRectangle as Rectangle, event);
          this.redraw();
        } else {
          this.clearScreen();
          (existingRectangle as Rectangle).x = event.offsetX - this.distanceFromCorner[0];
          (existingRectangle as Rectangle).y = event.offsetY - this.distanceFromCorner[1];
          this.redraw();
        }
        this.setWidgetState((existingRectangle as Rectangle));
      }
      // this.positionWidget((existingRectangle as Rectangle));
    } else {
      this.rectangles.forEach(rect => rect.setActive(false));
      this.canvas.nativeElement.classList.remove('resize');
      this.canvas.nativeElement.classList.remove('drag');
    }
  }

  mouseupHandler = (): void => {
    this.dragTL = this.dragTR = this.dragBL = this.dragBR = this.isResizing = this.objectActive = false;
    let existingRectangle = this.activeObject || this.rectangles[this.rectangles.length - 1];
    if (existingRectangle) {
      if (this.checkCollisions(existingRectangle)) {
        this.restoreRect(existingRectangle);
      }
      this.objectActive = false;
      this.distanceFromCorner[0] = -1;
      this.distanceFromCorner[1] = -1;
      this.canvas.nativeElement.classList.remove('dragging');
      delete this.activeObject;
      existingRectangle.removeImg();
      existingRectangle.isDragging = false;
      this.clearScreen()
      this.redraw();
      this.showWidget(existingRectangle);
      this.positionWidget(existingRectangle);
    }
  }

  redraw = (): void => {
    this.rectangles.forEach(rect => rect.draw(this.ctx));
  }

  private setWidgetState = (rect: Rectangle) => {
    if (this.checkCollisions(rect)) {
      rect.isValid = false;
      rect.draw(this.ctx);
    } else {
      rect.isValid = true;
      rect.draw(this.ctx);
    }
  }

  private isInFocus = (rect: Rectangle, x: number, y: number): boolean => {
    return (
      (rect.x <= x && x <= rect.x + rect.width) && (rect.y <= y && y <= rect.y + rect.height)
    );
  }

  private setResize = (rect: Rectangle, x: number, y: number): boolean => {
    let resizing = false;
    if (this.checkCornerProximityThreshold(x, rect.x) && this.checkCornerProximityThreshold(y, rect.y)) {
      this.dragTL = resizing = true;
    } else if (this.checkCornerProximityThreshold(x, rect.x + rect.width) && this.checkCornerProximityThreshold(y, rect.y)) {
      this.dragTR = resizing = true;
    } else if (this.checkCornerProximityThreshold(x, rect.x) && this.checkCornerProximityThreshold(y, rect.y + rect.height)) {
      this.dragBL = resizing = true;
    } else if (this.checkCornerProximityThreshold(x, rect.x + rect.width) && this.checkCornerProximityThreshold(y, rect.y + rect.height)) {
      this.dragBR = resizing = true;
    }
    return resizing;
  }

  private checkCollisions = (collider: Rectangle): boolean => {
    return this.rectangles.filter(rect => rect !== collider).some((rectangle) => isColliding(collider as Rectangle, rectangle));
  }

  private checkCornerProximityThreshold = (coord1: number, coord2: number): boolean => {
    return Math.abs(coord1 - coord2) <= this.precisionThreshold;
  }

  private checkIfCornerDragging = (rect: Rectangle, x: number, y: number): boolean => {
    return (
      (this.checkCornerProximityThreshold(x, rect.x) && this.checkCornerProximityThreshold(y, rect.y)) ||
      (this.checkCornerProximityThreshold(x, rect.x + rect.width) && this.checkCornerProximityThreshold(y, rect.y)) ||
      (this.checkCornerProximityThreshold(x, rect.x) && this.checkCornerProximityThreshold(y, rect.y + rect.height)) ||
      (this.checkCornerProximityThreshold(x, rect.x + rect.width) && this.checkCornerProximityThreshold(y, rect.y + rect.height))
    );
  }

  private resizeDraw = (rect: Rectangle, event: any): void => {
    if (this.dragTL) {
      rect.width += rect.x - event.offsetX;
      rect.height += rect.y - event.offsetY;
      rect.x = event.offsetX;
      rect.y = event.offsetY;
    } else if (this.dragTR) {
      rect.width += event.offsetX - (rect.x + rect.width);
      rect.height += (rect.y - event.offsetY);
      rect.y = event.offsetY;
    } else if (this.dragBL) {
      rect.width += rect.x - event.offsetX;
      rect.height = (event.offsetY - rect.y);
      rect.x = event.offsetX;
    } else if (this.dragBR) {
      rect.width += event.offsetX - (rect.x + rect.width);
      rect.height = (event.offsetY - rect.y);
    }
    this.positionWidget(rect);
  }

  private restoreRect = (current: Rectangle): void => {
    current.x = this.original.x;
    current.y = this.original.y;
    current.color = this.original.color;
    current.width = this.original.width; 
    current.height = this.original.height;
    current.isValid = true;
    this.positionWidget(current);
  }

  openCreateWidgetDialog = ($event: any) => {
    this.showModal = true;
    this.cd.detectChanges();

    const sub = this.popup.observable.subscribe((confirm: boolean) => {
      if (confirm) {
        this.addWidget($event);
      }
      sub.unsubscribe();
      this.showModal = false;
    })
  }

  createWidget = (rect: Rectangle): void => {
    // First create our component factory with the resolver
    const compFactory = this.resolver.resolveComponentFactory(ContainerComponent);

    // Push to array so that we render the tag
    const compElement = compFactory.create(this.injector);
    this.widgets.push(compElement);
    this.cd.detectChanges();

    // Time to create the component itself.
    const viewContainerRef = this.widgetContainers.last.viewContainerRef;
    if (viewContainerRef) {
      const component = viewContainerRef.createComponent(compFactory);
      component.instance.height = rect.height - 16;
      component.instance.width = rect.width;
      component.instance.left = rect.x + this.canvas.nativeElement.offsetLeft;
      component.instance.top = rect.y + this.canvas.nativeElement.offsetTop + 17;
      component.instance.compType = TableComponent; // XXX: Take out to dynamic function and add pop up to allow selection
      this.components.push(component)
      const sub = component.instance.observable.subscribe((action: string) => {
        if (action === "CLOSE") {
          sub.unsubscribe();
          this.rectangles.splice(this.components.findIndex((comp) => comp === component), 1);
          this.components.splice(this.components.findIndex((comp) => comp === component), 1);
          viewContainerRef.clear();
          this.clearScreen();
        } else if (action === "MINIMIZE") {
          console.log('minimizing widget');
        } else if (action === "EXPAND") {
          console.log('expanding widget');
        }
        this.redraw();
      })
    }
  }

  private positionWidget = (rect: Rectangle) => {
    const widget: ComponentRef<ContainerComponent> = this.components[this.rectangles.findIndex(curr => curr === rect)];
    if (widget) {
      widget.instance.height = rect.height - 33;
      widget.instance.width = rect.width;
      widget.instance.left = rect.x + this.canvas.nativeElement.offsetLeft;
      widget.instance.top = rect.y + this.canvas.nativeElement.offsetTop + 17;
    }
  }

  private hideWidget = (rect: Rectangle) => {
    const widget: ComponentRef<ContainerComponent> = this.components[this.rectangles.findIndex(curr => curr === rect)];
    if (widget) {
      widget.instance.hide();
    }
  }

  private showWidget = (rect:Rectangle) => {
    const widget: ComponentRef<ContainerComponent> = this.components[this.rectangles.findIndex(curr => curr === rect)];
    if (widget) {
      widget.instance.show();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize = (event: any) => {
    this.resize();
  }

}

