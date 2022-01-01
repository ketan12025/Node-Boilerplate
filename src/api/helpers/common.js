
// get total page count
const getTotalPage = (totalItem, itemPerPage) => Math.ceil(totalItem / itemPerPage);
// get total page count
const getSkipCount = (itemPerPage, pageNumber) => Math.ceil((itemPerPage * pageNumber) - itemPerPage);

// get random integer
const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}
//Get the Slug for URL
const getSlug = (title) => {
    return title.replace(/\W+/g, '-').toLowerCase();
}

export {
    getTotalPage,
    getSkipCount,
    getRandomInt,
    getSlug
}