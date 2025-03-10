// document.addEventListener("DOMContentLoaded", function () {
//     let header = document.getElementById("header");
//     let menu = document.getElementById("header-menu");
//     let hideTimeout = null;

//     function showMenu() {
//         clearTimeout(hideTimeout);
//         menu.style.display = "block";
//         setTimeout(() => {
//             menu.style.opacity = "1";
//             menu.style.transform = "translateY(0)";
//         }, 10);
//     }

//     function hideMenu() {
//         hideTimeout = setTimeout(() => {
//             if (!menu.matches(":hover") && !header.matches(":hover")) {
//                 menu.style.opacity = "0";
//                 menu.style.transform = "translateY(-10px)";
//                 setTimeout(() => {
//                     if (!menu.matches(":hover") && !header.matches(":hover")) {
//                         menu.style.display = "none";
//                     }
//                 }, 300);
//             }
//         }, 150); //grace period
//     }

//     header.addEventListener("mouseenter", showMenu);
//     menu.addEventListener("mouseenter", showMenu);

//     header.addEventListener("mouseleave", hideMenu);
//     menu.addEventListener("mouseleave", hideMenu);
// });
