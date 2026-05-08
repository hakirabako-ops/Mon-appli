// C:\laragon\www\backend\hash.js
const bcrypt = require("bcryptjs");

const motDePasse = "admin@2ie-edu.org";

bcrypt.hash(motDePasse, 10, (err, hash) => {
    console.log("Hash généré :");
    console.log(hash);
    console.log("\nCopiez ce hash dans votre SQL !");
});