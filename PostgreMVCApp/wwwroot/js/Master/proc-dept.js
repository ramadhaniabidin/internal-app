const primaryKeyId = 'procDeptId';
const contractTypeCodeId = 'procDeptCode';
const contractTypeNameId = 'procDeptName';
const addProcDeptTitle = 'Add New Procurement Department';
const updateProcDeptTitle = 'Update Procurement Department';

const modalFormControls = [
    { id: 'procDeptName', label: 'Name', jsonProp: 'title', inputType: 'text', readOnly: false },
    { id: 'procDeptCode', label: 'Code', jsonProp: 'code', inputType: 'text', readOnly: true },
    { id: 'procDeptApproverName', label: 'Approver Name', jsonProp: 'approver_Name', inputType: 'drop-down', readOnly: false },
    { id: 'procDeptApproverEmail', label: 'Approver Email', jsonProp: 'approver_Email', inputType: 'text', readOnly: true },
    { id: 'procDeptApproverAccount', label: 'Approver Account', jsonProp: 'approver_Account', inputType: 'text', readOnly: true },
    { id: 'procDeptCategory', label: 'Category', jsonProp: 'category', inputType: 'text', readOnly: false },
];

async function createNewProcDept() {
    const users = await getUsers();
    saveUpdate("create", addProcDeptTitle, primaryKeyId, modalFormControls, createProcDeptAsync, null, users);
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