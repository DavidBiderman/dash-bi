import { animate, keyframes, sequence, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('hidden', style({
        opacity: 0
      })),
      state('show', style({
        opacity: 1
      })),
      transition('hidden => show', [
        sequence([
          animate('0.2s .1s ease-in', keyframes([
            style({top: -550}),
            style({top: -300}),
            style({top: -50}),
            style({top: 0}),
            style({top: 25}),
            style({top: 50}),
          ]))
        ]),
      ])
    ]),
    trigger('dropDown', [
      state('hidden', style({
        top: -700
      })),
      state('show', style({
        top: 'center'
      })),
      transition('hidden => show', [
        sequence([
          animate('0.2s .1s ease-in', keyframes([
            style({top: -550}),
            style({top: -300}),
            style({top: -50}),
            style({top: 0}),
            style({top: 25}),
            style({top: 50}),
          ]))
        ]),
      ])
    ])
  ]
})
export class ModalComponent implements OnInit, AfterViewInit {

  private subject: Subject<boolean> = new Subject<boolean>();
  public show: boolean = false;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.show = true;
    this.cd.detectChanges();
  }

  confirm = () => {
    this.show = false;
    this.subject.next(true);
  }

  cancel = () => {
    this.show = false;
    this.subject.next(false);
  }

  get observable(): Observable<boolean> {
    return this.subject.asObservable();
  }

}
