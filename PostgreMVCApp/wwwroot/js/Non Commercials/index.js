// the key is the module id
const filterByMapping = {
    1: ['Nintex No', 'Requester', 'Dealer Name'],
    2: ['Nintex No', 'Requester', 'Dealer Name', 'Vendor Name'],
    3: ['Nintex No', 'Requester', 'SAP PO Number', 'Vendor Name'],
    4: ['Nintex No', 'Requester', 'Material Anaplan', 'Vendor Name'],
    5: ['Nintex No', 'Requester', 'SAP PO Number', 'Vendor Name', 'Contract'],
    6: ['Nintex No', 'Requester', 'SAP PO Number', 'Vendor Name'],
};

const itemTableMapping = {
    1: "prTable",
    2: "qcfTable",
    3: "poTable",
    4: "contractTable",
    5: "poContractTable",
    6: "poReleaseTable",
};

let data = {};
let newFormUrl = "";

function getAntiForgeryToken() {
    return document.querySelector('input[name="__RequestVerificationToken"]')?.value;
};

function populateSelect(selectId, items, valueField, textField, defaultOption = false) {
    const select = document.getElementById(selectId);
    if (!select || !items) return;
    select.innerHTML = ''; // Clear existing options
    if (defaultOption) {
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

function hideAllContentTables() {
    const tables = document.querySelectorAll(".table-responsive");
    tables.forEach(table => {
        table.style.display = "none";
    });
};

function showTable(moduleID) {
    const tableId = itemTableMapping[moduleID];
    const table = document.getElementById(tableId);
    hideAllContentTables();
    if (table) {
        table.style.display = "block";
    }
};

async function initializePage() { 
    const indexData = await getNonCommercialData();
    data = indexData; // Store the fetched data in the global variable for later use
    console.log('Initializing page with data:', data);
    const moduleId = Number(indexData.modules[0].id);
    const module = indexData.modules.find(m => m.id === moduleId);
    newFormUrl = module.link;
    const filterFields = filterByMapping[moduleId] || [];
    populateSelect('searchBySelect', filterFields.map(field => ({ value: field, text: field })), 'value', 'text');
    showTable(moduleId);
    populateSelect('procurementDeptSelect', indexData.procurementDepartments, 'id', 'title', true);
    populateSelect('moduleSelect', indexData.modules, 'id', 'name');
    populateSelect('branchSelect', indexData.branches, 'id', 'name', true);
    populateSelect('statusSelect', indexData.statuses, 'id', 'name', true);
    const approverRoles = await getApproverRoles(moduleId); // Load approver roles for the first module by default)
    populateSelect('approverRoleSelect', approverRoles, 'id', 'name', true);
};

document.getElementById('moduleSelect').addEventListener('change', async function () {
    const moduleId = Number(this.value);
    const module = data.modules.find(m => m.id === moduleId);
    newFormUrl = module.link;
    showTable(moduleId);
    const showCreateBtn = [1, 4, 5].indexOf(moduleId) > -1;
    const btn = document.getElementById("createNewBtn");
    if (btn) {
        const display = (showCreateBtn) ? "inline-block" : "none";
        btn.style.display = display;
    }
    const approverRoles = await getApproverRoles(moduleId);
    populateSelect('approverRoleSelect', approverRoles, 'id', 'name', true);
});

function createNew(){
    window.open(newFormUrl, '_blank');
};
