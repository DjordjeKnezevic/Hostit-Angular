import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { SelectComponent } from './select/select.component';
import { TextInputComponent } from './text-input/text-input.component';

@NgModule({
  declarations: [SelectComponent, TextInputComponent],
  imports: [
    CommonModule,
    AngularFormsModule
  ],
  exports: [SelectComponent, TextInputComponent]
})
export class FormsModule { }
