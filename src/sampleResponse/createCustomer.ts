const createCustomerObject: any = {
  email: "tanishq.sharma@skillnetinc.com",
  firstName: "Tanishq",
  attributeSets: [
    {
      memberDetails: {
        memberSource: 2,
        smsOptIn: true,
        smsOptInDate: "2021-03-08T11:00",
        emailOptIn: true,
        emailOptInDate: "2021-03-08T11:00",
        communicationPreference: "B",
      },
      memberTermsCondition: [
        {
          acceptanceDate: "2021-03-08T11:00",
          version: "v1 updated",
          isaccepted: false,
        },
      ],
      memberTaxExemption: [
        {
          exemptionReasonLetter: "A",
          exemptionReason: "Wisconsin State or Local Government",
          exemptionType: "12",
          isActive: true,
          expirationDate: "2021-03-08T11:00",
          reviewDate: "2021-03-08T11:00",
        },
      ],
    },
  ],
};

export default createCustomerObject;