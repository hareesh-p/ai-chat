function chatOpen() {
  document.getElementById("chat-open").style.display = "none";
  document.getElementById("chat-close").style.display = "block";
  const chatWindow1 = document.getElementById("chat-window1");
  chatWindow1.style.display = "block";
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
  }, 300);
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

function getTypingDelay(word) {
  return 100 + (word.length * 30);
}

function typeMessage(text, element) {
  const words = text.split(' ');
  let wordIndex = 0;
  
  const typingSpan = document.createElement('span');
  element.appendChild(typingSpan);
  
  function typeNextWord() {
    if (wordIndex < words.length) {
      typingSpan.textContent += words[wordIndex] + ' ';
      wordIndex++;
      
      element.parentElement.parentElement.scrollTop = 
        element.parentElement.parentElement.scrollHeight;
      
      const nextDelay = getTypingDelay(words[wordIndex] || '');
      setTimeout(typeNextWord, nextDelay);
    }
  }
  
  typeNextWord();
}

function showTypingIndicator() {
  const messageBox = document.getElementById("messageBox");
  messageBox.innerHTML += `
    <div class="second-chat typing-indicator">
      <p>Thinking...</p>
    </div>
  `;
  messageBox.scrollTop = messageBox.scrollHeight;
}

function removeTypingIndicator() {
  const messageBox = document.getElementById("messageBox");
  const typingIndicator = messageBox.querySelector('.typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function userResponse() {
  let userText = document.getElementById("textInput").value;

  if (userText == "") {
    alert("Please type something!");
  } else {
    document.getElementById("messageBox").innerHTML += `
      <div class="first-chat">
        <p>${userText}</p>
      </div>
    `;

    document.getElementById("textInput").value = "";
    var objDiv = document.getElementById("messageBox");
    objDiv.scrollTop = objDiv.scrollHeight;

    setTimeout(() => {
      adminResponse();
    }, 1000);
  }
}

function adminResponse() {
  showTypingIndicator();
  
  fetch("https://api.adviceslip.com/advice")
    .then((response) => response.json())
    .then((adviceData) => {
      removeTypingIndicator();
      
      const messageHTML = `
        <div class="second-chat">
          <p></p>
        </div>
      `;
      document.getElementById("messageBox").innerHTML += messageHTML;
      
      const messageBox = document.getElementById("messageBox");
      const lastMessage = messageBox.lastElementChild.querySelector('p');
      
      typeMessage(adviceData.slip.advice, lastMessage);
      
      messageBox.scrollTop = messageBox.scrollHeight;
    })
    .catch((error) => {
      console.log(error);
    });
}

addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    const e = document.getElementById("textInput");
    if (e === document.activeElement) {
      userResponse();
    }
  }
});