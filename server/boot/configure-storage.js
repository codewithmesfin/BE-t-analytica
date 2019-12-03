// const nanoid = require("nanoid");

// module.exports = function (app) {
//     app.dataSources.storage.connector.getFilename = function (file) {
//         const ext =
//             /[.]/.exec(file.name) && /[^.]+$/.exec(file.name) ?
//             /[^.]+$/.exec(file.name).pop() :
//             undefined;
//         return `${nanoid()}.${ext || ""}`;
//     };
// };