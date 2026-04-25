function initializePage(data) {
    console.log("Page initialized with data: ", data);
    getCurrentUser().then(user => {
        console.log('user: ', user);
        const formNoInput = document.getElementById("formNoInput");
        formNoInput.value = "GENERATED ON SUBMIT";
        document.getElementById("requesterNameInput").value = user.name;
        populateSelect('procurementDeptSelect', data.ProcurementDepartments, 'Id', 'Title');
        populateSelect('branchSelect', data.Branches, 'Id', 'Name', true);
        defaultDateInput();
    })
};

function populateSelect(selectId, items, valueField, textField, defaultOption = false) {
    const select = document.getElementById(selectId);
    if (!select || !items) return;
    
    if (defaultOption) {
        select.innerHTML = ''; // Clear existing options
        const firstOption = document.createElement('option');
        firstOption.value = '';
        firstOption.text = 'All';
        select.appendChild(firstOption);
    }
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueField];
        option.text = item[textField];
        select.appendChild(option);
    });
};

function defaultDateInput() {
    const now = new Date();
    const dateInput = document.getElementById("requestDateInput");
    const today = new Date().toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    dateInput.value = today;
    document.getElementById("startDate").value = today;
    document.getElementById("endDate").value = lastDay;
};
