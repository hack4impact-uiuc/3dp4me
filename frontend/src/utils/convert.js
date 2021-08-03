/**
 * Converts the roles response to a format useable by the MultiSelect field
 */
export const rolesToMultiSelectFormat = (roles) => {
    return roles.map((r) => ({
        _id: r?._id,
        IsHidden: r?.isHidden,
        Question: r?.roleName,
    }));
};
