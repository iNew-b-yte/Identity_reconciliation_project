const express = require("express");
// const { isNil, isEmpty } = require("lodash");
const router = express.Router();

const asyncMiddle = require("../middleware/asyncMiddleware");
const identityReconciliationService = require("../services/identityRecon");

// const { getIdentity,
//     getSingleIdentity,
//     createIdentity,
//     getIdentityByEmail,
//     getIdentityByPhone,
//     getIdentityByEmailPhone,
//     updateIdentity,
//     getIdentityByLinkedId
// } = require("../db/database");

router.post("/", asyncMiddle(async (req, res) => {
    const { email, phoneNumber } = req.body;

    const responseObj = await identityReconciliationService(email, phoneNumber);
//     const responseObj = {
//         contact: {
//             primaryContactId: null,
//             emails: [],
//             phoneNumbers: [],
//             secondaryContactIds: []
//         }
//     }

//     let _emailPhoneCheck = [], _emailCheck = [], _phoneCheck = [], _resultArr = [];


//     if (!isNil(email) && !isNil(phoneNumber)) _emailPhoneCheck = await getIdentityByEmailPhone(phoneNumber, email);
//     if (!isNil(email)) _emailCheck = await getIdentityByEmail(email);
//     if (!isNil(phoneNumber)) _phoneCheck = await getIdentityByPhone(phoneNumber);

//     if (isEmpty(_emailCheck) && isEmpty(_phoneCheck) && isEmpty(_emailPhoneCheck) && !isNil(email) && !isNil(phoneNumber)) {

//         _resultArr = await createIdentity(phoneNumber, email, null, "primary");

//     } else if (isEmpty(_emailPhoneCheck) && (!isEmpty(_emailCheck) || !isEmpty(_phoneCheck)) && !isNil(email) && !isNil(phoneNumber)) {

//         const emailAcc = _emailCheck.filter(item => item.linkPrecedence === "primary");
//         const phoneAcc = _phoneCheck.filter(item => item.linkPrecedence === "primary");
        
//         if (!isEmpty(emailAcc) && !isEmpty(phoneAcc)) {
//             const time = new Date().toISOString();
//             const datePart = time.split('T')[0];
//             const timePart = time.split('T')[1].split('.')[0];

//             const result = await updateIdentity(phoneAcc[0].id,
//                 emailAcc[0].id,
//                 "secondary",
//                 `${datePart} ${timePart}`
//             );

//             const allLinkedPhoneAccs = await getIdentityByLinkedId(phoneAcc[0].id);
//             if(!isEmpty(allLinkedPhoneAccs)) {
//                 for(const acc of allLinkedPhoneAccs) {
//                     const result = await updateIdentity(acc.id,
//                         emailAcc[0].id,
//                         "secondary",
//                         `${datePart} ${timePart}`
//                     );
//                 }
//             }

//             _resultArr = await getIdentityByLinkedId(emailAcc[0].id);

//         } else if (!isEmpty(emailAcc)  && !isNil(phoneNumber)) {

//             if (!isEmpty(_phoneCheck)) {
//                 const time = new Date().toISOString();
//                 const datePart = time.split('T')[0];
//                 const timePart = time.split('T')[1].split('.')[0];

//                 for(const x of _phoneCheck) {
//                     const result = await updateIdentity(x.id,
//                         emailAcc[0].id,
//                         "secondary",
//                         `${datePart} ${timePart}`
//                     );
//                 }
//                 await getIdentityByLinkedId(emailAcc[0].id);
//                 _resultArr = await createIdentity(phoneNumber, email, emailAcc[0].id, "secondary");                

//             } else {
//                 _resultArr = await createIdentity(phoneNumber, email, emailAcc[0].id, "secondary");                
//             }
//         } else if (!isEmpty(phoneAcc) && !isNil(email)) {
//             if (!isEmpty(_emailCheck) ) {
//                 const time = new Date().toISOString();
//                 const datePart = time.split('T')[0];
//                 const timePart = time.split('T')[1].split('.')[0];

//                 for(const x of _emailCheck) {
//                     const result = await updateIdentity(x.id,
//                         phoneAcc[0].id,
//                         "secondary",
//                         `${datePart} ${timePart}`
//                     );
//                 }

//                 await getIdentityByLinkedId(phoneAcc[0].id);
//                 _resultArr = await createIdentity(phoneNumber, email, phoneAcc[0].id, "secondary");                

//             } else {
//                 _resultArr = await createIdentity(phoneNumber, email, phoneAcc[0].id, "secondary");                
//             }
//         }

//         if(isEmpty(emailAcc) && isEmpty(phoneAcc)) {
//             const secondEmailAcc =  _emailCheck.filter(item => item.linkPrecedence === "secondary");
//             const secondPhoneAcc = _phoneCheck.filter(item => item.linkPrecedence === "secondary");

//             if(!isEmpty(secondEmailAcc) && !isNil(phoneNumber)) {
//                 _resultArr = await createIdentity(phoneNumber, email, secondEmailAcc[0].linkedId, "secondary");
//             } else if(!isEmpty(secondPhoneAcc) && !isNil(email)) {
//                 _resultArr = await createIdentity(phoneNumber, email, secondPhoneAcc[0].linkedId, "secondary");
//             }
//         }

//     } 
    
//     if (!isEmpty(_emailCheck) && isEmpty(_phoneCheck)) {
//         const _primaryContact = _emailCheck.filter(item => item.linkPrecedence === "primary");
//         const secondary = _emailCheck.filter(item => item.linkPrecedence === "secondary");

//         if(!isEmpty(_primaryContact)) {
//         const secondaryContactIds = [];
//         const phoneNumberSet = new Set(), emails = new Set();
//         let  primaryContactId;
//         const allSecondaryContacts = await getIdentityByLinkedId(_primaryContact[0].id);
//         const primaryContact = await getSingleIdentity(_primaryContact[0].id);

//         emails.add(primaryContact[0].email);
//         phoneNumberSet.add(primaryContact[0].phoneNumber);
//         primaryContactId = primaryContact[0].id;

//         for(const ctk of allSecondaryContacts) {
//             emails.add(ctk.email);
//             phoneNumberSet.add(ctk.phoneNumber);
//             secondaryContactIds.push(ctk.id);
//         }

//         responseObj.contact.primaryContactId = primaryContactId;
//         responseObj.contact.emails = Array.from(emails);
//         responseObj.contact.phoneNumbers = Array.from(phoneNumberSet);
//         responseObj.contact.secondaryContactIds = secondaryContactIds;
//         } else if(!isEmpty(secondary)) {
//             const secondaryContactIds = [];
//             const phoneNumberSet = new Set(), emails = new Set();
//             let primaryContactId;
//             const allSecondaryContacts = await getIdentityByLinkedId(secondary[0].linkedId);
//             const primaryContact = await getSingleIdentity(secondary[0].linkedId);

//             emails.add(primaryContact[0].email);
//             phoneNumberSet.add(primaryContact[0].phoneNumber);
//             primaryContactId = primaryContact[0].id;
    
//             for(const ctk of allSecondaryContacts) {
//                 emails.add(ctk.email);
//                 phoneNumberSet.add(ctk.phoneNumber);
//                 secondaryContactIds.push(ctk.id);
//             }
    
//             responseObj.contact.primaryContactId = primaryContactId;
//             responseObj.contact.emails = Array.from(emails);
//             responseObj.contact.phoneNumbers = Array.from(phoneNumberSet);
//             responseObj.contact.secondaryContactIds = secondaryContactIds;
//         }
//     } else if (!isEmpty(_phoneCheck) && isEmpty(_emailCheck)) {
//         const _primaryContact = _phoneCheck.filter(item => item.linkPrecedence === "primary");
//         const secondary = _phoneCheck.filter(item => item.linkPrecedence === "secondary");

//         if(!isEmpty(_primaryContact)) {
//         const secondaryContactIds = [];
//         const phoneNumberSet = new Set(), emails = new Set() ;
//         let  primaryContactId;
//         const allSecondaryContacts = await getIdentityByLinkedId(_primaryContact[0].id);
//         const primaryContact = await getSingleIdentity(_primaryContact[0].id);

//         emails.add(primaryContact[0].email);
//         phoneNumberSet.add(primaryContact[0].phoneNumber);
//         primaryContactId = primaryContact[0].id;

//         for(const ctk of allSecondaryContacts) {
//             emails.add(ctk.email);
//             phoneNumberSet.add(ctk.phoneNumber);
//             secondaryContactIds.push(ctk.id);
//         }

//         responseObj.contact.primaryContactId = primaryContactId;
//         responseObj.contact.emails = Array.from(emails);
//         responseObj.contact.phoneNumbers = Array.from(phoneNumberSet);
//         responseObj.contact.secondaryContactIds = secondaryContactIds;
//         } else if(!isEmpty(secondary)) {
//             const secondaryContactIds = [];
//             const phoneNumberSet = new Set(), emails = new Set();
//             let primaryContactId;
//             const allSecondaryContacts = await getIdentityByLinkedId(secondary[0].linkedId);
//             const primaryContact = await getSingleIdentity(secondary[0].linkedId);

//             emails.add(primaryContact[0].email);
//             phoneNumberSet.add(primaryContact[0].phoneNumber);
//             primaryContactId = primaryContact[0].id;
    
//             for(const ctk of allSecondaryContacts) {
//                 emails.add(ctk.email);
//                 phoneNumberSet.add(ctk.phoneNumber);
//                 secondaryContactIds.push(ctk.id);
//             }
    
//             responseObj.contact.primaryContactId = primaryContactId;
//             responseObj.contact.emails = Array.from(emails);
//             responseObj.contact.phoneNumbers = Array.from(phoneNumberSet);
//             responseObj.contact.secondaryContactIds = secondaryContactIds;
//         }
//     } else if(!isEmpty(_emailPhoneCheck)) {
//         _resultArr = _emailPhoneCheck;
//     }


//     if(!isEmpty(_resultArr)) {
//     if(_resultArr[0].linkPrecedence === "secondary") {
//         const secondaryContactIds = [];
//         const phoneNumberSet = new Set(), emails = new Set() ;
//         let primaryContactId;
//         const allSecondaryContacts = await getIdentityByLinkedId(_resultArr[0].linkedId);
//         const primaryContact = await getSingleIdentity(_resultArr[0].linkedId);

//         emails.add(primaryContact[0].email);
//         phoneNumberSet.add(primaryContact[0].phoneNumber);
//         primaryContactId = primaryContact[0].id;

//         for(const ctk of allSecondaryContacts) {
//             emails.add(ctk.email);
//             phoneNumberSet.add(ctk.phoneNumber);
//             secondaryContactIds.push(ctk.id);
//         }

//         responseObj.contact.primaryContactId = primaryContactId;
//         responseObj.contact.emails = Array.from(emails);
//         responseObj.contact.phoneNumbers = Array.from(phoneNumberSet);
//         responseObj.contact.secondaryContactIds = secondaryContactIds;

//     } else if (_resultArr[0].linkPrecedence === "primary") {
//         const secondaryContactIds = [];
//         const phoneNumberSet = new Set(), emails = new Set() ;
//         let primaryContactId;
//         const allSecondaryContacts = await getIdentityByLinkedId(_resultArr[0].id);
//         const primaryContact = await getSingleIdentity(_resultArr[0].id);

//         emails.add(primaryContact[0].email);
//         phoneNumberSet.add(primaryContact[0].phoneNumber);
//         primaryContactId = primaryContact[0].id;

//         for(const ctk of allSecondaryContacts) {
//             emails.add(ctk.email);
//             phoneNumberSet.add(ctk.phoneNumber);
//             secondaryContactIds.push(ctk.id);
//         }

//         responseObj.contact.primaryContactId = primaryContactId;
//         responseObj.contact.emails = Array.from(emails);
//         responseObj.contact.phoneNumbers = Array.from(phoneNumberSet);
//         responseObj.contact.secondaryContactIds = secondaryContactIds;
//     }
// }
 
    // console.log(_resultArr);
    res.status(200).send(responseObj);
}));

module.exports = router;