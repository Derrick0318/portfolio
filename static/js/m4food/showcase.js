const buttons = document.querySelectorAll("[data-screen]");
const panels = document.querySelectorAll("[data-screen-panel]");

function activateScreen(screenName) {
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.screen === screenName);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.screenPanel === screenName);
  });
}

buttons.forEach((button) => {
  button.addEventListener("click", () => activateScreen(button.dataset.screen));
});
