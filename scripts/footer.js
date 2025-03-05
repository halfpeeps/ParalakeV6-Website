fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('pagefooter').innerHTML = data;
    })
    .catch(error => console.error('Error loading footer:', error));

document.getElementById('pagefooter').addEventListener('click', function (event) {
    if (event.target.matches('#contact-link')) {
        event.preventDefault();
        document.getElementById('contact-popup').style.display = 'flex';
        document.getElementById('popup-background').style.display = 'flex';
    } else if (event.target.matches('#about-link')) {
        event.preventDefault();
        document.getElementById('about-popup').style.display = 'flex';
        document.getElementById('popup-background').style.display = 'flex';
    } else if (event.target.matches('#download-link')) {
        event.preventDefault();
        document.getElementById('download-popup').style.display = 'flex';
        document.getElementById('popup-background').style.display = 'flex';
    }
});


function closeContact() {
    document.getElementById('contact-popup').style.display = 'none';
    document.getElementById('popup-background').style.display = 'none';
}

function closeAbout() {
    document.getElementById('about-popup').style.display = 'none';
    document.getElementById('popup-background').style.display = 'none';
}

function closeDownload() {
    document.getElementById('download-popup').style.display = 'none';
    document.getElementById('popup-background').style.display = 'none';
}