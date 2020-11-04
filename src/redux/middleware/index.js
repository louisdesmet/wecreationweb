//const forbiddenWords = ["spam", "money"];
export function forbiddenWordsMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {
      // do your stuff
      //if (action.type === ADD_ARTICLE) {

     // }
      return next(action);
    };
  };
}