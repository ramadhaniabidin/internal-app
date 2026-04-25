const primaryKeyId = 'branchId';
const contractTypeCodeId = 'contractTypeCode';
const contractTypeNameId = 'contractTypeName';
const addContractTypeTitle = 'Add New Contract Type';
const updateContractTypeTitle = 'Update Contract Type';

const modalFormControls = [
    { id: 'contractTypeName', label: 'Name', jsonProp: 'name' },
    { id: 'contractTypeCode', label: 'Code', jsonProp: 'code' }
];

function createNewContractType(){
    openModal(addContractTypeTitle, primaryKeyId, modalFormControls, 'btn-save-contract-type');
};

async function editContractType(id) {
    const contractType = await getContractTypeById(id);
    openModal(updateContractTypeTitle, primaryKeyId, modalFormControls, 'btn-update-contract-type', contractType);
};

async function deleteContractType(id) {
    if(confirm('Are you sure you want to delete this contract type?')){
        await deleteContractTypeAsync(id);
        reloadPage();
    }
};