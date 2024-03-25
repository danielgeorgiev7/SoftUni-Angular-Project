import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-small-modal',
  templateUrl: './small-modal.component.html',
  styleUrls: ['./small-modal.component.css'],
})
export class SmallModalComponent {
  @Input('modalStyle') modalStyle: string = '';
  @Input('title') title: string = '';
  @Input('text') text: string = '';

  @Input('primaryBtnText') primaryBtnText: string = '';
  @Input('secondaryBtnText') secondaryBtnText: string = '';

  @Input('primaryBtnClasses') primaryBtnClasses: string = '';
  @Input('secondaryBtnClasses') secondaryBtnClasses: string = '';

  @Input('primaryBtnClick') primaryBtnClick: VoidFunction | null = null;
  @Input('secondaryBtnClick') secondaryBtnClick: VoidFunction | null = null;
  @Input('closeBtnClick') closeBtnClick: VoidFunction | null = null;
}
