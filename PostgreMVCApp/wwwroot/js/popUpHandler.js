const modalID = 'modal';
const backdropClassName = '.modal-backdrop';
let formControls = [];
let buttonId = "";

function renderModalBody(type, primaryKeyId, controls, existingData = null, dropDownItems = null) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = '';

    const primaryKeyInput = document.createElement('input');
    primaryKeyInput.type = 'hidden';
    primaryKeyInput.id = primaryKeyId;
    primaryKeyInput.name = primaryKeyId;

    modalBody.appendChild(primaryKeyInput);
    renderModalFormInputs(type, modalBody, controls, existingData, dropDownItems);
};

function renderInput(type, element, existingData = null, dropDownItems = null) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control';
    input.id = element.id;
    input.name = element.id;
    input.readOnly = (type === "update") ? element.readOnly : false;
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

function renderDropDown(type, element, existingData, dropDownItems) {
    if (dropDownItems) {
        console.log("Drop down items: ", dropDownItems);
    }

    const ddl = document.createElement('select');
    ddl.className = 'form-select';
    ddl.id = element.id;
    ddl.required = true;

    for (const item of dropDownItems.items) {
        const option = document.createElement('option');
        option.text = item["fullName"];
        option.value = item["id"];
        option.selected = (existingData) ?  item["fullName"] === existingData[element.jsonProp] : false;

        ddl.appendChild(option);
    }

    ddl.onchange = () => {
        onChangeApproverName(ddl.value, dropDownItems.items);
    };

    setTimeout(() => {
        $("#" + ddl.id).select2({
            dropdownParent: $("#" + ddl.id).parent() // Keeps select2 styling inside modals/grids if applicable
        });
    }, 0);

    return ddl;

};

function onChangeApproverName(id, items){
    const approver = items.find(i => i.id === Number(id));
    console.log("Selected approver: ", approver);
    $("#procDeptApproverEmail").val(approver.email);
    $("#procDeptApproverAccount").val(approver.username);
};

function renderModalFormInputs(type, modalBody, controls, existingData = null, dropDownItems = null) {
    controls.forEach(element => {
        const div = document.createElement('div');
        div.className = 'mb-3';

        const label = document.createElement('label');
        label.htmlFor = element.id;
        label.className = 'form-label';
        label.textContent = element.label;

        // const input = renderInput(element, existingData, dropDownItems);
        const input = element.inputType === "text" ?
            renderInput(type, element, existingData, dropDownItems) :
            renderDropDown(type, element, existingData, dropDownItems);

        modalBody.appendChild(label);
        modalBody.appendChild(input);
    });
};

function openModal(modalTitle, primaryKeyId, controls, btnDisplayId, existingData = null, dropDownItems = null) {
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

    renderModalBody(primaryKeyId, controls, existingData, dropDownItems);
    document.getElementById(buttonId).style.display = "block";
};

function saveUpdate(type, modalTitle, primaryKeyId, controls, callbackFunction, existingData = null, dropDownItems = null) {
    console.log("Action type: ", type);
    setupModalButton(callbackFunction);
    openModalDialog(type, modalTitle, primaryKeyId, controls, existingData, dropDownItems);
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

function generatePayload() {
    const payload = {};
    formControls.forEach(control => {
        const value = document.getElementById(control.id).value;
        payload[control.jsonProp] = value;
    });

    return payload;
};

async function saveContractType() {
    const payload = generatePayload();
    await createContractTypeAsync(payload);
    closeModal();
    reloadPage();
};

async function updateContractType() {
    const payload = generatePayload();
    await updateContractTypeAsync(payload);
    closeModal();
    reloadPage();
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
            showErrorToast('Error: ' + error);
        }

    };
};

function enterHelper() {
    const submitBtn = document.getElementById("btn-save");
    submitBtn.click();
};

function reloadPage() {
    setTimeout(() => {
        globalThis.location.reload();
    }, 5000);
};