document.addEventListener("DOMContentLoaded", function () {
    let header = document.getElementById("header");
    let menu = document.getElementById("header-menu");
    let hideTimeout = null;

    function showMenu() {
        clearTimeout(hideTimeout);
        menu.style.display = "block";
        setTimeout(() => {
            menu.style.opacity = "1";
            menu.style.transform = "translateY(0)";
        }, 10);
    }

    function hideMenu() {
        hideTimeout = setTimeout(() => {
            if (!menu.matches(":hover") && !header.matches(":hover")) {
                menu.style.opacity = "0";
                menu.style.transform = "translateY(-10px)";
                setTimeout(() => {
                    if (!menu.matches(":hover") && !header.matches(":hover")) {
                        menu.style.display = "none";
                    }
                }, 300);
            }
        }, 150); //grace period
    }
    
    header.addEventListener("mouseenter", showMenu);
    menu.addEventListener("mouseenter", showMenu);

    header.addEventListener("mouseleave", hideMenu);
    menu.addEventListener("mouseleave", hideMenu);


    showMenu();
    setTimeout(hideMenu, 2000);
});

document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme") || "dark";

    document.documentElement.setAttribute("data-theme", currentTheme);
    themeToggle.textContent = currentTheme === "dark" ? "Light Theme" : "Dark Theme";

    themeToggle.addEventListener("click", function () {
        let newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        themeToggle.textContent = newTheme === "dark" ? "Light Theme" : "Dark Theme";
    });
});
