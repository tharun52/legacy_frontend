import { TestBed } from "@angular/core/testing";

import { WebsocketService } from "./websocket.service";
import { Subject } from "rxjs/Rx";
import { ToDoEvent } from "src/interfaces/todo-item";
import { environment } from "src/environments/environment.prod";

describe("WebsocketService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({ providers: [WebsocketService] })
  );

  it("should be created", () => {
    const websocketService: WebsocketService = TestBed.get(WebsocketService);
    expect(websocketService).toBeTruthy();
  });

  it("should be connect to webSocket server ", () => {
    const websocketService: WebsocketService = TestBed.get(WebsocketService);
    let message = <Subject<ToDoEvent>>(
      websocketService.connect(environment.WEB_SOCKET_SERVER).map(
        (response: MessageEvent): ToDoEvent => {
          console.log(response);
          let data = JSON.parse(response.data);
          return data;
        }
      )
    );

    message.subscribe(res => expect(res.content.title).toMatch("CONNECTED"));
  });
});
