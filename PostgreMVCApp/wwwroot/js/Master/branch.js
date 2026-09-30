const primaryKeyId = 'branchId';
const branchCodeId = 'branchCode';
const branchNameId = 'branchName';
const addBranchModalTitle = 'Add New Branch';
const updateBranchModalTitle = 'Update Branch';
const modalID = 'modal';
const backdropClassName = '.modal-backdrop';
let formControls = [];

const modalFormControls = [
    { id: 'branchCode', label: 'Code', jsonProp: 'code', readOnly: true },
    { id: 'branchName', label: 'Name', jsonProp: 'name', readOnly: false }
];

function createNewBranch() {
    saveUpdate(addBranchModalTitle, primaryKeyId, modalFormControls, createBranch);
};

async function editBranch(id) {
    const branch = await getBranchById(id);
    saveUpdate('update', updateBranchModalTitle, primaryKeyId, modalFormControls, updateBranchAsync, branch);
};

async function deleteBranch(id) {
    if (confirm('Are you sure you want to delete this branch?')) {
        await deleteBranchAsync(id);
        reloadPage();
    }
};

function saveUpdate(type, modalTitle, primaryKeyId, controls, callbackFunction, existingData = null, dropDownItems = null) {
    console.log("Action type: ", type);
    setupModalButton(callbackFunction);
    openModalDialog(type, modalTitle, primaryKeyId, controls, existingData, dropDownItems);
};

function generatePayload() {
    const payload = {};
    formControls.forEach(control => {
        const value = document.getElementById(control.id).value;
        payload[control.jsonProp] = value;
    });

    return payload;
};

function setupModalButton(callbackFunction) {
    const submitBtn = document.getElementById("btn-save");
    submitBtn.onclick = async () => {
        try {
            const payload = generatePayload();
            const response = await callbackFunction(payload);
            if (response.code !== 201 && response.code !== 200) {
                showErrorToast(response.message);
                return;
            }
            showSuccessToast(response.message);
            closeModal();
            reloadPage();
        } catch (err) {
            showErrorToast('Error: ' + err);
        }

    };
};

function openModalDialog(type, modalTitle, primaryKeyId, controls, existingData, dropDownItems = null) {
    formControls = controls;
    document.getElementById('modal-label').textContent = modalTitle;
    const modal = document.getElementById(modalID);
    modal.style.display = 'block';

    let backdrop = document.querySelector(backdropClassName);
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.classList.add('modal-backdrop');
        document.body.appendChild(backdrop);
    }

    // Trigger reflow to enable transition
    void modal.offsetWidth;

    modal.classList.add('show');
    backdrop.classList.add('show');
    renderModalBody(type, primaryKeyId, controls, existingData, dropDownItems);
};

function renderModalBody(type, primaryKeyId, controls, existingData = null, dropDownItems = null) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '';

    const primaryKeyInput = document.createElement('input');
    primaryKeyInput.type = 'hidden';
    primaryKeyInput.id = primaryKeyId;
    primaryKeyInput.name = primaryKeyId;

    modalBody.appendChild(primaryKeyInput);
    renderModalFormInputs(type, modalBody, controls, existingData);
};

function renderModalFormInputs(type, modalBody, controls, existingData = null) {
    controls.forEach(element => {
        const div = document.createElement('div');
        div.className = 'mb-3';

        const label = document.createElement('label');
        label.htmlFor = element.id;
        label.className = 'form-label';
        label.textContent = element.label;

        // const input = renderInput(element, existingData, dropDownItems);
        const input = renderInput(type, element, existingData);

        modalBody.appendChild(label);
        modalBody.appendChild(input);
    });
};

function renderInput(type, element, existingData = null) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control';
    input.id = element.id;
    input.name = element.id;
    let readOnly = false;
    if (type === 'delete') {
        readOnly = true;
    } else if (type === 'update') {
        readOnly = element.readOnly;
    }

    // input.readOnly = type == 'update' ? element.readOnly : false;
    input.readOnly = readOnly;
    input.required = true;
    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            enterHelper();
        }
    });

    if (existingData && typeof (existingData) == "object") {
        input.value = existingData[element.jsonProp];
    }

    return input;
};

function closeModal() {
    const modal = document.getElementById(modalID);
    const backdrop = document.querySelector(backdropClassName);

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