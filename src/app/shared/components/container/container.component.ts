import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IContainer } from './base-container';
import { MessageHostDirective  } from '../../directives/message-host.directive' 
import { Subject } from 'rxjs';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit, AfterViewInit, OnDestroy, IContainer {

  @ViewChild('outerContainer') container!: ElementRef<HTMLDivElement>;
  @ViewChild(MessageHostDirective) contentHost!: MessageHostDirective;
  @ViewChild('widgetActions') actionButtons!: ElementRef<HTMLDivElement>;
  private subject: Subject<'CLOSE' | 'EXPAND' | 'MINIMIZE'> = new Subject<'CLOSE' | 'EXPAND' | 'MINIMIZE'>();
  private _width!: number;
  private _height!: number;
  private _top!: number;
  private _left!: number;
  private _comp!: any;

  set width(value: number) {
    this._width = value;
    if (this.container) {
      this.container.nativeElement.style.width = `${this._width - 2}px`;
      this.setWidgetButtons();
    }
  }
  
  set height(value: number) {
    this._height = value;
    if (this.container) {
      this.container.nativeElement.style.height = `${this._height}px`;
      this.container.nativeElement.style.maxHeight = `${this._height}px`;
      this.setWidgetButtons();
    }
  }

  set top(value: number) {
    this._top = value;
    if (this.container) {
      this.container.nativeElement.style.top = `${this._top}px`;
      this.setWidgetButtons();
    }
  }

  set left(value: number) {
    this._left = value;
    if (this.container) {
      this.container.nativeElement.style.left = `${this._left + 2}px`; // +1 for margin, XXX: get param directly from top level
      this.setWidgetButtons();
    }
  }

  set compType(value: any) {
    this._comp = value;
  }

  get observable() {
    return this.subject.asObservable();
  }

  constructor(private resolver: ComponentFactoryResolver, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit() {
    const compFactory = this.resolver.resolveComponentFactory(this._comp);
    const viewContainerRef = this.contentHost.viewContainerRef;
    viewContainerRef.createComponent(compFactory);
    this.container.nativeElement.style.position = 'absolute';
    this.container.nativeElement.style.height = `${this._height - 17}px`;
    this.container.nativeElement.style.width = `${this._width}px`;
    this.container.nativeElement.style.top = `${this._top}px`;
    this.container.nativeElement.style.left = `${this._left + 2}px`;
    this.setWidgetButtons();
    this.cd.detectChanges();
  }

  ngOnDestroy() {

  }

  setWidgetButtons() {
    this.actionButtons.nativeElement.style.position = 'fixed';
    this.actionButtons.nativeElement.style.top = `${this._top - 14}px`;
    this.actionButtons.nativeElement.style.left = `${this._left + 5}px`;
  }

  closeContainer() {
    this.subject.next('CLOSE');
  }
  
  expandContainer() {
    this.subject.next('EXPAND');
  }
  
  minimizeContainer() {
    this.subject.next('MINIMIZE');
  }

}
