const primaryKeyId = 'branchId';
const branchCodeId = 'branchCode';
const branchNameId = 'branchName';
const addBranchModalTitle = 'Add New Branch';
const updateBranchModalTitle = 'Update Branch';

const modalFormControls = [
    { id: 'branchName', label: 'Name', jsonProp: 'name' },
    { id: 'branchCode', label: 'Code', jsonProp: 'code' }
];

function createNewBranch() {
    saveUpdate(addBranchModalTitle, primaryKeyId, modalFormControls, createBranch);
};

async function editBranch(id) {
    const branch = await getBranchById(id);
    saveUpdate(updateBranchModalTitle, primaryKeyId, modalFormControls, updateBranchAsync, branch);
};

async function deleteBranch(id) {
    if (confirm('Are you sure you want to delete this branch?')) {
        await deleteBranchAsync(id);
        reloadPage();
    }
};