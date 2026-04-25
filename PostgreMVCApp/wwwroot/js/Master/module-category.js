function confirmDelete(id) {
    if (!confirm("Are you sure you want to delete this module category?")) {
        return;
    }

    fetch(`/Master/DeleteModuleCategory/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]').value
        }
    }).then(response => {
        if (response.ok) {
            // Successfully deleted, reload the page or remove the item from the DOM
            location.reload();
        } else {
            alert("Failed to delete the module category.");
        }
    });
};