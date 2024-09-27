import images from "../Themes/WhiteLabelTheme/Images"
import { strings } from "../Locales/i18n"

export const menuList = [
    {
        id: 1,
        page: "EditBasicStepScreen",
        name: strings("profileProvider.basicData"),
        image: images.profile_icon
    },
    {
        id: 2,
        page: "EditAddressStepScreen",
        name: strings("profileProvider.myAddress"),
        image: images.address_profile
    },
    {
        id: 4,
        page: "EditVehicleStepScreen",
        name: strings("profileProvider.vehicleData"),
        image: images.vehicle_profile
    },
    {
        id: 5,
        page: "EditBankStepScreen",
        name: strings("profileProvider.bankData"),
        image: images.bank_profile
    },
    {
        id: 6,
        page: "EditDocumentStepScreen",
        name: strings("profileProvider.sendDocuments"),
        image: images.cloud_profile
    },
    {
        id: 7,
        page: "ChangePasswordScreen",
        name: strings("register.change_password"),
        image: images.icon_lock
    },
]
