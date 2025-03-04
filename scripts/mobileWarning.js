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