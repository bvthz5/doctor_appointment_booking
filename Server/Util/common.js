
/**
 * Function to compare two arrays and get the elements present first array and not present in second array
 * @param {*} arr1 - first array to compare 
 * @param {*} arr2 - second array to compare
 * @returns 
 */
function getDifferenceArray(arr1, arr2) {
    return arr1.filter(item => arr2.indexOf(item) === -1);
  }


  function filterUnique(arr) {
    const seen = {};
    return arr.filter(item => {
      if (!seen.hasOwnProperty(item)) {
        seen[item] = true;
        return true;
      }
      return false;
    });
  }


  module.exports={
    filterUnique,
    getDifferenceArray
  }