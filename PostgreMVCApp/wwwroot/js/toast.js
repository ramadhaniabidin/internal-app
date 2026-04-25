function toast({ title = "", message = "", type = "info", duration = 3000 }) {
    const main = document.getElementById("toast");
    if (main) {
        const toast = document.createElement("div");

        // Auto remove toast
        const autoRemoveId = setTimeout(function () {
            main.removeChild(toast);
        }, duration + 1000);

        // Remove toast when clicked
        toast.onclick = function (e) {
            if (e.target.closest(".my-toast__close")) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        };

        const icons = {
            success: "fas fa-check-circle",
            info: "fas fa-info-circle",
            warning: "fas fa-exclamation-circle",
            error: "fas fa-exclamation-circle"
        };
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);

        toast.classList.add("my-toast", `my-toast--${type}`);
        toast.style.animation = `slideInUp ease .3s, fadeOut linear 1s ${delay}s forwards`; // Changed animation

        toast.innerHTML = `
                    <div class="my-toast__icon">
                        <i class="${icon}"></i>
                    </div>
                    <div class="my-toast__body">
                        <h3 class="my-toast__title">${title}</h3>
                        <p class="my-toast__msg">${message}</p>
                    </div>
                    <div class="my-toast__close">
                        <i class="fas fa-times"></i>
                    </div>
                `;
        main.appendChild(toast);
    }
}

function showSuccessToast(message) {
    toast({
        title: "Success!",
        message: message,
        type: "success",
        duration: 5000
    });
}

function showErrorToast(message) {
    toast({
        title: "Error!",
        message: message,
        type: "error",
        duration: 5000
    });
}
