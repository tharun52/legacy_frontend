import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TodoItemComponent } from "./todo.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("TodoItemComponent", () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TodoItemComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
