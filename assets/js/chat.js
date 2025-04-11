function chatOpen() {
  document.getElementById("chat-open").style.display = "none"; // Hide the open button
  const chatWindow1 = document.getElementById("chat-window1");
  chatWindow1.style.display = "block";
  setTimeout(() => {
    chatWindow1.classList.add("show");
  }, 10);
}

function chatClose() {
  const chatWindow1 = document.getElementById("chat-window1");
  const chatWindow2 = document.getElementById("chat-window2");
  const chatOpenButton = document.getElementById("chat-open");

  chatWindow1.classList.remove("show");
  chatWindow2.classList.remove("show");

  setTimeout(() => {
    chatWindow1.style.display = "none";
    chatWindow2.style.display = "none";
    chatOpenButton.style.display = "block"; // Show the open button again
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

// Attach event listeners for the new close button inside .chat-window2
document.addEventListener("DOMContentLoaded", () => {
  const chatCloseButton = document.getElementById("chat-close");
  chatCloseButton.addEventListener("click", chatClose);
});

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
  const typingIndicatorHTML = `
    <div class="second-chat typing-indicator">
      <div id="lottie-typing" class="lottie-animation"></div>
    </div>
  `;
  messageBox.innerHTML += typingIndicatorHTML;

  const lottieContainer = document.getElementById("lottie-typing");

  // Load Lottie animation
  lottie.loadAnimation({
    container: lottieContainer, // The HTML element to render the animation in
    renderer: 'svg', // Render as SVG for high-quality vector graphics
    loop: true, // Loop animation
    autoplay: true, // Start animation automatically
    path: 'https://lottie.host/c0761623-e8fd-4488-a7da-b9cc5d1ed230/vp6SvMQM7V.json' // Path to Lottie JSON file
  });

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

// Predefined responses
const predefinedResponses = [
  "Hello! How can I assist you today?",
  "Thank you for reaching out!",
  "I'm here to help with any questions you have.",
  "Can you provide more details about your inquiry?",
  "Great to hear from you! Let me know how I can assist.",
  "That's an interesting question. Let me think about it.",
  "I appreciate your patience.",
  "Let me check that for you.",
  "Could you clarify your question a little more?",
  "Thank you! I'll do my best to help you."
];

function adminResponse() {
  showTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator();

    const randomIndex = Math.floor(Math.random() * predefinedResponses.length);
    const responseText = predefinedResponses[randomIndex];

    const messageHTML = `
      <div class="second-chat">
        <p></p>
      </div>
    `;
    document.getElementById("messageBox").innerHTML += messageHTML;

    const messageBox = document.getElementById("messageBox");
    const lastMessage = messageBox.lastElementChild.querySelector('p');

    typeMessage(responseText, lastMessage);

    messageBox.scrollTop = messageBox.scrollHeight;
  }, 2000);
}

// Auto-resize textarea function
function autoResizeTextarea() {
  const textarea = document.getElementById("textInput");
  textarea.style.height = "63px"; // Set the initial height to 63px for one line of text
  const scrollHeight = textarea.scrollHeight;
  const maxHeight = window.innerHeight * 0.2; // Maximum height is 20% of the viewport height

  if (scrollHeight > 63 && scrollHeight <= maxHeight) {
    textarea.style.height = scrollHeight + "px"; // Dynamically grow the height
    textarea.style.overflowY = "hidden"; // Hide scrollbars
  } else if (scrollHeight > maxHeight) {
    textarea.style.height = maxHeight + "px"; // Set to max height
    textarea.style.overflowY = "auto"; // Enable scrollbar for overflow
  } else {
    textarea.style.overflowY = "hidden"; // Ensure no scrollbar when height is 63px
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("textInput");
  textarea.style.height = "63px"; // Ensure initial height is set correctly
  textarea.addEventListener("input", autoResizeTextarea);

  // Add event listener for keydown to handle Enter and Shift+Enter
textarea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent adding a new line
      userResponse(); // Trigger the message send function
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("textInput");
  textarea.addEventListener("input", autoResizeTextarea);
});

addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    const e = document.getElementById("textInput");
    if (e === document.activeElement) {
      userResponse();
    }
  }
});