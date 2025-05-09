let animationData;

// Preload the Lottie JSON file
fetch("assets/animations/typing-indicator.json") // Use the local path
  .then((response) => response.json())
  .then((data) => {
    animationData = data; // Store the preloaded JSON data
    console.log("Lottie animation preloaded.");
  })
  .catch((error) => {
    console.error("Error preloading Lottie JSON:", error);
  });

document.addEventListener("DOMContentLoaded", () => {
  const lottieContainer = document.getElementById("lottie-typing");

  // Load the Lottie animation once the DOM is ready and JSON is preloaded
  if (animationData) {
    lottie.loadAnimation({
      container: lottieContainer, // The HTML element to render the animation in
      renderer: "svg", // Render as SVG for high-quality vector graphics
      loop: true, // Loop animation
      autoplay: true, // Start animation automatically
      animationData: animationData, // Use the preloaded JSON data
    });
    console.log("Lottie animation loaded.");
  } else {
    console.warn("Lottie animation data not yet preloaded.");
  }
});

function openChatWindow2() {

  const chatWindow2 = document.getElementById("chat-window2");
  const chatOverlay = document.getElementById("chat-overlay");

  chatWindow2.style.display = "block";
  chatOverlay.style.display = "block"; // Show the overlay

  setTimeout(() => {
    chatWindow2.classList.add("show");
    chatOverlay.classList.add("show");
  }, 10);
    // Send a background query to invalidate cache and fetch the latest information
    const apiUrl = "https://us-central1-cagen-dev.cloudfunctions.net/knowledge_base/search";
    const query = "Share every details about Movate";
    const requestBody = {
      question: query, // Query to invalidate cache and fetch latest info
      client: "wp_movate", // Specify the client
    };
  
    console.log("Sending background query to invalidate cache:", query);
  
    // Measure the time taken to receive the response
    const startTime = performance.now();
  
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        const endTime = performance.now();
        console.log("Background query response received:", data);
        console.log(`Time taken to receive response: ${(endTime - startTime).toFixed(2)}ms`);
      })
      .catch((error) => {
        console.error("Error in background query:", error);
      });
}

function closeChatWindow2() {
  const chatWindow2 = document.getElementById("chat-window2");
  const chatOverlay = document.getElementById("chat-overlay");
  const chatOpenButton = document.getElementById("chat-open");

  chatWindow2.classList.remove("show");
  chatOverlay.classList.remove("show");

  setTimeout(() => {
    chatWindow2.style.display = "none";
    chatOverlay.style.display = "none"; // Hide the overlay
    chatOpenButton.style.display = "block"; // Show the open button again
  }, 300);
}

// Attach event listeners for the close button
document.addEventListener("DOMContentLoaded", () => {
  const chatCloseButton = document.getElementById("chat-close");
  chatCloseButton.addEventListener("click", closeChatWindow2);
});

function getTypingDelay(word) {
  return 20 + word.length * 4;
}

async function typeMessage(text, element) {
  console.log("Typing text:", text); // Debug: Log the full text to be typed
  const words = text.split(" ");
  let wordIndex = 0;

  const typingSpan = document.createElement("span");
  element.appendChild(typingSpan);

  async function typeNextWord() {
    if (wordIndex < words.length) {
      console.log(`Typing word: "${words[wordIndex]}"`); // Debug: Log each word being typed
      typingSpan.textContent += words[wordIndex] + " ";
      wordIndex++;

      element.parentElement.parentElement.scrollTop =
        element.parentElement.parentElement.scrollHeight;

      const nextDelay = getTypingDelay(words[wordIndex] || "");
      await new Promise((resolve) => setTimeout(resolve, nextDelay)); // Debug: Confirm delay
      await typeNextWord(); // Continue typing
    } else {
      console.log("Typing effect finished."); // Debug: Indicate completion
    }
  }

  await typeNextWord();
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
  if (animationData) {
    lottie.loadAnimation({
      container: lottieContainer,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData, // Use the preloaded JSON data
    });
  }

  messageBox.scrollTop = messageBox.scrollHeight;
}

function removeTypingIndicator() {
  const messageBox = document.getElementById("messageBox");
  const typingIndicator = messageBox.querySelector(".typing-indicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function userResponse() {
  const userText = document.getElementById("textInput").value;

  if (userText === "") {
    alert("Please type something!");
  } else {
    document.getElementById("messageBox").innerHTML += `
      <div class="first-chat">
        <p>${userText}</p>
      </div>
    `;

    document.getElementById("textInput").value = "";
    const objDiv = document.getElementById("messageBox");
    objDiv.scrollTop = objDiv.scrollHeight;

    setTimeout(() => {
      adminResponse(userText); // Pass the user's question to the adminResponse function
    }, 1000);
  }
}

// Function to fetch response from the API
async function fetchResponse(question) {
  const apiUrl = "https://us-central1-cagen-dev.cloudfunctions.net/knowledge_base/search";

  const requestBody = {
    question, // Pass the question directly
    client: "wp_movate", // Use the specified client
  };

  console.log("Sending API request to:", apiUrl);
  console.log("Request Body:", JSON.stringify(requestBody));

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response Status:", response.status);
    console.log("Response Headers:", response.headers);

    const data = await response.json(); // Parse JSON response
    console.log("Full API Response:", data);

    if (data.result) {
      return data.result; // Return the result field from the response
    } else {
      console.warn("API Response does not contain 'result' field.");
      return "Sorry, no answer was found."; // Fallback if `result` is missing
    }
  } catch (error) {
    console.error("Error fetching response:", error);
    return "Sorry, I couldn't fetch a response at the moment."; // Fallback for errors
  }
}

async function adminResponse(userQuestion) {
  showTypingIndicator(); // Show typing indicator immediately

  try {
    const responseMarkdown = await fetchResponse(userQuestion); // Fetch response dynamically
    console.log("Final Response from API:", responseMarkdown); // Debug: Log the final response

    removeTypingIndicator(); // Remove typing indicator after API response is received

    // Step 1: Create a container for typing the response
    const messageBox = document.getElementById("messageBox");
    const messageDiv = document.createElement("div");
    messageDiv.className = "second-chat markdown-content";
    messageBox.appendChild(messageDiv);

    // Step 2: Typing effect with plain Markdown text
    await typeMessage(responseMarkdown, messageDiv);

    // Step 3: Add fade-in transition for Markdown rendering
    const htmlContent = marked.parse(responseMarkdown); // Convert Markdown to HTML
    messageDiv.classList.add("fade-in"); // Add fade-in class
    messageDiv.innerHTML = htmlContent; // Replace plain text with rendered HTML

    // Step 4: Scroll to the bottom of the message box
    messageBox.scrollTop = messageBox.scrollHeight;
  } catch (error) {
    console.error("Error in adminResponse:", error);
    removeTypingIndicator(); // Ensure the typing indicator is removed even if there is an error
  }
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