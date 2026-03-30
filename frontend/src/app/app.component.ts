import { Component } from "@angular/core";
import { NotificationService } from "src/services/notification.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "frontend";

  constructor(
    private notificationService: NotificationService,
    private toastrService: ToastrService
  ) {
    notificationService.message.subscribe(res => {
      this.toastrService.success(res.content.description, res.content.title);
    });
  }

  // To chack web-socket connection to server
  socketEventToServer() {
    this.notificationService.message.next({
      type: "events.pingtodoserver",
      content: {
        id: 999,
        title: "Check connection",
        description: "Ping to todo server via websocket",
        completed: true,
        created_at: null,
        updated_at: null
      }
    });
  }
}
