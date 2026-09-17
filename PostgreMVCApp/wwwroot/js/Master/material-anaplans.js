const modalID = 'modal-select';
const backdropClassName = '.modal-backdrop';
let popUpItems = [];
let popUpModule = '';
let pageIndex = 1;
let pageSize = 5;
let totalPages = 0;
let popUpSearchBy = "";
let popUpKeyword = "";
const contentType = 'application/json';
const postMethod = 'POST';
const getMethod = 'GET';
const putMethod = 'PUT';
const deleteMethod = 'DELETE';


const modals = {
    'General Ledgers': {
        title: 'Select General Ledger',
        endpoint: '/api/GeneralLedger',
        targetFieldId: ['glCodeInput', 'glDescriptionInput', 'glIdInput'],
        targetSourceColumn: ['code', 'description', 'id']
    },
    'Procurement Department': {
        title: 'Select Procurement Department',
        endpoint: '/api/ProcurementDepartment',
        targetFieldId: ['procDeptNameInput', 'procDeptCodeInput', 'procDeptIdInput'],
        targetSourceColumn: ['title', 'code', 'id']
    },
};

const tableColumns = [
    {
        "Module": "General Ledgers", "Columns": [
            { "Display": "Name", "DBColumn": "description" },
            { "Display": "Code", "DBColumn": "code" },
            { "Display": "Action", "DBColumn": "Action" }
        ]
    },

    {
        "Module": "Procurement Department", "Columns": [
            { "Display": "Name", "DBColumn": "title" },
            { "Display": "Code", "DBColumn": "code" },
            { "Display": "Action", "DBColumn": "Action" }
        ]
    },
];

async function submitMaterial() {
    const payload = {
        Code: $("#codeInput").val(),
        Description: $("#descriptionInput").val(),
        GeneralLedgerId: $("#glIdInput").val(),
        ProcurementDepartmentId: $("#procDeptIdInput").val()
    };
    console.log('Payload: ', payload);
    await submitMaterialAsync(payload);
};

async function editMaterial() {
    const payload = {
        Code: $("#codeInput").val(),
        Description: $("#descriptionInput").val(),
        GeneralLedgerId: $("#glIdInput").val(),
        ProcurementDepartmentId: $("#procDeptIdInput").val(),
        ValuationClass: $("#valuationClassInput").val()
    };
    console.log('Payload: ', payload);
    await editMaterialAsync(payload);
};

async function deleteMaterial(id) {
    if (confirm('Are you sure want to delete this material?')) {
        await deleteMaterialAsync(id);
    }
};

async function submitMaterialAsync(payload) {
    try {
        const token = await getToken();
        const endpoint = generateEndpoint(null, null, null, '/api/MaterialAnaplan');
        console.log('endpoint: ', endpoint);
        const response = await fetch(endpoint, {
            method: postMethod,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            showErrorToast(errorMessage);
            return;
        }
        showSuccessToast('Success create Material Anaplan');
        closeModal();
        goToMasterPage();
    } catch (err) {
        showErrorToast(err);
    }
};

async function editMaterialAsync(payload) {
    try {
        const token = await getToken();
        const endpoint = generateEndpoint(null, null, null, '/api/MaterialAnaplan');
        console.log('endpoint: ', endpoint);
        const response = await fetch(endpoint, {
            method: putMethod,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            showErrorToast(errorMessage);
            return;
        }
        showSuccessToast('Success edit Material Anaplan');
        closeModal();
        goToMasterPage();
    } catch (err) {
        showErrorToast(err);
    }
};

async function deleteMaterialAsync(id) {
    try {
        const token = await getToken();
        const endpoint = new URL(`${baseUrl}/api/MaterialAnaplan/id/${id}`);
        console.log('endpoint: ', endpoint);
        const response = await fetch(endpoint, {
            method: deleteMethod,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType
            }
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            showErrorToast(errorMessage);
            return;
        }
        showSuccessToast('Success delete Material Anaplan');
        closeModal();
        goToMasterPage();
    } catch (err) {
        console.error("Error deleting material anaplan:", err);
    }
};

function goToMasterPage() {
    setTimeout(() => {
        globalThis.location.href = '/Master/MaterialAnaplans'
    }, 5000);
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

function openModalDialog(module) {
    const modalTitle = modals[module].title;
    document.getElementById('modal-label').textContent = modalTitle;
    const modal = document.getElementById(modalID);
    modal.style.display = 'block';

    let backdrop = document.querySelector(backdropClassName);
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.classList.add('modal-backdrop');
        document.body.appendChild(backdrop);
    }

    void modal.offsetWidth;
    modal.classList.add('show');
    backdrop.classList.add('show');
    document.getElementById('modal-body').innerHTML = "";
};

function renderModalBody(items, pageIndex, pageSize, totalCount) {
    const modalBody = document.getElementById('modal-body');
    const tableDiv = renderPopUpBodyTableWrapper(items);
    modalBody.appendChild(tableDiv);
    displayModalFooterText(totalCount, pageSize, pageIndex);
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

function generateButtonSelect(item) {
    const button = document.createElement("button");
    button.innerHTML = "SELECT";
    button.className = "btn btn-primary";
    button.type = "button";
    button.onclick = function () {
        selectItemPopUp(item);
    };
    return button;
};

async function search() {
    popUpSearchBy = document.getElementById("popUpSearchBy").value;
    popUpKeyword = document.getElementById("popUpSearchKeyword").value;
    popUpItems = await fetchPopUpItems();
    appendTableBody(popUpItems.items);
    displayModalFooterText(popUpItems.totalCount, pageSize, pageIndex);
};

async function popUpNext() {
    if (pageIndex < totalPages) {
        pageIndex++;
    }
    const modal = modals[popUpModule];
    popUpItems = await fetchPopUpItems();
    appendTableBody(popUpItems.items);
    displayModalFooterText(popUpItems.totalCount, pageSize, pageIndex);
};

async function popUpPrev() {
    if (pageIndex > 1) {
        pageIndex--;
    }
    const modal = modals[popUpModule];
    popUpItems = await fetchPopUpItems();
    appendTableBody(popUpItems.items);
    displayModalFooterText(popUpItems.totalCount, pageSize, pageIndex);
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

function displayModalFooterText(totalCount, pageSize, pageIndex) {
    const totalPage = Math.ceil(totalCount / pageSize);
    const textFooter = document.getElementById("footer-text");
    textFooter.textContent = `Page ${pageIndex} of ${totalPage} : ${totalCount} records`;
};

async function fetchPopUpItems() {
    const modal = modals[popUpModule];
    let items = await getPopUpItems(pageIndex, popUpSearchBy, popUpKeyword, modal.endpoint);
    console.log('Items: ', items);
    return items;
};

async function getPopUpItems(pageIndex, searchBy, keyWord, path) {
    console.log('Search by: ', searchBy);
    console.log('Keyword: ', keyWord);
    try {
        const token = await getToken();
        const endpoint = generateEndpoint(pageIndex, searchBy, keyWord, path);
        console.log('endpoint: ', endpoint);
        const response = await fetch(endpoint, {
            method: getMethod,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': contentType
            }
        });

        if (!response.ok) {
            return emptyItems;
        }

        const result = await response.json();
        return result;
    } catch (err) {
        console.error("Error fetching vendors:", err);
    }
};

function generateEndpoint(pageIndex, searchBy, keyWord, path) {
    const url = new URL(`${baseUrl}${path}`);

    if (pageIndex) {
        url.searchParams.append('pageNumber', pageIndex);
        url.searchParams.append('pageSize', 5);
    }

    if (keyWord) {
        url.searchParams.append('keyword', keyWord);
    }

    if (searchBy) {
        url.searchParams.append('searchBy', searchBy);
    }

    return url.toString().replace(/\+/g, '%20');
};