
const { getIdentity,
    getSingleIdentity,
    createIdentity,
    getIdentityByEmail,
    getIdentityByPhone,
    getIdentityByEmailPhone,
    updateIdentity,
    getIdentityByLinkedId
} = require("../db/database");

const precedence = require("../constants");

const { isNil, isEmpty } = require("lodash");



async function identityReconciliationService(email, phoneNumber) {
    let responseObjFinal = {
        contact: {
            primaryContactId: null,
            emails: [],
            phoneNumbers: [],
            secondaryContactIds: []
        }
    }

    let _emailPhoneCheck = [], _emailCheck = [], _phoneCheck = [], _resultArr = [];


    if (!isNil(email) && !isNil(phoneNumber)) _emailPhoneCheck = await getIdentityByEmailPhone(phoneNumber, email);
    if (!isNil(email)) _emailCheck = await getIdentityByEmail(email);
    if (!isNil(phoneNumber)) _phoneCheck = await getIdentityByPhone(phoneNumber);

    if (isEmpty(_emailCheck) && isEmpty(_phoneCheck) && isEmpty(_emailPhoneCheck) && !isNil(email) && !isNil(phoneNumber)) {

        _resultArr = await createIdentity(phoneNumber, email, null, precedence.PRIMARY);

    } else if (isEmpty(_emailPhoneCheck) && (!isEmpty(_emailCheck) || !isEmpty(_phoneCheck)) && !isNil(email) && !isNil(phoneNumber)) {

        const emailAcc = _emailCheck.filter(item => item.linkPrecedence === precedence.PRIMARY);
        const phoneAcc = _phoneCheck.filter(item => item.linkPrecedence === precedence.PRIMARY);

        if (!isEmpty(emailAcc) && !isEmpty(phoneAcc)) {
            const formattedDate = getFormattedDate();

            const result = await updateIdentity(phoneAcc[0].id,
                emailAcc[0].id,
                precedence.SECONDARY,
                formattedDate
            );

            const allLinkedPhoneAccs = await getIdentityByLinkedId(phoneAcc[0].id);
            if (!isEmpty(allLinkedPhoneAccs)) {
                for (const acc of allLinkedPhoneAccs) {
                    const result = await updateIdentity(acc.id,
                        emailAcc[0].id,
                        precedence.SECONDARY,
                        formattedDate
                    );
                }
            }

            _resultArr = await getIdentityByLinkedId(emailAcc[0].id);

        } else if (!isEmpty(emailAcc) && !isNil(phoneNumber)) {

            if (!isEmpty(_phoneCheck)) {
                const formattedDate = getFormattedDate();
                
                for (const x of _phoneCheck) {
                    const result = await updateIdentity(x.id,
                        emailAcc[0].id,
                        precedence.SECONDARY,
                        formattedDate
                    );
                }
                await getIdentityByLinkedId(emailAcc[0].id);
                _resultArr = await createIdentity(phoneNumber, email, emailAcc[0].id, precedence.SECONDARY);
            } else {
                _resultArr = await createIdentity(phoneNumber, email, emailAcc[0].id, precedence.SECONDARY);
            }

        } else if (!isEmpty(phoneAcc) && !isNil(email)) {
            if (!isEmpty(_emailCheck)) {
                const formattedDate = getFormattedDate();
                
                for (const x of _emailCheck) {
                    const result = await updateIdentity(x.id,
                        phoneAcc[0].id,
                        precedence.SECONDARY,
                        formattedDate
                    );
                }

                await getIdentityByLinkedId(phoneAcc[0].id);
                _resultArr = await createIdentity(phoneNumber, email, phoneAcc[0].id, precedence.SECONDARY);

            } else {
                _resultArr = await createIdentity(phoneNumber, email, phoneAcc[0].id, precedence.SECONDARY);
            }
        }

        if (isEmpty(emailAcc) && isEmpty(phoneAcc)) {
            const secondEmailAcc = _emailCheck.filter(item => item.linkPrecedence === precedence.SECONDARY);
            const secondPhoneAcc = _phoneCheck.filter(item => item.linkPrecedence === precedence.SECONDARY);

            if (!isEmpty(secondEmailAcc) && !isNil(phoneNumber)) {
                _resultArr = await createIdentity(phoneNumber, email, secondEmailAcc[0].linkedId, precedence.SECONDARY);
            } else if (!isEmpty(secondPhoneAcc) && !isNil(email)) {
                _resultArr = await createIdentity(phoneNumber, email, secondPhoneAcc[0].linkedId, precedence.SECONDARY);
            }
        }

    }

    if (!isEmpty(_emailCheck) && isEmpty(_phoneCheck)) {
        const _primaryContact = _emailCheck.filter(item => item.linkPrecedence === precedence.PRIMARY);
        const secondary = _emailCheck.filter(item => item.linkPrecedence === precedence.SECONDARY);

        if (!isEmpty(_primaryContact)) {
            responseObjFinal = await prepareResponse(_primaryContact[0].id, _primaryContact[0].id, responseObjFinal);
        } else if (!isEmpty(secondary)) {
            responseObjFinal = await prepareResponse(secondary[0].linkedId, secondary[0].linkedId, responseObjFinal);
        }
    } else if (!isEmpty(_phoneCheck) && isEmpty(_emailCheck)) {
        const _primaryContact = _phoneCheck.filter(item => item.linkPrecedence === precedence.PRIMARY);
        const secondary = _phoneCheck.filter(item => item.linkPrecedence === precedence.SECONDARY);

        if (!isEmpty(_primaryContact)) {
            responseObjFinal = await prepareResponse(_primaryContact[0].id, _primaryContact[0].id, responseObjFinal);
        } else if (!isEmpty(secondary)) {
            responseObjFinal = await prepareResponse(secondary[0].linkedId, secondary[0].linkedId, responseObjFinal);
        }
    } else if (!isEmpty(_emailPhoneCheck)) {
        _resultArr = _emailPhoneCheck;
    }


    if (!isEmpty(_resultArr)) {
        if (_resultArr[0].linkPrecedence === precedence.SECONDARY) {
            responseObjFinal = await prepareResponse(_resultArr[0].linkedId, _resultArr[0].linkedId, responseObjFinal);
        } else if (_resultArr[0].linkPrecedence === precedence.PRIMARY) {
            responseObjFinal = await prepareResponse(_resultArr[0].id, _resultArr[0].id, responseObjFinal);
        }
    }

    return responseObjFinal;
}

async function prepareResponse(linkedId, id, responseObj) {
    const secondaryContactIds = [];
    const phoneNumberSet = new Set(), emails = new Set();
    let primaryContactId;
    const allSecondaryContacts = await getIdentityByLinkedId(linkedId);
    const primaryContact = await getSingleIdentity(id);

    emails.add(primaryContact[0].email);
    phoneNumberSet.add(primaryContact[0].phoneNumber);
    primaryContactId = primaryContact[0].id;

    for (const ctk of allSecondaryContacts) {
        emails.add(ctk.email);
        phoneNumberSet.add(ctk.phoneNumber);
        secondaryContactIds.push(ctk.id);
    }

    responseObj.contact.primaryContactId = primaryContactId;
    responseObj.contact.emails = Array.from(emails);
    responseObj.contact.phoneNumbers = Array.from(phoneNumberSet);
    responseObj.contact.secondaryContactIds = secondaryContactIds;

    return responseObj;
}

function getFormattedDate() {
    const time = new Date().toISOString();
    const datePart = time.split('T')[0];
    const timePart = time.split('T')[1].split('.')[0];

    const formattedDate = `${datePart} ${timePart}`;
    return formattedDate;
}


module.exports = identityReconciliationService;