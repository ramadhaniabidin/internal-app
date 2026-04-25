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
    openModal(addBranchModalTitle, primaryKeyId, modalFormControls, "btn-save");
};

async function editBranch(id) {
    console.log('Edit branch with id: ', id);
    const branch = await getBranchById(id);
    console.log('branch data: ', branch);
    openModal(updateBranchModalTitle, primaryKeyId, modalFormControls, "btn-update", branch);
};

async function deleteBranch(id) {
    if (confirm('Are you sure you want to delete this branch?')) {
        await deleteBranchAsync(id);
        reloadPage();
    }
};