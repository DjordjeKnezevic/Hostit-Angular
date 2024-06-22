import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent {
  @Input() options: { value: string, label: string }[] = [];
  @Input() selectedValue: string = '';
  @Input() placeholder: string = '';
  @Input() error: string | null = null;
  @Output() selectedValueChange = new EventEmitter<string>();

  onChange(value: string) {
    this.selectedValueChange.emit(value);
  }
}
