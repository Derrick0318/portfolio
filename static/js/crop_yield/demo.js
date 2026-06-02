const predictUrl = document.body.dataset.predictUrl;
const exampleCards = document.querySelectorAll("[data-example]");
const imageInput = document.querySelector("#imageInput");
const fileName = document.querySelector("#fileName");
const imagePreview = document.querySelector("#imagePreview");
const analyzeButton = document.querySelector("#analyzeButton");
const resultFile = document.querySelector("#resultFile");
const yieldValue = document.querySelector("#yieldValue");
const yieldClass = document.querySelector("#yieldClass");
const recommendations = document.querySelector("#recommendations");
const historyList = document.querySelector("#historyList");

let selectedFileName = "field25.png";

function renderPrediction(data) {
  resultFile.textContent = data.fileName;
  yieldValue.textContent = `${data.predictedYield.toFixed(2)} T/Ha`;
  yieldClass.textContent = data.yieldClass;
  recommendations.innerHTML = data.crops
    .map((crop) => `<span>${crop.name} - ${crop.reason}</span>`)
    .join("");

  const entry = document.createElement("li");
  entry.textContent = `${data.fileName} - ${data.predictedYield.toFixed(2)} T/Ha - ${data.yieldClass}`;
  historyList.prepend(entry);
}

async function requestPrediction() {
  analyzeButton.textContent = "Analyzing...";
  const response = await fetch(predictUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: selectedFileName }),
  });
  const data = await response.json();
  renderPrediction(data);
  analyzeButton.textContent = "Process Analysis";
}

exampleCards.forEach((card) => {
  card.addEventListener("click", () => {
    exampleCards.forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
    selectedFileName = card.dataset.example;
    fileName.textContent = selectedFileName;
    imagePreview.src = card.dataset.image;
    requestPrediction();
  });
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) {
    return;
  }

  selectedFileName = file.name;
  fileName.textContent = selectedFileName;
  imagePreview.src = URL.createObjectURL(file);
});

analyzeButton.addEventListener("click", requestPrediction);
