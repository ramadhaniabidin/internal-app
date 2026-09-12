const contentType = 'application/json';
const postMethod = 'POST';
const getMethod = 'GET';
const putMethod = 'PUT';
const deleteMethod = 'DELETE';
const modalID = 'modal';
const backdropClassName = '.modal-backdrop';
const addNewItemTitle = 'Add General Ledger';
const updateItemTitle = 'Update General Ledger';
const deleteItemTitle = 'Delete General Ledger';
const primaryKeyId = 'generalLedgerId';
const apiEndpoint = `http://localhost:30001/api/GeneralLedger`;
let formControls = [];
let action = "";

const modalFormControls = [
    { id: 'code', label: 'Code', jsonProp: 'code', inputType: 'text', readOnly: true },
    { id: 'description', label: 'Description', jsonProp: 'description', inputType: 'text', readOnly: false },
];

async function createNew() {
    saveUpdate("create", addNewItemTitle, primaryKeyId, modalFormControls,
        create, null
    );
};

async function updateGL(id) {
    const gl = await getGlById(id);
    saveUpdate('update', updateItemTitle, primaryKeyId, modalFormControls, update, gl);
};

async function deleteGL(id) {
    const gl = await getGlById(id);
    deleteAction(deleteItemTitle, id, modalFormControls, deleteAsync, gl);
};

async function create(payload) {
    try {
        const token = await getToken();
        const response = await fetch(`${apiEndpoint}`, {
            method: postMethod,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            return { code: response.status, message: errorMessage };
        }
        return { code: 201, message: "Success creating general ledger" };
    } catch (error) {
        return { code: 500, message: error };
    }
};

async function update(payload) {
    try {
        const token = await getToken();
        const response = await fetch(`${apiEndpoint}`, {
            method: putMethod,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            return { code: response.status, message: errorMessage };
        }
        return { code: 201, message: "Success updating general ledger" };
    } catch (error) {
        return { code: 500, message: error };
    }
};

async function deleteAsync(id) {
    try {
        const token = await getToken();
        const response = await fetch(`${apiEndpoint}/id/${encodeURIComponent(id)}`, {
            method: deleteMethod,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType
            }
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            return { code: response.status, message: errorMessage };
        }
        return { code: 201, message: "Success deleting general ledger" };
    } catch (error) {
        return { code: 500, message: error };
    }
};

async function getGlById(id) {
    try {
        const token = await getToken();
        const response = await fetch(`${apiEndpoint}/id/${encodeURIComponent(id)}`, {
            method: getMethod,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType
            }
        });
        if (!response.ok) throw new Error(`Failed to fetch general ledger with id: ${id}`);
        return await response.json();
    } catch (err) {
        console.error("Error fetching general ledger:", err);
    }
};

function saveUpdate(actionType, modalTitle, primaryKeyId, controls, callbackFunction, existingData = null, dropDownItems = null) {
    action = actionType;
    setupModalButton(callbackFunction);
    openModalDialog(actionType, modalTitle, primaryKeyId, controls, existingData, dropDownItems);
};

function deleteAction(modalTitle, id, controls, callbackFunction, existingData = null){
    setupDeleteButton(callbackFunction, id);
    openModalDialog('delete', modalTitle, primaryKeyId, controls, existingData, null);
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
    renderModalFormInputs(type, modalBody, controls, existingData, dropDownItems);
};

function renderModalFormInputs(type, modalBody, controls, existingData = null, dropDownItems = null) {
    controls.forEach(element => {
        const div = document.createElement('div');
        div.className = 'mb-3';

        const label = document.createElement('label');
        label.htmlFor = element.id;
        label.className = 'form-label';
        label.textContent = element.label;

        const input = renderInput(type, element, existingData, dropDownItems);
        modalBody.appendChild(label);
        modalBody.appendChild(input);
    });
};

function renderInput(type, element, existingData = null, dropDownItems = null) {
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

function enterHelper() {
    const submitBtn = document.getElementById("btn-save");
    submitBtn.click();
};

function setupModalButton(callbackFunction) {
    const submitBtn = document.getElementById("btn-save");
    submitBtn.onclick = async () => {
        try {
            const payload = generatePayload();
            const validation = validatePayload(payload);
            if (validation.error) {
                showErrorToast(validation.message);
                return;
            }

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

function setupDeleteButton(callbackFunction, id) {
    const submitBtn = document.getElementById("btn-save");
    submitBtn.className = 'btn btn-danger';
    submitBtn.onclick = async () => {
        try {
            const response = await callbackFunction(id);
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

function reloadPage() {
    setTimeout(() => {
        globalThis.location.reload();
    }, 5000);
};

function generatePayload() {
    const payload = {};
    modalFormControls.filter(c => c.jsonProp).forEach(control => {
        const value = document.getElementById(control.id).value;
        payload[control.jsonProp] = value;
    });
    console.log('payload: ', payload);
    return payload;
};

function validatePayload(payload) {
    const validation = { 'error': false, message: 'OK' };
    if (!payload.code) {
        validation.error = true;
        validation.message = 'Code is required!';
        return validation;
    }
    if (!payload.description) {
        validation.error = true;
        validation.message = 'Description is required!';
        return validation;
    }
    return validation;
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