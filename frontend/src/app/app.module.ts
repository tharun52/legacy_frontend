import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { TodoItemComponent } from "./components/todo/todo.component";
import { ToastrModule } from "ngx-toastr";
import { NotificationService } from "src/services/notification.service";
import { WebsocketService } from "src/services/websocket.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TodoService } from "src/services/todo.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@NgModule({
  declarations: [AppComponent, TodoItemComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    FontAwesomeModule
  ],
  providers: [
    WebsocketService,
    NotificationService,
    TodoService,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
