function closePopup() {
    document.getElementById("popup").style.display = "none";
}

document.getElementById("popup").addEventListener("click", function(event) {
    if (event.target === this) {
        closePopup();
    }
});