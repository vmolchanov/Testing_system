(function () {

    var hamburger = document.querySelector(".hamburger");
    var menu = document.querySelector(".main-menu");

    hamburger.addEventListener("click", function (event) {
        event.preventDefault();

        menu.classList.toggle("main-menu--show")
    });

})();
