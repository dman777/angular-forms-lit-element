import {
  Component,
  OnInit, } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'atlas-todo-list',
  templateUrl: './atlas-todo-list.component.html',
  styleUrls: ['./atlas-todo-list.component.scss']
})

export class AtlasTodoListComponent implements OnInit {

  public todoList:ReadonlyArray<string> = []
  public todoItem = new FormControl('');

  addToList() {
    this.todoList = [ this.todoItem.value, ...this.todoList ];
    this.todoItem.reset();
  }

  constructor() { }

  ngOnInit(): void {
  }

}
