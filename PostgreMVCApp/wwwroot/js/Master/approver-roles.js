function getAntiForgeryToken() {
    return document.querySelector('input[name="__RequestVerificationToken"]')?.value;
};



document.getElementById('roleForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const roleID = document.getElementById('positionId').value;
    const roleName = document.getElementById('positionName').value;
    const roleAlias = document.getElementById('positionAlias').value;
    if (roleID) {
        editRoleAction(roleID, roleName, roleAlias);
    } else {
        addRoleAction(roleName, roleAlias);
    }
});

function editRoleAction(id, name, alias) {
    const token = getAntiForgeryToken();
    fetch('/Master/UpdateRole', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'RequestVerificationToken': token
        },
        body: new URLSearchParams({
            'id': id,
            'roleName': name,
            'roleAlias': alias,
            '__RequestVerificationToken': token
        })
    })
        .then(response => {
            return response.json().then(data => {
                return data;
            });
        })
        .then(data => {
            if (!data.ok) {
                showErrorToast("Error updating approver position: " + data.message);
            }
            closeModal();
            showSuccessToast("Success updating approver position");
        })
};

function addRoleAction(name, alias) {
    const token = getAntiForgeryToken();
    fetch('/Master/AddRole', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'RequestVerificationToken': token
        },
        body: new URLSearchParams({
            'roleName': name,
            'roleAlias': alias,
            '__RequestVerificationToken': token
        })
    })
        .then(response => {
            return response.json().then(data => {
                return { response, data };
            });
        })
        .then(({ response, data }) => {
            if (data.ok) {
                closeModal();
                showSuccessToast("Success adding approver position");
                
            } else {
                showErrorToast("Error updating approver position: " + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while adding approver position');
        });
};

function addRole() {
    document.getElementById('positionName').value = '';
    document.getElementById('positionAlias').value = '';
    document.getElementById('positionId').value = '';
    document.getElementById('addStatusModalLabel').textContent = 'Add New Approver Position';
    openModal();
};

function editStatus(id) {
    const token = getAntiForgeryToken();

    // Fetch the status data from your API
    fetch('/Master/GetRole/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'RequestVerificationToken': token
        }
    })
        .then(response => {
            // Parse JSON from response
            return response.json().then(result => {
                return result;
            });
        })
        .then(result => {
            // Populate the modal with the fetched data
            const item = result.data.items[0];

            document.getElementById('positionName').value = item.name;
            document.getElementById('positionAlias').value = item.alias;
            document.getElementById('positionId').value = item.id;
            document.getElementById('addStatusModalLabel').textContent = 'Edit Approver Position';

            openModal();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while loading status');
        });
};

function deleteStatus(id) {
    if (confirm('Are you sure you want to delete this status?')) {
        const token = getAntiForgeryToken();

        fetch('/Master/DeleteRole', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'RequestVerificationToken': token
            },
            body: new URLSearchParams({
                'id': id,
                '__RequestVerificationToken': token
            })
        })
            .then(response => {
                if (response.ok) {
                    alert('Status deleted successfully!');
                    location.reload();
                } else {
                    alert('Error deleting status');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while deleting status');
            });
    }
};

function openModal() {
    const modal = document.getElementById('addStatusModal');
    modal.style.display = 'block';

    // Create and show backdrop
    let backdrop = document.querySelector('.modal-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.classList.add('modal-backdrop');
        document.body.appendChild(backdrop);
    }

    // Trigger reflow to enable transition
    void modal.offsetWidth;

    modal.classList.add('show');
    backdrop.classList.add('show');
};

function closeModal() {
    const modal = document.getElementById('addStatusModal');
    const backdrop = document.querySelector('.modal-backdrop');

    modal.classList.remove('show');
    if (backdrop) {
        backdrop.classList.remove('show');
    }

    setTimeout(() => {
        modal.style.display = 'none';
        if (backdrop) {
            backdrop.remove();
        }
    }, 300);
};



