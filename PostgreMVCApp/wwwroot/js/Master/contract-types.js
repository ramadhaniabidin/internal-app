const primaryKeyId = 'branchId';
const contractTypeCodeId = 'contractTypeCode';
const contractTypeNameId = 'contractTypeName';
const addContractTypeTitle = 'Add New Contract Type';
const updateContractTypeTitle = 'Update Contract Type';

const modalFormControls = [
    { id: 'contractTypeName', label: 'Name', jsonProp: 'title' },
    { id: 'contractTypeCode', label: 'Code', jsonProp: 'code' }
];

function createNewContractType() {
    saveUpdate(addContractTypeTitle, primaryKeyId, modalFormControls, createContractTypeAsync);
};

async function editContractType(id) {
    const contractType = await getContractTypeById(id);
    saveUpdate(updateContractTypeTitle, primaryKeyId, modalFormControls, updateContractTypeAsync, contractType);
};

async function deleteContractType(id) {
    if (confirm('Are you sure you want to delete this branch?')) {
        await deleteContractTypeAsync(id);
        reloadPage();
    }
};