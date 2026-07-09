import bcrypt from "bcryptjs";


async function main(){

const hash =
await bcrypt.hash(
"Security@Shreyansh@Portfolio",
12
);


console.log(hash);

}


main();