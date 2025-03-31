function chatOpen() {
  document.getElementById("chat-open").style.display = "none";
  document.getElementById("chat-close").style.display = "block";
  const chatWindow1 = document.getElementById("chat-window1");
  chatWindow1.style.display = "block";
  // Add a small delay to ensure the display: block is processed before adding the show class
  setTimeout(() => {
    chatWindow1.classList.add("show");
  }, 10);
}

function chatClose() {
  document.getElementById("chat-open").style.display = "block";
  document.getElementById("chat-close").style.display = "none";
  const chatWindow1 = document.getElementById("chat-window1");
  const chatWindow2 = document.getElementById("chat-window2");
  chatWindow1.classList.remove("show");
  chatWindow2.classList.remove("show");
  setTimeout(() => {
    chatWindow1.style.display = "none";
    chatWindow2.style.display = "none";
  }, 300); // Match this delay with the animation duration
}

function openConversation() {
  const chatWindow1 = document.getElementById("chat-window1");
  const chatWindow2 = document.getElementById("chat-window2");
  chatWindow2.style.display = "block";
  chatWindow1.classList.remove("show");
  setTimeout(() => {
    chatWindow2.classList.add("show");
    chatWindow1.style.display = "none";
  }, 10);
}

//Gets the text from the input box(user)
function userResponse() {
  let userText = document.getElementById("textInput").value;

  if (userText == "") {
    alert("Please type something!");
  } else {
    document.getElementById("messageBox").innerHTML += `<div class="first-chat">
      <p>${userText}</p>
      <div class="arrow"></div>
    </div>`;
    // Remove audio play

    document.getElementById("textInput").value = "";
    var objDiv = document.getElementById("messageBox");
    objDiv.scrollTop = objDiv.scrollHeight;

    setTimeout(() => {
      adminResponse();
    }, 1000);
  }
}

//admin Response to user's message
function adminResponse() {
  fetch("https://api.adviceslip.com/advice")
    .then((response) => {
      return response.json();
    })
    .then((adviceData) => {
      let Adviceobj = adviceData.slip;
      document.getElementById(
        "messageBox"
      ).innerHTML += `<div class="second-chat">
          <div class="circle" id="circle-mar"></div>
          <p>${Adviceobj.advice}</p>
          <div class="arrow"></div>
        </div>`;
      // Remove audio play

      var objDiv = document.getElementById("messageBox");
      objDiv.scrollTop = objDiv.scrollHeight;
    })
    .catch((error) => {
      console.log(error);
    });
}

//press enter on keyboard and send message
addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    const e = document.getElementById("textInput");
    if (e === document.activeElement) {
      userResponse();
    }
  }
});