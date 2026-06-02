const tabs = document.querySelectorAll("[data-m4food-tab]");
const panels = document.querySelectorAll("[data-m4food-panel]");

function showPanel(panelName) {
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.m4foodTab === panelName);
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.m4foodPanel === panelName;
    panel.hidden = !isActive;
    panel.classList.toggle("active", isActive);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => showPanel(tab.dataset.m4foodTab));
});
