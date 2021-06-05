const { stepStatusEnum, overallStatusEnum } = require('../../models');
const mongoose = require('mongoose');
const { ModuleFilenameHelpers } = require('webpack');

module.exports.PUT_STEP_REORDERED_FIELDS = {
        "fields": [
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c68",
                "key": "numDisabledPeople",
                "displayName": {
                    "EN": "Number of Disabled People in House",
                    "AR": "عدد المعوقين بالمنزل"
                },
                "fieldNumber": "1",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c67",
                "key": "numMilitaryPolice",
                "displayName": {
                    "EN": "Number of Military or Police in Household",
                    "AR": "عدد أفراد الجيش أو الشرطة في الأسرة"
                },
                "fieldNumber": "2",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c5f",
                "key": "numberRetiredPeople",
                "displayName": {
                    "EN": "Number of Retired Household Members",
                    "AR": "عدد أفراد الأسرة المتقاعدين"
                },
                "fieldNumber": "3",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "RadioButton",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c60",
                "key": "typeOfInsurance",
                "fieldNumber": "4",
                "isVisibleOnDashboard": false,
                "displayName": {
                    "EN": "Type of Insurance",
                    "AR": "نوع التأمين"
                },
                "options": [
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c61",
                        "Index": "0",
                        "Question": {
                            "_id": "6070816ada92745444f64c62",
                            "EN": "Private",
                            "AR": "خاص"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c63",
                        "Index": "1",
                        "Question": {
                            "_id": "6070816ada92745444f64c64",
                            "EN": "Government",
                            "AR": "حكومة"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c65",
                        "Index": "2",
                        "Question": {
                            "_id": "6070816ada92745444f64c66",
                            "EN": "None",
                            "AR": "لا أحد"
                        }
                    }
                ]
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c5e",
                "key": "numberCars",
                "displayName": {
                    "EN": "Number of Cars in Household",
                    "AR": "عدد السيارات المنزلية"
                },
                "fieldNumber": "4",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "RadioButton",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c51",
                "key": "incomeRange",
                "fieldNumber": "5",
                "isVisibleOnDashboard": false,
                "displayName": {
                    "EN": "Household Income Range",
                    "AR": "نطاق دخل الأسرة"
                },
                "options": [
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c52",
                        "Index": "0",
                        "Question": {
                            "_id": "6070816ada92745444f64c53",
                            "EN": "0 JOD - 4999 JOD",
                            "AR": "0 دينار - 4999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c54",
                        "Index": "1",
                        "Question": {
                            "_id": "6070816ada92745444f64c55",
                            "EN": "5000 JOD - 9999 JOD",
                            "AR": "5000 دينار - 9999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c56",
                        "Index": "2",
                        "Question": {
                            "_id": "6070816ada92745444f64c57",
                            "EN": "10000 JOD - 14999 JOD",
                            "AR": "10000 دينار - 14999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c58",
                        "Index": "3",
                        "Question": {
                            "_id": "6070816ada92745444f64c59",
                            "EN": "15000 JOD - 19999 JOD",
                            "AR": "15000 دينار - 19999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c5a",
                        "Index": "4",
                        "Question": {
                            "_id": "6070816ada92745444f64c5b",
                            "EN": "20000 JOD - 29999 JOD",
                            "AR": "20000 دينار - 29999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c5c",
                        "Index": "5",
                        "Question": {
                            "_id": "6070816ada92745444f64c5d",
                            "EN": "30000+ JOD",
                            "AR": "30000+ دينار"
                        }
                    }
                ]
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c50",
                "key": "numWorkingPeople",
                "displayName": {
                    "EN": "Number of Working People in Household",
                    "AR": "عدد العاملين في الأسرة"
                },
                "fieldNumber": "6",
                "isVisibleOnDashboard": false,
                "options": []
            },
        ]
    }  

module.exports.PUT_STEP_REORDERED_FIELDS_EXPECTED = {
        "_id": "6092c26fe0912601bbc5d85d",
        "readableGroups": [],
        "writableGroups": [],
        "key": "survey",
        "displayName": {
            "EN": "Survey",
            "AR": "استطلاع"
        },
        "stepNumber": "1",
        "fields": [
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c68",
                "key": "numDisabledPeople",
                "displayName": {
                    "EN": "Number of Disabled People in House",
                    "AR": "عدد المعوقين بالمنزل"
                },
                "fieldNumber": "1",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c67",
                "key": "numMilitaryPolice",
                "displayName": {
                    "EN": "Number of Military or Police in Household",
                    "AR": "عدد أفراد الجيش أو الشرطة في الأسرة"
                },
                "fieldNumber": "2",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c5f",
                "key": "numberRetiredPeople",
                "displayName": {
                    "EN": "Number of Retired Household Members",
                    "AR": "عدد أفراد الأسرة المتقاعدين"
                },
                "fieldNumber": "3",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "RadioButton",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c60",
                "key": "typeOfInsurance",
                "fieldNumber": "4",
                "isVisibleOnDashboard": false,
                "displayName": {
                    "EN": "Type of Insurance",
                    "AR": "نوع التأمين"
                },
                "options": [
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c61",
                        "Index": "0",
                        "Question": {
                            "_id": "6070816ada92745444f64c62",
                            "EN": "Private",
                            "AR": "خاص"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c63",
                        "Index": "1",
                        "Question": {
                            "_id": "6070816ada92745444f64c64",
                            "EN": "Government",
                            "AR": "حكومة"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c65",
                        "Index": "2",
                        "Question": {
                            "_id": "6070816ada92745444f64c66",
                            "EN": "None",
                            "AR": "لا أحد"
                        }
                    }
                ]
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c5e",
                "key": "numberCars",
                "displayName": {
                    "EN": "Number of Cars in Household",
                    "AR": "عدد السيارات المنزلية"
                },
                "fieldNumber": "4",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "RadioButton",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c51",
                "key": "incomeRange",
                "fieldNumber": "5",
                "isVisibleOnDashboard": false,
                "displayName": {
                    "EN": "Household Income Range",
                    "AR": "نطاق دخل الأسرة"
                },
                "options": [
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c52",
                        "Index": "0",
                        "Question": {
                            "_id": "6070816ada92745444f64c53",
                            "EN": "0 JOD - 4999 JOD",
                            "AR": "0 دينار - 4999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c54",
                        "Index": "1",
                        "Question": {
                            "_id": "6070816ada92745444f64c55",
                            "EN": "5000 JOD - 9999 JOD",
                            "AR": "5000 دينار - 9999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c56",
                        "Index": "2",
                        "Question": {
                            "_id": "6070816ada92745444f64c57",
                            "EN": "10000 JOD - 14999 JOD",
                            "AR": "10000 دينار - 14999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c58",
                        "Index": "3",
                        "Question": {
                            "_id": "6070816ada92745444f64c59",
                            "EN": "15000 JOD - 19999 JOD",
                            "AR": "15000 دينار - 19999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c5a",
                        "Index": "4",
                        "Question": {
                            "_id": "6070816ada92745444f64c5b",
                            "EN": "20000 JOD - 29999 JOD",
                            "AR": "20000 دينار - 29999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c5c",
                        "Index": "5",
                        "Question": {
                            "_id": "6070816ada92745444f64c5d",
                            "EN": "30000+ JOD",
                            "AR": "30000+ دينار"
                        }
                    }
                ]
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c50",
                "key": "numWorkingPeople",
                "displayName": {
                    "EN": "Number of Working People in Household",
                    "AR": "عدد العاملين في الأسرة"
                },
                "fieldNumber": "6",
                "isVisibleOnDashboard": false,
                "options": []
            },
        ],
        __v: "0"
    };

module.exports.PUT_STEP_ADDED_FIELD = {
        "fields": [
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c50",
                "key": "numWorkingPeople",
                "displayName": {
                    "EN": "Number of Working People in Household",
                    "AR": "عدد العاملين في الأسرة"
                },
                "fieldNumber": "0",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "RadioButton",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c51",
                "key": "incomeRange",
                "fieldNumber": "1",
                "isVisibleOnDashboard": false,
                "displayName": {
                    "EN": "Household Income Range",
                    "AR": "نطاق دخل الأسرة"
                },
                "options": [
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c52",
                        "Index": "0",
                        "Question": {
                            "_id": "6070816ada92745444f64c53",
                            "EN": "0 JOD - 4999 JOD",
                            "AR": "0 دينار - 4999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c54",
                        "Index": "1",
                        "Question": {
                            "_id": "6070816ada92745444f64c55",
                            "EN": "5000 JOD - 9999 JOD",
                            "AR": "5000 دينار - 9999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c56",
                        "Index": "2",
                        "Question": {
                            "_id": "6070816ada92745444f64c57",
                            "EN": "10000 JOD - 14999 JOD",
                            "AR": "10000 دينار - 14999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c58",
                        "Index": "3",
                        "Question": {
                            "_id": "6070816ada92745444f64c59",
                            "EN": "15000 JOD - 19999 JOD",
                            "AR": "15000 دينار - 19999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c5a",
                        "Index": "4",
                        "Question": {
                            "_id": "6070816ada92745444f64c5b",
                            "EN": "20000 JOD - 29999 JOD",
                            "AR": "20000 دينار - 29999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c5c",
                        "Index": "5",
                        "Question": {
                            "_id": "6070816ada92745444f64c5d",
                            "EN": "30000+ JOD",
                            "AR": "30000+ دينار"
                        }
                    }
                ]
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c5e",
                "key": "numberCars",
                "displayName": {
                    "EN": "Number of Cars in Household",
                    "AR": "عدد السيارات المنزلية"
                },
                "fieldNumber": "2",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c5f",
                "key": "numberRetiredPeople",
                "displayName": {
                    "EN": "Number of Retired Household Members",
                    "AR": "عدد أفراد الأسرة المتقاعدين"
                },
                "fieldNumber": "3",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "RadioButton",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c60",
                "key": "typeOfInsurance",
                "fieldNumber": "4",
                "isVisibleOnDashboard": false,
                "displayName": {
                    "EN": "Type of Insurance",
                    "AR": "نوع التأمين"
                },
                "options": [
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c61",
                        "Index": "0",
                        "Question": {
                            "_id": "6070816ada92745444f64c62",
                            "EN": "Private",
                            "AR": "خاص"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c63",
                        "Index": "1",
                        "Question": {
                            "_id": "6070816ada92745444f64c64",
                            "EN": "Government",
                            "AR": "حكومة"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c65",
                        "Index": "2",
                        "Question": {
                            "_id": "6070816ada92745444f64c66",
                            "EN": "None",
                            "AR": "لا أحد"
                        }
                    }
                ]
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c67",
                "key": "numMilitaryPolice",
                "displayName": {
                    "EN": "Number of Military or Police in Household",
                    "AR": "عدد أفراد الجيش أو الشرطة في الأسرة"
                },
                "fieldNumber": "5",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c68",
                "key": "numDisabledPeople",
                "displayName": {
                    "EN": "Number of Disabled People in House",
                    "AR": "عدد المعوقين بالمنزل"
                },
                "fieldNumber": "6",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c69",
                "key": "testField",
                "displayName": {
                    "EN": "Number of Disabled People in House",
                    "AR": "عدد المعوقين بالمنزل"
                },
                "fieldNumber": "7",
                "isVisibleOnDashboard": false,
                "options": []
            }
        ]
    };

module.exports.PUT_STEP_ADDED_FIELD_EXPECTED = {
        "_id": "6092c26fe0912601bbc5d85d",
        "readableGroups": [],
        "writableGroups": [],
        "key": "survey",
        "displayName": {
            "EN": "Survey",
            "AR": "استطلاع"
        },
        "stepNumber": "1",
        "fields": [
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c50",
                "key": "numWorkingPeople",
                "displayName": {
                    "EN": "Number of Working People in Household",
                    "AR": "عدد العاملين في الأسرة"
                },
                "fieldNumber": "0",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "RadioButton",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c51",
                "key": "incomeRange",
                "fieldNumber": "1",
                "isVisibleOnDashboard": false,
                "displayName": {
                    "EN": "Household Income Range",
                    "AR": "نطاق دخل الأسرة"
                },
                "options": [
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c52",
                        "Index": "0",
                        "Question": {
                            "_id": "6070816ada92745444f64c53",
                            "EN": "0 JOD - 4999 JOD",
                            "AR": "0 دينار - 4999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c54",
                        "Index": "1",
                        "Question": {
                            "_id": "6070816ada92745444f64c55",
                            "EN": "5000 JOD - 9999 JOD",
                            "AR": "5000 دينار - 9999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c56",
                        "Index": "2",
                        "Question": {
                            "_id": "6070816ada92745444f64c57",
                            "EN": "10000 JOD - 14999 JOD",
                            "AR": "10000 دينار - 14999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c58",
                        "Index": "3",
                        "Question": {
                            "_id": "6070816ada92745444f64c59",
                            "EN": "15000 JOD - 19999 JOD",
                            "AR": "15000 دينار - 19999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c5a",
                        "Index": "4",
                        "Question": {
                            "_id": "6070816ada92745444f64c5b",
                            "EN": "20000 JOD - 29999 JOD",
                            "AR": "20000 دينار - 29999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c5c",
                        "Index": "5",
                        "Question": {
                            "_id": "6070816ada92745444f64c5d",
                            "EN": "30000+ JOD",
                            "AR": "30000+ دينار"
                        }
                    }
                ]
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c5e",
                "key": "numberCars",
                "displayName": {
                    "EN": "Number of Cars in Household",
                    "AR": "عدد السيارات المنزلية"
                },
                "fieldNumber": "2",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c5f",
                "key": "numberRetiredPeople",
                "displayName": {
                    "EN": "Number of Retired Household Members",
                    "AR": "عدد أفراد الأسرة المتقاعدين"
                },
                "fieldNumber": "3",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "RadioButton",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c60",
                "key": "typeOfInsurance",
                "fieldNumber": "4",
                "isVisibleOnDashboard": false,
                "displayName": {
                    "EN": "Type of Insurance",
                    "AR": "نوع التأمين"
                },
                "options": [
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c61",
                        "Index": "0",
                        "Question": {
                            "_id": "6070816ada92745444f64c62",
                            "EN": "Private",
                            "AR": "خاص"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c63",
                        "Index": "1",
                        "Question": {
                            "_id": "6070816ada92745444f64c64",
                            "EN": "Government",
                            "AR": "حكومة"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c65",
                        "Index": "2",
                        "Question": {
                            "_id": "6070816ada92745444f64c66",
                            "EN": "None",
                            "AR": "لا أحد"
                        }
                    }
                ]
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c67",
                "key": "numMilitaryPolice",
                "displayName": {
                    "EN": "Number of Military or Police in Household",
                    "AR": "عدد أفراد الجيش أو الشرطة في الأسرة"
                },
                "fieldNumber": "5",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c68",
                "key": "numDisabledPeople",
                "displayName": {
                    "EN": "Number of Disabled People in House",
                    "AR": "عدد المعوقين بالمنزل"
                },
                "fieldNumber": "6",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c69",
                "key": "testField",
                "displayName": {
                    "EN": "Number of Disabled People in House",
                    "AR": "عدد المعوقين بالمنزل"
                },
                "fieldNumber": "7",
                "isVisibleOnDashboard": false,
                "options": []
            }
        ],
        "__v": "0"
    };

module.exports.PUT_STEP_DELETED_FIELD = {
        "fields": [
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c50",
                "key": "numWorkingPeople",
                "displayName": {
                    "EN": "Number of Working People in Household",
                    "AR": "عدد العاملين في الأسرة"
                },
                "fieldNumber": "0",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "RadioButton",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c51",
                "key": "incomeRange",
                "fieldNumber": "1",
                "isVisibleOnDashboard": false,
                "displayName": {
                    "EN": "Household Income Range",
                    "AR": "نطاق دخل الأسرة"
                },
                "options": [
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c52",
                        "Index": "0",
                        "Question": {
                            "_id": "6070816ada92745444f64c53",
                            "EN": "0 JOD - 4999 JOD",
                            "AR": "0 دينار - 4999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c54",
                        "Index": "1",
                        "Question": {
                            "_id": "6070816ada92745444f64c55",
                            "EN": "5000 JOD - 9999 JOD",
                            "AR": "5000 دينار - 9999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c56",
                        "Index": "2",
                        "Question": {
                            "_id": "6070816ada92745444f64c57",
                            "EN": "10000 JOD - 14999 JOD",
                            "AR": "10000 دينار - 14999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c58",
                        "Index": "3",
                        "Question": {
                            "_id": "6070816ada92745444f64c59",
                            "EN": "15000 JOD - 19999 JOD",
                            "AR": "15000 دينار - 19999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c5a",
                        "Index": "4",
                        "Question": {
                            "_id": "6070816ada92745444f64c5b",
                            "EN": "20000 JOD - 29999 JOD",
                            "AR": "20000 دينار - 29999 دينار"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c5c",
                        "Index": "5",
                        "Question": {
                            "_id": "6070816ada92745444f64c5d",
                            "EN": "30000+ JOD",
                            "AR": "30000+ دينار"
                        }
                    }
                ]
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c5e",
                "key": "numberCars",
                "displayName": {
                    "EN": "Number of Cars in Household",
                    "AR": "عدد السيارات المنزلية"
                },
                "fieldNumber": "2",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c5f",
                "key": "numberRetiredPeople",
                "displayName": {
                    "EN": "Number of Retired Household Members",
                    "AR": "عدد أفراد الأسرة المتقاعدين"
                },
                "fieldNumber": "3",
                "isVisibleOnDashboard": false,
                "options": []
            },
            {
                "fieldType": "RadioButton",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c60",
                "key": "typeOfInsurance",
                "fieldNumber": "4",
                "isVisibleOnDashboard": false,
                "displayName": {
                    "EN": "Type of Insurance",
                    "AR": "نوع التأمين"
                },
                "options": [
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c61",
                        "Index": "0",
                        "Question": {
                            "_id": "6070816ada92745444f64c62",
                            "EN": "Private",
                            "AR": "خاص"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c63",
                        "Index": "1",
                        "Question": {
                            "_id": "6070816ada92745444f64c64",
                            "EN": "Government",
                            "AR": "حكومة"
                        }
                    },
                    {
                        "IsHidden": false,
                        "_id": "6070816ada92745444f64c65",
                        "Index": "2",
                        "Question": {
                            "_id": "6070816ada92745444f64c66",
                            "EN": "None",
                            "AR": "لا أحد"
                        }
                    }
                ]
            },
            {
                "fieldType": "Number",
                "readableGroups": [],
                "writableGroups": [],
                "_id": "6070816ada92745444f64c67",
                "key": "numMilitaryPolice",
                "displayName": {
                    "EN": "Number of Military or Police in Household",
                    "AR": "عدد أفراد الجيش أو الشرطة في الأسرة"
                },
                "fieldNumber": "5",
                "isVisibleOnDashboard": false,
                "options": []
            }
        ]
    };