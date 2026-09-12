const modalID = 'modal-select';
const backdropClassName = '.modal-backdrop';
let popUpItems = [];
let popUpModule = '';
let pageIndex = 1;
let pageSize = 5;
let totalPages = 0;
let popUpSearchBy = "";
let popUpKeyword = "";
let currentUser = {};

let tableColumns = [
    {
        "Module": "Vendor",
        "Columns": [
            { "Display": "Name", "DBColumn": "name" },
            { "Display": "Code", "DBColumn": "code" },
            { "Display": "Action", "DBColumn": "Action" }
        ]
    },

    {
        "Module": "Procurement Department",
        "Columns": [
            { "Display": "Procurement Department", "DBColumn": "procDeptName" },
            { "Display": "Branch", "DBColumn": "branchName" },
            { "Display": "Action", "DBColumn": "Action" }
        ]
    },

    {
        "Module": "Material Anaplan",
        "Columns": [
            { "Display": "Material Name", "DBColumn": "description" },
            { "Display": "Code", "DBColumn": "code" },
            { "Display": "Action", "DBColumn": "Action" }
        ]
    },
];


const modals = {
    'Vendor': {
        title: 'Select Vendor',
        endpoint: '/api/Vendor',
        targetFieldId: ['vendorNameInput', 'vendorCodeInput'],
        targetSourceColumn: ['name', 'code']
    },
    'Procurement Department': {
        title: 'Select Procurement Department',
        endpoint: '/api/UserProcDept',
        targetFieldId: ['procDeptNameInput', 'procDeptCodeInput', 'procDeptIdInput', 'branchNameInput', 'branchCodeInput', 'branchIdInpu'],
        targetSourceColumn: ['procDeptName', 'procDeptCode', 'procurementDepartmentId', 'branchName', 'branchCode', 'branchId']
    },
    'Material Anaplan': {
        title: 'Select Material Anaplan',
        endpoint: '/api/MaterialAnaplan',
        targetFieldId: ['materialDisplay', 'materialName', 'materialCode'],
        targetSourceColumn: ['display', 'description', 'code']
    },
};

let detailItemSchema = {
    id: 1,
    fields: [
        {
            name: "id",
            inputs: [
                { name: "id", type: 'text', value: 1, readOnly: true }
            ],
            type: "text", value: 1, readOnly: true
        },
        {
            name: "materialName",
            inputs: [
                { name: 'materialDisplay', type: 'text', value: "", readOnly: true, popUp: 'Material Anaplan' },
                { name: 'materialName', type: 'hidden', value: "", readOnly: false },
                { name: 'materialCode', type: 'hidden', value: "", readOnly: false }
            ],
            type: "text", value: "Laptop Stand"
        },
        {
            name: "contractAmount",
            inputs: [
                { name: "contractAmount", type: 'text', value: 0, readOnly: false }
            ],
            type: "text", value: 0
        },
        {
            name: "isVariableAmount",
            inputs: [
                { name: "isVariableAmount", type: 'checkbox', value: false, readOnly: false }
            ],
            type: "checkbox", value: false
        }
    ]
};

let detailItems = [
    detailItemSchema
];

function initializePage(data) {
    console.log("Page initialized with data: ", data);
    getCurrentUser().then(user => {
        currentUser = user;
        console.log('user: ', user);
        const formNoInput = document.getElementById("formNoInput");
        formNoInput.value = "GENERATED ON SUBMIT";
        document.getElementById("requesterNameInput").value = user.name;
        populateSelect('contractTypeSelect', data.ContractTypes, 'Id', 'Title');
        defaultDateInput();
        renderDetailItems();
        document.getElementById('btn-submit').onclick = () => {
            console.log('Submitted data: ', detailItems);
        };
    })
};

function renderDetailInput(inp, index) {
    let fieldValue;
    if (inp.name === 'id') {
        fieldValue = index + 1;
    } else {
        fieldValue = inp.value ?? '';
    }

    const input = document.createElement('input');
    const td = document.createElement('td');
    td.className = 'text-center align-middle';

    input.type = inp.type;
    input.name = `${inp.name}_${index}`;
    if (inp.readOnly) input.readOnly = true;
    if (inp.popUp) {
        input.onclick = () => {
            openModal(inp.popUp);
        };
    }

    if (inp.type === 'checkbox') {
        input.className = 'form-check-input';
        input.checked = Boolean(inp.value);
        input.addEventListener('change', (e) => {
            inp.value = e.target.checked;
        });
    } else {
        input.className = inp.name === 'id' ? 'text-center form-control' : 'form-control';
        input.value = fieldValue;
        input.addEventListener('input', (e) => {
            inp.value = e.target.value;
        });
    }
    return input;
};

function renderDetailItems() {
    const tbody = document.getElementById('detailTableBody');
    if (!tbody) return;

    tbody.replaceChildren();

    detailItems.forEach((detail, index) => {
        const tr = document.createElement('tr');

        detail.fields.forEach((field) => {
            const td = document.createElement('td');
            td.className = 'text-center align-middle';
            field.inputs.forEach(inp => {
                const input = renderDetailInput(inp, index);
                td.appendChild(input);
            });
            tr.appendChild(td);
        });

        tr.appendChild(renderDeleteAction(index));
        tbody.appendChild(tr);
    });
};

function addDetailItem() {
    const newItem = {
        id: Date.now(),
        fields: structuredClone(detailItemSchema.fields)
    };

    detailItems.push(newItem);
    renderDetailItems();
};

function deleteDetailItem(index) {
    detailItems.splice(index, 1);
    renderDetailItems();
};

function renderDeleteAction(index) {
    const td = document.createElement('td');
    td.className = 'text-center';

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-trash';

    const button = document.createElement('button');
    button.className = 'btn btn-sm btn-danger';
    button.type = 'button';

    button.onclick = () => {
        deleteDetailItem(index);
    };

    if (index === 0) {
        button.disabled = true;
    }

    button.appendChild(icon);
    td.appendChild(button);
    return td;
};

function selectItemPopUp(item) {
    const targetFields = modals[popUpModule].targetFieldId;
    const targetSourceColumns = modals[popUpModule].targetSourceColumn;

    for (let i = 0; i < targetFields.length; i++) {
        const fieldId = targetFields[i];
        const fieldValue = item[targetSourceColumns[i]];
        $("#" + fieldId).val(fieldValue);
    }

    closeModal();
};

function selectItemPopUpDetail(item, index) {
    const targetFields = modals[popUpModule].targetFieldId;
    const targetSourceColumns = modals[popUpModule].targetSourceColumn;

    for (let i = 0; i < targetFields.length; i++) {
        const fieldId = targetFields[i] + `_${index}`;
        const fieldValue = item[targetSourceColumns[i]];
        $("#" + fieldId).val(fieldValue);
    }

    closeModal();
};

function populateSelect(selectId, items, valueField, textField, defaultOption = false) {
    const select = document.getElementById(selectId);
    if (!select || !items) return;

    if (defaultOption) {
        select.innerHTML = '';
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

    setTimeout(() => {
        $(select).select2({
            theme: 'bootstrap-5', // Integrates Bootstrap form-select styles
            width: '100%',         // Ensures full-width alignment
            dropdownParent: $(select).parent()
        });
    }, 0);
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

function displayModalFooterText(totalCount, pageSize, pageIndex) {
    const totalPage = Math.ceil(totalCount / pageSize);
    const textFooter = document.getElementById("footer-text");
    textFooter.textContent = `Page ${pageIndex} of ${totalPage} : ${totalCount} records`;
};

async function popUpVendorNext() {
    if (pageIndex < totalPages) {
        pageIndex++;
    }
    const modal = modals[popUpModule];
    popUpItems = await fetchPopUpItems();
    appendTableBody(popUpItems.items, index);
    displayModalFooterText(popUpItems.totalCount, pageSize, pageIndex);
};

async function popUpVendorPrev() {
    if (pageIndex > 1) {
        pageIndex--;
    }
    const modal = modals[popUpModule];
    popUpItems = await fetchPopUpItems();
    appendTableBody(popUpItems.items);
    displayModalFooterText(popUpItems.totalCount, pageSize, pageIndex);
};

function openModalDialog(module) {
    const modalTitle = modals[module].title;
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

    document.getElementById('modal-body').innerHTML = "";
};

async function openModal(module) {
    popUpModule = module;
    const modal = modals[module];
    console.log('modal meta data: ', modal);
    openModalDialog(module);
    renderModalSearchForm();

    popUpItems = await fetchPopUpItems();
    totalPages = popUpItems.totalPages;

    renderModalBody(popUpItems.items, popUpItems.pageNumber, popUpItems.pageSize, popUpItems.totalCount);

    document.getElementById("popUpSearchKeyword").addEventListener("keydown", async function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission if inside a form
            await search();
        }
    });

};

function renderModalBody(items, pageIndex, pageSize, totalCount) {
    const modalBody = document.getElementById('modal-body');
    const tableDiv = document.createElement("div");
    tableDiv.className = "table-responsive";
    tableDiv.id = "table-div";

    const table = document.createElement("table");
    table.className = "table table-hover mb-0";

    const thead = renderPopUpBodyTableHead();

    const tbody = document.createElement("tbody");
    tbody.id = "pop-up-table-body";



    table.appendChild(thead);
    table.appendChild(tbody);

    

    tableDiv.appendChild(table);
    modalBody.appendChild(tbody);
    appendTableBody(items);
    displayModalFooterText(totalCount, pageSize, pageIndex);





    // const tableDiv = renderPopUpBodyTableWrapper(items);
    // modalBody.appendChild(tableDiv);
    // displayModalFooterText(totalCount, pageSize, pageIndex);
};

function renderPopUpBodyTableWrapper(items) {
    const thead = renderPopUpBodyTableHead();
    const tbody = renderPopUpTableBody(items);
    const tableDiv = document.createElement("div");
    tableDiv.className = "table-responsive";
    tableDiv.id = "table-div";

    const table = document.createElement("table");
    table.className = "table table-hover mb-0";

    table.appendChild(thead);
    table.appendChild(tbody);

    tableDiv.appendChild(table);

    return tableDiv;
};

function renderPopUpBodyTableHead() {
    const columns = tableColumns.find(t => t.Module === popUpModule).Columns;
    const thead = document.createElement("thead");
    thead.className = "table-light";
    const tr = document.createElement("tr");
    for (const column of columns) {
        const th = document.createElement("th");
        th.innerHTML = column.Display;
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    return thead;
};

function renderPopUpTableBody(items) {
    const columns = tableColumns.find(t => t.Module === popUpModule).Columns;
    const tbody = document.createElement("tbody");
    tbody.id = "pop-up-table-body";
    for (const item of items) {
        const tr1 = document.createElement("tr");
        for (const column of columns) {
            const td = document.createElement("td");
            const text = item[column.DBColumn];

            if (text) {
                td.textContent = text;
            } else {
                td.appendChild(generateButtonSelect(item));
            }

            tr1.appendChild(td);
        }
        tbody.appendChild(tr1);
    }
    return tbody;
};

function appendTableBody(items) {
    const columns = tableColumns.find(t => t.Module === popUpModule).Columns;
    document.getElementById("pop-up-table-body").innerHTML = '';
    const tbody = document.getElementById("pop-up-table-body");
    for (const item of items) {
        const tr1 = document.createElement("tr");
        for (const column of columns) {
            const td = document.createElement("td");
            const text = item[column.DBColumn];

            if (text) {
                td.textContent = text;
            } else {
                td.appendChild(generateButtonSelect(item));
            }

            tr1.appendChild(td);
        }
        tbody.appendChild(tr1);
    }
};

function generateButtonSelect(item) {
    console.log('pop up module: ', popUpModule);
    const button = document.createElement("button");
    button.innerHTML = "SELECT";
    button.className = "btn btn-primary";
    button.type = "button";

    if (popUpModule === 'Material Anaplan') {
        button.onclick = () => {
            selectItemPopUpDetail(item);
        };
    }
    else {
        button.onclick = function () {
            selectItemPopUp(item);
        };
    }
    return button;
};

async function fetchPopUpItems() {
    if (popUpModule === 'Procurement Department') {
        popUpSearchBy += ';Email';
        popUpKeyword += ';' + currentUser['email'];
    }

    const modal = modals[popUpModule];
    let items = await getVendors(pageIndex, popUpSearchBy, popUpKeyword, modal.endpoint);
    console.log('Items: ', items);
    return items;
};

function renderModalSearchFormInput() {
    const formInput = document.createElement("input");
    formInput.type = "text";
    formInput.className = "form-control";
    formInput.style.width = "250px";
    formInput.style.marginRight = "10px";
    formInput.name = "search";
    formInput.id = "popUpSearchKeyword"
    return formInput;
};

function renderModalSearchFormButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-secondary";
    button.textContent = "Search";
    button.id = "modal-search-button";
    button.onclick = search;
    return button;
};

function renderModalSearchFormSelect(columns) {
    const select = document.createElement("select");
    select.className = "form-select";
    select.style.marginRight = "10px";
    select.id = "popUpSearchBy";

    for (const column of columns.filter(c => c.Display !== "Action")) {
        const option = document.createElement("option");
        option.selected = true;
        option.textContent = column.Display;
        option.value = column.Display;

        select.appendChild(option);
    }
    return select;
};

function renderModalSearchForm() {
    const columns = tableColumns.find(t => t.Module === popUpModule).Columns;

    const wrapper = document.createElement("div");
    wrapper.className = "d-flex gap-2";
    wrapper.style.marginBottom = "10px";

    const select = renderModalSearchFormSelect(columns);

    const form = document.createElement("form");
    form.className = "d-flex";

    const formInput = renderModalSearchFormInput();
    const button = renderModalSearchFormButton();

    form.appendChild(select);
    form.appendChild(formInput);
    form.appendChild(button);

    wrapper.appendChild(form);

    document.getElementById("modal-body").appendChild(wrapper);

    popUpSearchBy = document.getElementById("popUpSearchBy").value;
    popUpKeyword = document.getElementById("popUpSearchKeyword").value;
};



function closeModal() {
    pageIndex = 1;
    totalPages = 0;
    popUpSearchBy = "";
    popUpKeyword = "";

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



async function search(index) {
    const modal = modals[popUpModule];
    popUpSearchBy = document.getElementById("popUpSearchBy").value;
    popUpKeyword = document.getElementById("popUpSearchKeyword").value;
    popUpItems = await fetchPopUpItems();
    appendTableBody(popUpItems.items, index);
    displayModalFooterText(popUpItems.totalCount, pageSize, pageIndex);
};