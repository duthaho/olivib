const numberOfChats = 10;
let fakeChats = [];
// generate an array of fake chats to show in app
for (let i = 1; i < numberOfChats; i++) {
  fakeChats.push(chatGenerator(i));
}

fetch("https://randomuser.me/api/?inc=name,picture,login")
  .then((response) => response.json())
  .then((data) => {
    // this is the signed-in user object
    const authedUser = {
      id: "34",
      name: "Duong Thanh Hop",
      username: "duthaho",
      online: true,
      lastSeen: "Today",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    };
    const randomUser = data.results[0] || {};
    Object.assign(authedUser, {
      id: randomUser.login.uuid,
      name: `${randomUser.name.first} ${randomUser.name.last}`,
      username: randomUser.login.username,
      avatar: randomUser.picture.large,
    });

    // create instance of ChatApp,
    // this is the line that run application
    const app = new ChatApp("chat-web-app");
    app.signin(authedUser);

    // add all generated chats to app one-by-one
    fakeChats.map((fc) => app.addChat(fc));

    // below code is just for simulating message receive
    // here we send 100 messages in different times ro app
    for (let i = 0; i < 100; i++) {
      const fakeSender = fakeChats[randomNumber(numberOfChats, 1)];
      if (!fakeSender) return;

      // flag with a 20% probability
      const randomFlag = Math.random() > 0.8;

      app.newMessage({
        text: getRandomText(Math.random() > 0.5),
        sender: randomFlag ? authedUser.id : fakeSender.id,
        time: new Date(),
        toChat: randomFlag ? fakeSender.id : authedUser.id,
      });
    }
  });
