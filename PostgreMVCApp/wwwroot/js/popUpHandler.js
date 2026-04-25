const modalID = 'modal';
const backdropClassName = '.modal-backdrop';
let formControls = [];
let buttonId = "";

function renderModalBody(primaryKeyId, controls, existingData = null) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '';

    const primaryKeyInput = document.createElement('input');
    primaryKeyInput.type = 'hidden';
    primaryKeyInput.id = primaryKeyId;
    primaryKeyInput.name = primaryKeyId;

    modalBody.appendChild(primaryKeyInput);
    renderModalFormInputs(modalBody, controls, existingData);
};

function renderModalFormInputs(modalBody, controls, existingData = null) {
    controls.forEach(element => {
        const div = document.createElement('div');
        div.className = 'mb-3';

        const label = document.createElement('label');
        label.htmlFor = element.id;
        label.className = 'form-label';
        label.textContent = element.label;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control';
        input.id = element.id;
        input.name = element.id;
        input.required = true;

        if (existingData && typeof (existingData) == "object") {
            input.value = existingData[element.jsonProp];
        }

        modalBody.appendChild(label);
        modalBody.appendChild(input);
    });
};

function openModal(modalTitle, primaryKeyId, controls, btnDisplayId, existingData = null) {
    formControls = controls;
    buttonId = btnDisplayId;
    document.getElementById('modal-label').textContent = modalTitle;
    const modal = document.getElementById(modalID);
    modal.style.display = 'block';

    // Create and show backdrop
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

    renderModalBody(primaryKeyId, controls, existingData);
    document.getElementById(buttonId).style.display = "block";
};


function closeModal() {
    const modal = document.getElementById(modalID);
    const backdrop = document.querySelector(backdropClassName);
    document.getElementById(buttonId).style.display = "none";

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

function generatePayload() {
    const payload = {};
    formControls.forEach(control => {
        const value = document.getElementById(control.id).value;
        payload[control.jsonProp] = value;
    });

    return payload;
};

async function saveBranch() {
    const payload = generatePayload();
    await createBranch(payload);
    closeModal();
    reloadPage();
};

async function updateBranch() {
    const payload = generatePayload();
    await updateBranchAsync(payload);
    closeModal();
    reloadPage();
};

function reloadPage() {
    setTimeout(() => {
        globalThis.location.reload();
    }, 5000);
};