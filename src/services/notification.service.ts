import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { WebsocketService } from "./websocket.service";
import { Subject } from "rxjs/Rx";
import { ToDoEvent } from "src/interfaces/todo-item";

@Injectable()
export class NotificationService {
  public message: Subject<ToDoEvent>;

  constructor(private websocketService: WebsocketService) {
    this.message = <Subject<ToDoEvent>>(
      this.websocketService.connect(environment.WEB_SOCKET_SERVER).map(
        (response: MessageEvent): ToDoEvent => {
          console.log(response);
          let data = JSON.parse(response.data);
          return data;
        }
      )
    );
  }
}
