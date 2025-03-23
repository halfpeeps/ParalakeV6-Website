document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".zip-download");
  
    buttons.forEach(button => {
      button.addEventListener("click", async () => {
        const source = button.dataset.source;
        const zipName = button.dataset.zipname || "images.zip";
  
        if (!source) {
          alert("Error getting download.  Sorry :c");
          return;
        }
  
        const zip = new JSZip();
  
        try {
          const res = await fetch(source);
          const imageList = await res.json();
  
          for (const url of imageList) {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch ${url}`);
            const blob = await response.blob();
  
            //remove everything before the base image folder
            const baseFolder = "/images/06-Other/Menu-Background-Pack/";
            const relativePath = url.startsWith(baseFolder)
            ? url.slice(baseFolder.length)
            : url.split("/").pop();

            zip.file(relativePath, blob);
          }
  
          const content = await zip.generateAsync({ type: "blob" });
          saveAs(content, zipName);
        } catch (err) {
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

//add the following to the button
{/*
    <button class="download-button zip-download"
        data-source="json/image_sets/wallpapers.json"
        data-zipname="Wallpapers.zip">
        Download As Wallpapers
    </button>
*/}
  