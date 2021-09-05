class ChatEngine {
  constructor(chatBoxId, userEmail) {
    this.chatBox = $(`#${chatBoxId}`);
    this.userEmail = userEmail;

    this.socket = io.connect("http://localhost:5000");

    if (this.userEmail) {
      this.connectionHandler();
    }
  }

  connectionHandler() {
    self = this;
    console.log(self.userEmail);
    this.socket.on("connect", function () {
      console.log("connection established using sockets...!");

      self.socket.emit("join_room", {
        user_email: self.userEmail,
        chatroom: "some room",
      });

      self.socket.on("user_joined", function (data) {
        console.log("a user joined: ", data);
      });

      $("#send-message").on("click", function () {
        let msg = $("#chat-message-input").val();
        if (msg != "") {
          self.socket.emit("send_message", {
            user_email: self.userEmail,
            message: msg,
            chatroom: "some room",
          });
        }
      });
    });

    self.socket.on("receive_message", function (data) {
      console.log("received message: ", data.message);

      let newMesaage = $("<li>");
      let messageType = "other-message";
      if (data.user_email == self.userEmail) {
        messageType = "self-message";
      }
      newMesaage.append(
        $("<span>", {
          html: data.message,
        })
      );
      newMesaage.append(
        $("<sub>", {
          html: data.user_email,
        })
      );
      newMesaage.addClass(messageType);
      $("#chat-messages-list").append(newMesaage);
    });
  }
}
