// src/content.ts
console.log("content script loaded");
var activeInput = null;
document.addEventListener("keydown", (event) => {
  const isMac = navigator.platform.toUpperCase().includes("MAC");
  const modifierPressed = isMac ? event.metaKey : event.ctrlKey;
  if (modifierPressed && event.key.toLowerCase() === "i") {
    console.log("Ctrl+I pressed");
    event.preventDefault();
    if (activeInput) return;
    const input = document.createElement("input");
    input.type = "text";
    input.value = "type here...";
    input.style.position = "fixed";
    input.style.top = "-100px";
    input.style.opacity = "0";
    input.style.pointerEvents = "none";
    document.body.appendChild(input);
    input.focus();
    input.select();
    activeInput = input;
  }
  if (activeInput && (event.key === "Escape" || event.key === "Enter")) {
    const value = activeInput.value;
    console.log("Input value:", value);
    event.preventDefault();
    activeInput.remove();
    activeInput = null;
    chrome.runtime.sendMessage(
      {
        type: "PROCESS_TEXT",
        payload: { problem: value }
      },
      (response) => {
        console.log("Background response:", response.result?.candidates[0]?.content?.parts[0].text || "Error");
        navigator.clipboard.writeText(response.result?.candidates[0]?.content?.parts[0].text || "Error");
      }
    );
  }
});
//# sourceMappingURL=content.js.map
