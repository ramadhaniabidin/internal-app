const primaryKeyId = 'userProcDeptId';
const userProcDeptId = 'userProcDeptCode';
const contractTypeNameId = 'contractTypeName';
const addNewItemTitle = 'Add New User Procurement Department';
const updateItemTitle = 'Update Procurement Department';
const modalID = 'modal';
const backdropClassName = '.modal-backdrop';
let formControls = [];
let buttonId = "";
const contentType = 'application/json';
const postMethod = 'POST';
const getMethod = 'GET';
const putMethod = 'PUT';
const deleteMethod = 'DELETE';

const modalFormControls = [
    { id: 'userName', label: 'User', jsonProp: '', inputType: 'drop-down', readOnly: false },
    { id: 'userAccount', label: 'User Account', jsonProp: '', inputType: 'text', readOnly: true },
    { id: 'userEmail', label: 'User Email', jsonProp: '', inputType: 'text', readOnly: true },
    { id: 'userId', label: 'User Id', jsonProp: 'userId', inputType: 'text', readOnly: true },
    { id: 'procDeptName', label: 'Procurement Department', jsonProp: '', inputType: 'drop-down', readOnly: false },
    { id: 'procDeptCode', label: 'Procurement Department Code', jsonProp: '', inputType: 'text', readOnly: true },
    { id: 'procDeptId', label: 'Procurement Department Id', jsonProp: 'procurementDepartmentId', inputType: 'text', readOnly: true },
    { id: 'branchName', label: 'Branch', jsonProp: '', inputType: 'drop-down', readOnly: false },
    { id: 'branchCode', label: 'Branch Code', jsonProp: '', inputType: 'text', readOnly: true },
    { id: 'branchId', label: 'Branch Id', jsonProp: 'branchId', inputType: 'text', readOnly: true },
];

const dropDownControls = [
    { title: 'Procurement Department', jsonProp: 'procDepts', displayText: 'title', value: 'id' },
    { title: 'User', jsonProp: 'users', displayText: 'fullName', value: 'id' },
    { title: 'Branch', jsonProp: 'branches', displayText: 'name', value: 'id' }
];

const dropDownSelectMapping = [
    { title: 'User', targetId: ['userEmail', 'userAccount', 'userId'], targetValue: ['email', 'username', 'id'] },
    { title: 'Procurement Department', targetId: ['procDeptCode', 'procDeptId'], targetValue: ['code', 'id'] },
    { title: 'Branch', targetId: ['branchCode', 'branchId'], targetValue: ['code', 'id'] }
];

const firstDropDownOption = {
    'Procurement Department': {
        approver: {},
        approver_Id: null,
        category: null,
        code: '',
        created_Date: null,
        id: null,
        is_Active: null,
        title: 'Please Select'
    },

    'Branch': {
        name: 'Please Select',
        code: '',
        id: null,
        isActive: null
    },

    'User': {
        fullName: 'Please Select',
        department: '',
        id: null,
        isActive: null,
        division: '',
        email: '',
        role: '',
        username: ''
    },
};

async function getDropDownItems(path) {
    try {
        const token = await getToken();
        const response = await fetch(`${baseUrl}/api/${path}?pageSize=20`, {
            method: getMethod,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType
            }
        });
        if (!response.ok) throw new Error(`Failed to fetch items`);
        return await response.json();
    } catch (err) {
        console.error("Error fetching items:", error);
    }
};

async function create(payload) {
    try {
        const token = await getToken();
        const response = await fetch(`${baseUrl}/api/UserProcDept`, {
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
        return { code: 201, message: "Success creating user procurement department" };
    } catch (error) {
        return { code: 500, message: error };
    }
};

async function createNew() {
    const users = await getDropDownItems('User');
    const branches = await getDropDownItems('Branch');
    const procDepts = await getDropDownItems('ProcurementDepartment');
    const dropDown = { 'users': users, 'branches': branches, 'procDepts': procDepts };
    saveUpdate("create", addNewItemTitle, primaryKeyId, modalFormControls, create, null, dropDown);
};

async function editProcDept(id) {
    const procDept = await getProcDeptById(id);
    const users = await getUsers();
    saveUpdate("update", updateProcDeptTitle, primaryKeyId, modalFormControls, updateProcDeptAsync, procDept, users);
};

async function deleteProcDept(id) {
    if (confirm('Are you sure you want to delete this procurement department?')) {
        await deleteAsync(id);
        reloadPage();
    }
};

function saveUpdate(type, modalTitle, primaryKeyId, controls, callbackFunction, existingData = null, dropDownItems = null) {
    console.log("Action type: ", type);
    setupModalButton(callbackFunction);
    openModalDialog(type, modalTitle, primaryKeyId, controls, existingData, dropDownItems);
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

function validatePayload(payload) {
    const validation = { 'error': false, message: 'OK' };
    if (!payload.branchId) {
        validation.error = true;
        validation.message = 'Branch is required!';
    }
    if (!payload.procurementDepartmentId) {
        validation.error = true;
        validation.message = 'Procurement Department is required!';
    }
    if (!payload.userId) {
        validation.error = true;
        validation.message = 'User is required!';
    }
    return validation;
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

        // const input = renderInput(element, existingData, dropDownItems);
        const input = element.inputType === "text" ?
            renderInput(type, element, existingData, dropDownItems) :
            renderDropDown(element, existingData, dropDownItems);

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
    input.readOnly = element.readOnly;
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

function renderDropDownSelect(element) {
    const ddl = document.createElement('select');
    ddl.className = 'form-select';
    ddl.id = element.id;
    ddl.required = true;
    return ddl;
};

function renderDropDown(element, existingData, dropDownItems) {
    const ddl = renderDropDownSelect(element);
    const dropDownControl = dropDownControls.find(d => d.title === element.label);
    const firstOption = firstDropDownOption[dropDownControl.title];
    const items = dropDownItems[dropDownControl.jsonProp].items;
    items.unshift(firstOption);
    renderDropDownOptions(ddl, items, dropDownControl, existingData);
    ddl.onchange = () => {
        onChangeDropDown(ddl.value, items, element.label);
    };
    setTimeout(() => {
        $(ddl).select2({
            dropdownParent: $(ddl).parent(),
            theme: 'bootstrap-5', // Integrates Bootstrap form-select styles
            width: '100%'
        });
    }, 0);
    return ddl;
};

function renderDropDownOptions(dropDown, items, dropDownControl, existingData) {
    for (const item of items) {
        const displayKey = dropDownControl['displayText'];
        const valueKey = dropDownControl['value'];
        const option = document.createElement('option');
        option.text = item[displayKey];
        option.value = item[valueKey];
        option.selected = (existingData) ? item[displayKey] === existingData[dropDownControl[displayKey]] : false;
        dropDown.appendChild(option);
    }
};

function renderDropDownUserOptions(dropDown, items, existingData, element) {
    for (const item of items) {
        const option = document.createElement('option');
        option.text = item["fullName"];
        option.value = item["id"];
        option.selected = (existingData) ? item["fullName"] === existingData[element.jsonProp] : false;
        dropDown.appendChild(option);
    }
};

function onChangeUserName(id, items) {
    const approver = items.find(i => i.id === Number(id));
    $("#userEmail").val(approver.email);
    $("#userAccount").val(approver.username);
    $("#userId").val(approver.id);
};

function onChangeDropDown(id, items, label) {
    const mapping = dropDownSelectMapping.find(m => m.title === label);
    const obj = items.find(i => i.id === Number(id));
    for (let i = 0; i < mapping.targetId.length; i++) {
        $("#" + mapping.targetId[i]).val(obj[mapping.targetValue[i]]);
    }
};