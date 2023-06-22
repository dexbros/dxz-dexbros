import ActionTypes from "./search.types";

export const userSearchKey = (data) => {
    return {
        type: ActionTypes.USER_SEARCH_KEY,
        data: data
    }
}

export const addAll = (data) => ({
    type: ActionTypes.ALL_SEARCH,
    data: data
});

export const addBlock = (data) => ({
    type: ActionTypes.BLOCK_SAERCH,
    data: data
});

export const addPost = (data) => ({
        type: ActionTypes.POST_SEARCH,
        data: data
});

export const addPeople = (data) => ({
    type: ActionTypes.PEOPLE_SEARCH,
    data: data
});


export const addRecentSearch = (data) => ({
    type: ActionTypes.RECENT_SEARCH,
    data: data
});

export const removeRecentSearch = (data) => ({
    type: ActionTypes.DELETE_RECENT_SEARCH,
    data: data
})
