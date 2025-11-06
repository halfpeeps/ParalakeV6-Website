document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".zip-download");
  const popup = document.getElementById("zip-loading-popup");
  const progressBar = document.getElementById("zip-progress-bar");
  const progressLabel = document.getElementById("zip-progress-label");
  const fileProgressLabel = document.getElementById("zip-file-progress-label");
  const successMessage = document.getElementById("zip-success-message");

  buttons.forEach(button => {
    button.addEventListener("click", async () => {
      const source = button.dataset.source;
      const zipName = button.dataset.zipname || "images.zip";

      if (!source) {
        alert("Error getting download. Sorry :c");
        return;
      }

      const zip = new JSZip();

      try {
        if (popup) {
          popup.style.display = "flex";
          popup.offsetHeight; // force reflow
          popup.classList.add("show");
        }
        if (progressBar) progressBar.style.width = "0%";
        if (progressLabel) progressLabel.textContent = "Preparing download...";
        if (fileProgressLabel) fileProgressLabel.textContent = "";
        if (successMessage) {
          successMessage.style.display = "none";
          successMessage.classList.remove("show");
        }

        const res = await fetch(source);
        const imageList = await res.json();

        const baseFolder = "/images/06-Other/Menu-Background-Pack/";
        const relativePaths = imageList.map(url =>
          url.startsWith(baseFolder) ? url.slice(baseFolder.length) : url
        );

        const folders = new Set(
          relativePaths.map(path =>
            path.includes("/") ? path.split("/").slice(0, -1).join("/") : ""
          )
        );

        const shouldFlatten = folders.size <= 1;

        let index = 0;
        for (let i = 0; i < imageList.length; i++) {
          const url = imageList[i];
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch ${url}`);
          const blob = await response.blob();

          const relativePath = url.startsWith(baseFolder)
            ? url.slice(baseFolder.length)
            : url;

          const finalPath = shouldFlatten
            ? relativePath.split("/").pop()
            : relativePath;

          zip.file(finalPath, blob);

          index++;
          const downloadProgress = index / imageList.length;
          const totalProgress = Math.floor(downloadProgress * 50); //0–50%
          if (progressBar) progressBar.style.width = totalProgress + "%";
          if (progressLabel) progressLabel.textContent = `Fetching images... ${totalProgress}%`;
        }

        if (progressLabel) progressLabel.textContent = "Compressing ZIP...";
        if (fileProgressLabel) fileProgressLabel.textContent = "";

        let zipProgress = 50;
        const interval = setInterval(() => {
          zipProgress += 1;
          if (zipProgress >= 99) zipProgress = 99;
          if (progressBar) progressBar.style.width = zipProgress + "%";
          if (progressLabel) progressLabel.textContent = `Compressing ZIP... ${zipProgress}%`;
        }, 100);

        const content = await zip.generateAsync({
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: { level: 6 },
          streamFiles: true
        });

        clearInterval(interval);
        if (progressBar) progressBar.style.width = "100%";
        if (progressLabel) progressLabel.textContent = `Done! Preparing download...`;
        if (successMessage) {
          successMessage.style.display = "block";
          successMessage.classList.add("show");
        }

        setTimeout(() => {
          if (popup) {
            popup.classList.remove("show");
            setTimeout(() => { popup.style.display = "none"; }, 800);
          }

          if (progressBar) progressBar.style.width = "0%";
          if (progressLabel) progressLabel.textContent = "";
          if (fileProgressLabel) fileProgressLabel.textContent = "";
          if (successMessage) {
            successMessage.style.display = "none";
            successMessage.classList.remove("show");
          }
        }, 3000);

        saveAs(content, zipName);

      } catch (err) {
        if (popup) popup.style.display = "none";
        alert("Error creating ZIP: " + err.message);
        console.error(err);
      }
    });
  });
});

//include in pages that need to download images
{/*
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
    <script src="/scripts/imageZipper.js"></script>
*/}

//add this to display the download spinner
{/* <div id="zip-loading-popup">
<div id="zip-loading-popup-content">
  <div id="zip-progress-label">Preparing download...</div>
  <div id="zip-file-progress-label" style="font-size: 0.9rem; margin-bottom: 8px;"></div>

  <div id="zip-progress-bar-container">
    <div id="zip-progress-bar"></div>
  </div>

  <div id="zip-success-message" style="display: none; margin-top: 20px;">
    <svg id="zip-success-check" viewBox="0 0 52 52">
      <path d="M14 27 L22 35 L38 17" fill="none" stroke="var(--color-accent)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    <div style="margin-top: 10px; font-size: 1.2rem; color: var(--color-text);">Download Ready!</div>
  </div>
</div>
</div>     */}

//add the following to the button
{/*
    <button class="download-button zip-download"
        data-source="data/image_sets/json-name.json"
        data-zipname="zip-name.zip">
        Button text
    </button>
*/}
  