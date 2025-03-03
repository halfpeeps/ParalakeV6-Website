function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
function closeMobileWarning() {
    document.getElementById('mobile-warning').style.display = 'none';
}
window.onload = function() {
    if (isMobile()) {
        document.getElementById('mobile-warning').style.display = 'flex';
    }
};

async function loadImages() {
    const response = await fetch('file_list.json');
    const fileTree = await response.json();
    const sidebar = document.getElementById('sidebar');
    const imageContainer = document.getElementById('image-container');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const closeBtn = document.querySelector('#image-preview .close');
    const imageDescription = document.createElement('p');
    
    imageDescription.classList.add('image-description');

    let imageFiles = [];
    let currentIndex = -1;
    
    function cleanFolderName(folderName) {
        return folderName.replace(/^\d+\s*/, '').replace(/-/g, ' ');
    }    

    function createFolderElement(folderPath, parentElement) {
        const rawFolderName = folderPath.split('/').pop();
        const folderName = cleanFolderName(rawFolderName);
        const folderElement = document.createElement('div');
        folderElement.classList.add('folder');

        const folderHeader = document.createElement('div');
        folderHeader.style.display = 'flex';
        folderHeader.style.alignItems = 'center';
        folderHeader.style.justifyContent = 'flex-start';

        const toggleButton = document.createElement('span');
        toggleButton.classList.add('toggle-button');

        const hasSubfolders = Object.keys(fileTree).some(key => key.startsWith(folderPath + '/') && key !== folderPath);
        const hasImages = fileTree[folderPath] && fileTree[folderPath].length > 0;

        if (hasSubfolders) {
            toggleButton.textContent = '[+]';
            folderElement.classList.add('parent-folder');
        }

        const folderLabel = document.createElement('span');
        folderLabel.innerHTML = `<span class='folder-icon'>&nbsp📁</span> ${folderName}`;
        folderLabel.style.flexGrow = "1";
        folderLabel.style.textAlign = "left";

        if (hasSubfolders) {
            folderHeader.appendChild(toggleButton);
        }
        folderHeader.appendChild(folderLabel);
        folderElement.appendChild(folderHeader);

        const nestedContainer = document.createElement('div');
        nestedContainer.classList.add('nested');
        folderElement.appendChild(nestedContainer);
        parentElement.appendChild(folderElement);

        if (hasSubfolders) {
            toggleButton.addEventListener('click', (e) => {
                e.stopPropagation();
                if (folderElement.classList.contains('expanded')) {
                    folderElement.classList.remove('expanded');
                    toggleButton.textContent = '[+]';
                } else {
                    document.querySelectorAll('.folder').forEach(f => {
                        if (!f.contains(folderElement) && !folderElement.contains(f)) {
                            f.classList.remove('expanded');
                            const toggleBtn = f.querySelector('.toggle-button');
                            if (toggleBtn) toggleBtn.textContent = '[+]';
                        }
                    });
                    folderElement.classList.add('expanded');
                    toggleButton.textContent = '[-]';
                }
            });
        }

        if (hasImages) {
            folderElement.addEventListener('click', (e) => {
                e.stopPropagation();
                document.querySelectorAll('.folder').forEach(f => f.classList.remove('active'));
                folderElement.classList.add('active');

                imageContainer.innerHTML = '';
                imageFiles = [];

                if (fileTree[folderPath] && fileTree[folderPath].length > 0) {
                    fileTree[folderPath].forEach(file => {
                        const img = document.createElement('img');
                        img.src = `images/${folderPath}/${file.filename}`;
                        img.onclick = () => {
                            currentIndex = imageFiles.findIndex(image => image.src === img.src);
                            previewImg.src = imageFiles[currentIndex].src;
                            if (imageFiles[currentIndex].description) {
                                imageDescription.textContent = imageFiles[currentIndex].description;
                                imageDescription.style.display = 'block';
                            } else {
                                imageDescription.style.display = 'none';
                            }
                            imagePreview.style.display = 'flex';
                        };
                        imageFiles.push({ src: img.src, description: file.description });
                        imageContainer.appendChild(img);
                    });
                }
            });
        } else {
            folderElement.addEventListener('click', (e) => {
                e.stopPropagation();
                if (folderElement.classList.contains('expanded')) {
                    folderElement.classList.remove('expanded');
                    toggleButton.textContent = '[+]';
                } else {
                    document.querySelectorAll('.folder').forEach(f => {
                        if (!f.contains(folderElement) && !folderElement.contains(f)) {
                            f.classList.remove('expanded');
                            const toggleBtn = f.querySelector('.toggle-button');
                            if (toggleBtn) toggleBtn.textContent = '[+]';
                        }
                    });
                    folderElement.classList.add('expanded');
                    toggleButton.textContent = '[-]';
                }
            });
        }

        return nestedContainer;
    }

    const descriptionContainer = document.createElement('div');
    descriptionContainer.appendChild(imageDescription);
    imagePreview.appendChild(descriptionContainer);

    // arrow keys and esc
    document.addEventListener('keydown', (e) => {
        if (imagePreview.style.display === 'flex' && currentIndex !== -1) {
            if (e.key === 'ArrowRight' && currentIndex < imageFiles.length - 1) {
                currentIndex++; 
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                currentIndex--; 
            } else if (e.key === 'Escape') {
                imagePreview.style.display = 'none';
                return;
            }
            
            previewImg.src = imageFiles[currentIndex].src;
            
            if (imageFiles[currentIndex].description) {
                imageDescription.textContent = imageFiles[currentIndex].description;
                imageDescription.style.display = 'block'; 
            } else {
                imageDescription.style.display = 'none'; 
            }
        }
    });

    const folderElements = {};
    const folders = Object.keys(fileTree);
    const miscFolders = [];
    const otherFolders = [];

    folders.forEach(folder => {
        if (folder.includes('Misc')) {
            miscFolders.push(folder);
        } else {
            otherFolders.push(folder);
        }
    });

    const allFolders = otherFolders.concat(miscFolders);

    allFolders.forEach(folder => {
        if (folder !== "") {
            const parentFolder = folder.substring(0, folder.lastIndexOf('/'));
            const parentElement = folderElements[parentFolder] || sidebar;
            folderElements[folder] = createFolderElement(folder, parentElement);
        }
    });

    closeBtn.addEventListener('click', () => {
        imagePreview.style.display = 'none';
    });

    imagePreview.addEventListener('click', (e) => {
        if (e.target === imagePreview) {
            imagePreview.style.display = 'none';
        }
    });

}

//open preview image in a new tab if clicked
document.addEventListener("DOMContentLoaded", function () {
    const img = document.getElementById("preview-img");
    const link = document.getElementById("preview-link");

    img.addEventListener("load", function () {
        link.href = img.src;
    });
});

loadImages();