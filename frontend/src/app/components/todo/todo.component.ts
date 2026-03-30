import { Component, OnInit } from "@angular/core";
import { TodoService } from "src/services/todo.service";
import { TodoItem } from "src/interfaces/todo-item";

@Component({
  selector: "app-todo",
  templateUrl: "./todo.component.html",
  styleUrls: ["./todo.component.scss"]
})
export class TodoItemComponent implements OnInit {
  newTodo: TodoItem;
  todos: TodoItem[];

  constructor(private todoService: TodoService) {
    this.newTodo = {
      id: null,
      title: "",
      description: "",
      completed: false,
      created_at: null,
      updated_at: null
    };
    this.todos = [];
  }

  isUpdating = false;
  updatingItemIndex = -1;
  currentDate = new Date();

  ngOnInit(): void {
    this.refreshTodoList();
  }

  onSubmit(event) {
    event.preventDefault();
    if (this.isUpdating) {
      this.updateTodo();
    } else {
      this.addTodo();
    }
  }

  clear() {
    this.newTodo = {
      id: null,
      title: "",
      description: "",
      completed: false,
      created_at: null,
      updated_at: null
    };
    this.isUpdating = false;
    this.updatingItemIndex = -1;
  }

  addTodo() {
    this.todoService.add(this.newTodo).subscribe(
      data => {
        this.refreshTodoList();
      },
      error => {
        console.log("Error :", error);
      }
    );
    this.clear();
  }

  deleteTodo(todo: TodoItem) {
    console.log(todo);
    this.todoService.delete(todo.id.toString()).subscribe(
      data => {
        this.refreshTodoList();
      },
      error => {
        console.log("Error :", error);
      }
    );
  }

  updateTodo() {
    this.todoService.update(this.newTodo).subscribe(
      data => {
        this.refreshTodoList();
      },
      error => {
        console.log("Error :", error);
      }
    );
    this.clear();
  }

  editTodo(todo: TodoItem, index: number) {
    this.refreshTodoList();
    this.updatingItemIndex = index;
    this.newTodo = todo;
    this.isUpdating = true;
  }

  refreshTodoList() {
    this.todoService.get().subscribe(
      data => {
        this.todos = data;
      },
      error => {
        console.log("Error :", error);
      }
    );
  }
}
