const {client} = require(`../index`);
const index = require(`../index`);
const config = require(`../config`)
const { CheckMute } = require("../mongodb");

client.on("guildMemberAdd", async (member) => {
 
    let userid=member.user.id
    var guildid=member.guild.id

const verificaIni = ["'nvc","xyz","𝚌𝚍𝚣𝟽'","𝐒𝐇ᵉˡᵇʸ","DD✞","AK'","𝐿𝐿𝐺'","divinity","ƉємƠη","! ¹⁵⁷Greciah🐊","fvck","fxck","wrld","! 𝓚 𝓪 𝓶 𝓲 🐊🏴","! emykjkkkkk","! LESADA🐊👻",
"gegevis","yfg.belazX$z","tinker bell","A Batata Vegetariana","!ᴰ'ʳᵃᶜ̧ᵃ🗽","!  Prince  🐊🚩","ᴊᴜʟɪᴀシ","Amiizinha ツ","𝐖$","!dz7","RJ$ Natyzinha-Shelby","! Surtɑd𝚊ꪰꪰꪰッ 🔥",
"! × ₳NINHΛ 👑","! BANDIDA 💱","! Ꭶҡ𝖎 ⛷ ℳℴ𝓇ℯ𝓃𝒶 ❤","! 𝐂herry🍒","! 𝐂𝐞𝐫𝐞𝐣𝐢𝐧𝐡𝐚🍒","$Angel","$Baby","$Manuella","adryany44","agathaxyz","Marinaa <3","juu","ML Rah.", "catarina ff"];
const avatar = [    
    "00a463e71de7856d6cd79685eaf84269",
    "0266d23f3b46370a2e5649466de6621e",
    "07e210756a160e1ed35f19c0e25eebbd",
    "0be8ab407d42ab9d9bab0e82b081b4ef",
    "0bfb11cd5f61cefb23244e5ef7fc7e50",
    "0e6656f5101d6659c8c6a14973baa739",
    "11ac488f2e4a8203386f777c3c32e359",
    "1d6361ed1e6fa1985b343dbac7ef7d15",
    "22a839fd6aedc886c52b2ef8f5c4f0f4",
    "27374c77b0209eed0cfb66f07e9a47ba",
    "2c839265b2dec3bfb523d6a9d7066fb9",
    "2c9281ed29f68d2ae295708ef3dd3a8b",
    "38be326d33c46a16b6657ecdf1ea2658",
    "4c606d292ca7ab727b47fbe2368a4cb9",
    "5558be9f06e6512ae583e3aec115cdc9",
    "595e22a29f016f26269e7eb6eac06bc5",
    "67409e9d9fe31937296f135d488610e4",
    "6996a46d2b90828716e73b181c5c0b84",
    "6f81427aaddf8d0d4c9615cf702379df",
    "8012b4ded93b7a653341ed67b8c4fe01",
    "8b0c8c7a39a1043343d305a106ff0f7f",
    "8c7805f33acccb2b9762311573b4828c",
    "93329b0094434adad8ee19bf9d5ce532",
    "9d4ffabf1d8bb38560c8e83ac8599777",
    "b0aa5c0a05231467199d57b7dbe6ad4e",
    "b822063afde44f07034dabcfd3223990",
    "c848b7e5b9687c151dbaa54260fb1b10",
    "cc83e156d5a3665e3b2eb9f33504fb8f",
    "d14e63dfefbb5824d440caf81b414dda",
    "ea898a3cc67d41ccd961969c95ed2262",
    "eb89534ae6a0f116034abbb06f40804c",
    "f73217511227cd1abb25f1fc496cf891",
    "fa51c8348df2c5126eb2e271260250a2",
    "fb0619a023961f01c0c7509211532fb4",
    "ffa310ade886ab5387206c6b3a4425cd",
    "15217be411aa8f5bab1bfb11cc34968f",
    "86fcbbc54249d8781a9020fa9ee7f61e",
    "1001be15f92ed548826a61c8534bb9b9",
    "1a7874f623f1cdded03a52c7fdb671cb",
    "35d82dbf8bade2bc96d347bd0bb5600e",
    "57cf48085542459d0617869462e48a3e",
    "9f4ec7b6d25e969b03c9b4e8760c9d4f",
    "cd0bf66f1857d900fd2cfd235c06a43b",
    "093dfb0e5cad8c919f131e4c416e4786",
    "c173adc52a199fb620c08c4bf5db8aa4",
    "0e367cfc7917885717c33db5a4257a91",
    "e0cf358bc29a4483d4ce8ff428110cee",
    "a6ee8614c96c5e093ccff9eab61fe83e",
    "c09673bf0da2e50f7f45cc09969bfc54",
    "40314292fd0b27935d1d6e4fd221f1b5",
    "4ad57ba6fe82d77fb80e570729dbb409",
    "a59e6ead5e4f27e1da57b35e1cbcb89f",
    "4f2986779a6dae699a3e9d93fcba05cc",
    "8d449b46845a1772725ee4f6caa19e23",
    "1bad0445d7892ffbed6520889cc52f81",
    "08f2ac48b427e77947e99990ee2dd2e1",
    "f91133e09fdf2a2c45f2f0bc3fb657cc",
    "93c918a0938a26c2a88bc23fdcb9ed8c",
    "837b54e78ddf6b3a862b651393b8a9ff",
    "3294614bcae4a85d4824056e175cc78f",
    "4894598ab8fc93ad318dc65da4a7844a",
    "9046da94bf8c424a6225fd2593070065",
    "fd3791755eb502aae428f7d207e5f8ec",
    "b83f56ab9bf14885a34914fb081f5f54",
    "cc74006c3a191a2abc88b842febb697d",
    "315d32a7102a8a3e4ed6785057c56658",
    "d4f646b091e7583ddc1ac0fa7f3dcefa",
    "634a999e5ac0cce709b46b4873aec0d9",
    "ccaa112087dde1d5fae15e75a679fbda",
    "16ed025e58eb706aa6dae62e05a57d78",
    "780c00155eeab0b8f034d3b41ff34271",
    "7bcdcbb799f318fa7c39338fb2c0023b",
    "90f7610f256a7aba9a352cf4e25062ca",
    "b8fde6c959ab946609621a2236ace500",
    "da9b96abfad2269309bc481cbed04d16",
    "857d6a4fb671232ac715f4a2de325bad",
    "1ec729fd03762c893d110d28811537ed",
    "c42611a27d771dc4ca74726c995080f6",
    "7995e9aa930552cfeae9c30ee3b814f2",
    "ef024bc383542eef31b7b126050d9509",
    "ebd6f89d8b6ecbd8e0a8cff587fd1bf7",
    "67a3327a8b2b4f055984a9ff616dc9f9",
    "5233c61cea290e09603482807a941b2f",
    "681b6b69a589151582c5f63a995ffc3a",
    "b867184909b547621c1dfeb095484946",
    "7e44ae46e0edb0982914149b05d2dd41",
    "477b5b8feb0d11c9b22611519926723d",
    "5bd7b41b000c31db5b3a790515bd8128",
    "a9818f24b622eb4080cb7f2d97bd676d",
    "b091425f03d9d60bbab6ce5c73432df9",
    "6a6bf146d969d1b79501cf3671b70a65",
    "400cc5ac9177cd8006cb76b3cf36f9a2",
    "450f102370dd89e5a988eafe9d73eb31",
    "658d45e570ba925a69461cdb0d1962b7",
    "1f9458514d1f492ef46ace9cfd737ce6",
    "7fa2c0b3f2a9291e01f0ebd8240e4124",
    "03966a867021def91291283b2468e021",
    "4bdcb8f40294b5447c9ac7e9b44b1728",
    "fb0ae50670008e38706cefe3f2d1c8b1",
    "2a53554106a25c0e8ee9e69c7e91b507",
    "d69a411d96637e57cd79035470895e1c",
    "2abe062a4f43aa820b4649c5785511ae",
    "114432ec818bba46f0b5c183a739df92",
    "c17f5e64561fe456fa156917e4205945",
    "9de05f078b6dabd8984fc0430cf87985",
    "eeb2e7261abe40a21975ae504a48914d",
    "41e44919229c30802c4372e963d481d2",
    "d460f3c30e53365f598c4c26ca20909b",
    "e4caee48cdc5edd8427e877c6b7e5116",
    "24611ab3316d7c2512b2699ffe2b6dd4",
    "bc16e6c6563296108a98dee66b585913",
    "f2ebb2b66b42d89960d1b4598e27771c",
    "ce61f826111291804c6243cd7ec1026e",
    "7c254e79c604e03b60032dd88c57fa6b",
    "2ea8f8034874d3b1d51c1513e7c0b497",
    "cd2bb88d60aab438dfca74ad3a57a056",
    "a3be22036c823892490da6275204b29c",
    "8fea23b2316f28c1c79fee787f3f707f",
    "3fbae264d57cca31b8849262af6b958e",
    "835f43c9701da66f3cfa811df78a82cc",
    "6ea8e26a013f6e2f2def9305c3928670",
    "958bcf4b28ef4ed544e8221fe7537838",
    "f3c8d39cb21cfb70dedcae715132fedf",
    "e085b85d6cd29580194541b29e50f9b8",
    "c6040ddce6108e9f29769e1206e30c45",
    "65d023d5348b9dbdc913bc5af3ab5ddb",
    "1b47a4f2547acfab95aec235e7fc2453",
    "0eccaa2063c3952e894654be67d2fe3e",
    "85e1a40e565fe2029e53a5558b7b3ede",
    "65cf98faa920e330af93efa280686020",
    "9c84eb8350abdf12095fbc50b4214fe4",
    "ac5275dffe5cea20b237ead010b2e8e1",
    "68715c77b5cd16177e3bbcf951c158df",
    "6cc7b29f077541ce2084ae87d2effb73",
    "046c6e17b3dae9586ab238edb8b2c0f8",
    "03114be12872206e00b951fe6efa8d12",
    "5e05a622f0fa9d9b54bd218cb64bae93",
    "162b07b379f9b916416a71c302680ac3",
    "0d852ff6d523d18ae4e7b29394067f48",
    "1911d81a4bb87abdac179f6e600edd67",
    "c93ac264833a68a7fe25d39176455907",
    "dda49f2427f88eddf23f36bfaaaebfc5",
    "5f4860819d8bcc053bcb3ba774b8b7b0",
    "0f0845e3b292717b734acc269cbcd131",
    "5a4c16e5552a36db93a67d07c5b4f914",
    "d55a75eb85f963788b01aa4f6c19be11",
    "d4a1eee9096d11b95f5968147c5659a9",
    "e4491701b4c18d6b80403e96896f022c",
    "099d0360baeb95b99c0e40d88246ff1a",
    "894cd65ae454987726acb1dd5ccc29a6",
    "5a6643abfbbc293b5b45f910d49ca3ab",
    "63a527caaba558d1a35f2f16829ff6e1",
    "a232b2ff80221ae6069bb3c90db61987",
    "0d403fedf6710d588314c699fc9b7179",
    "8665026c1e82e07fe9443cffbdb4b7a8",
    "4a9d02b7bfaffe9d6fc11d823433bd9e",
    "3e67f451a078adc0afc540811df7284a",
    "65d39d4a3f732a2f69f285acd39ff89b",
    "f3eae51c1880d6c4e56f1341332e34f1",
    "375fca922ec1a6de012ea735f9e1deca",
    "558a5ecf8f9d0f1db16dee962686a7f8",
    "910c0f2752f2aa939aedb03b15a81ba9",
    "507a6fb48cb38d83066c454349ebfd7e",
    "bca5560caeb0d6f1e8f5f138fa84ec7e",
    "0fd75b86b6889e0cc812b0d7f06f7890",
    "5339ac17aad9f89ca437a4a91071faf3",
    "59b1e813727e5253103fc5793fad4c13",
    "4359913139aace50633865a08d43738c",
    "3a55068ee0c70ad1048519aa6c9542b6",
    "939d0a6ff59822945d57d3977b1641cd",
    "48b8c7e1e5065598f1b049c5cc8ae580",
    "f0ce45bdb1699e257d8189c7610bc6b1",
    "c144083fb1025fa903b6e4a9f6cb5e45",
    "686a2aab335b2110fc3f3af7dffc126a",
    "7554a938b9f9286c19015d9f0a824567",
    "65f9e73e847542d53963c60126a6f712",
    "ef67269d4be4ee951912694179e8c3fe",
    "36e74d0c6739225aa0dc738d0b767d36",
    "45fce362fc60deaf2c4bac9d6c161a1c",
    "79f58605ccdc20856bf3f4582dcfb52f",
    "b696342848574c26cfba3179137e0f39",
    "00053a67623f7d8a553c81d04094d84a",
    "0dc775fde941c820afc7f28372e246dc",
    "d45f03d8140954e7db9b2c319b4b48d1",
    "e4dc1847683636d104f8eb31ac118b1d",
    "f0f8863eed7cd5d3d382326bda0f30bf",
    "53e41a0e46a618d7660cd2ba184d38cb",
    "b8512feb80dfd71126d921f67eeda48c",
    "ba587080fc5223fa3a7df6f40dfbfbfd",
    "61ccffe31855f0b5b8af28149212f13d",
    "977b5cd1b1681c1a8065b7af99f3b4d5",
    "c33c999f3741d625f1bee96ebe1207a3",
    "672918bbe5e339a79e630ed5a92eb17c",
    "e43f889ea0377e3e9c54ef47c73538d2",
    "1d3747b8d21b720f0e35c1e62bce8063",
    "ac6eebaac67e0fd817b7d08e8aa8abba",
    "fac2240c490d2b628239a02050cfcf37",
    "f69cb458f174eb1660a373b4d1bafc48",
    "a539a6194cefdfce888e7d3519d2b82c",
    "facb106143bfd94bac3f9a0d98656848",
    "cc46bf92d4585a6b09f6758e6f7d1330",
    "59c27179e3c2915d56ba5aa9b07a942b",
    "c7689a53b36e555a3978703cdfc6865c",
    "fe5a7d5f893bafecfa0bde80a06f46d8",
    "4f0e47bcabf3c100738aea768c703670",
    "944f32d3a2b72485590c9e71d87d5dbc",
    "ac6c8d9f9a1212b8ea841c08510d47ff",
    "c7bd9ef1fcc08cebcee01c8da22bfdc7",
    "789ed1bd2f6e902d689c2d374b5d2773",
    "8c4e09c72bdcacf060b19860b17bcd9f",
    "f64ce5cae375f33c3d627d05f0563123",
    "1587b8df7c28cc3a3bc7692e573b2958",
    "d7519c3a0cdc0880a616c9099e3248b0",
    "dbec1e3aa44205b49cb61e6a1e8c4994",
    "944c8a44362de39ff691292c263ab1c0",
    "a985040f40a338f6fad6118a8b4c98e0",
    "0d19a4d5b00230c7e837cde4f2c06bc7",
    "e8d0df80b11e3811123ef38d4e3cb572",
    "3a4e13a2b5b6dbb260720479fcf04b9a",
    "e429209c59349ab7aff33a12e52e3000",
    "82e0fd7b65dad7608d23700052e67a7d",
    "64c5ac6a4db4974898e6d084db1adc35",
    "b5b9bb81d5277af6330fb40a59f5cc06",
    "910df2e405b21be9c26a4070745b3dd3",
    "3c023aac889269d038505f245d96dce4",
    "bd520ea3514f8c65f4a498adf793a704",
    "738b06e64ae75df25fb8825eb40248ed",
    "bb452a3019d01d38a46ce21ab45a1e9a",
    "0f157322127d4549abeea362353f7e1a",
    "f6be7182202c87a159a8809e8eddb2f0",
    "7c26a389ee22e8ad9cab5069e2b64905",
    "f511edff4178a561d8a5d4a20db88580",
    "9e4e7797dd03f2622539e34bdd059c11",
    "f090a287445af186b258cd14181238bc",
    "9cd1d80eee260a3e03fb0cc4f4ee4fdf",
    "cde7f039aeacb880df122922f1f6d526",
    "7ace1c1ec504ceff9d1e6b2ae56c85b0",
    "5faa525b4e597f38b044e91610af536a",
    "c99fd782f4997ce4ba867ea01d0a3c6d",
    "4a0b268cad2698ab9707eebbcfc81fb3",
    "b6c8cfa44f85c033c3cfaef44622fd26",
    "e425465b03914617d99e1b5bdeda64eb",
    "36a03ad52822ebde19fd19057a56bdf6",
    "b4b86f3112d8785f4395eb2e0aa31c76",
    "1083e28ea75552959e062924001bddff",
    "b67bf5aa997c16b9a6a4ba48d9e71f60",
    "0424092122cf2aa880124587a4554ebb",
    "1024dc823cb3e06ef456f4a7b5f36ed6",
    "ac4730840646d3c4ce2a57fea300df6a",
    "99daf4b4d3a97760f5fa081762b9b173",
    "41b6f35f2b1fe461232745cc91d29e03",
    "d18d9e5a399a04d35eec7daae1cc08db",
    "03a25d2f556f8ac8dbbbca818fa8fafd",
    "dea8fda77cc2969326b6937862497a17",
    "ad5f5afe665caed52932115738c78487",
    "fc638d04dafb3e8acd914d8152218d3c",
    "4feb2e42a96dbeff9af26dfbc5ddbe91",
    "cf39425b50177b7040e5aa2f05a61975",
    "99aa3de8631db4ecdcaf9faef78657d9",
    "37f40ddbc7276b1ae8986cd81c2ac3c2",
    "4c8e8b485c37ddf7def3dfcf23a26701",
    "05cb7d0bc6fafd27ac765ad8f2e79123",
    "c2d0383c2947546562a8865029ded82e",
    "7d0034cc566c6ea4d06252b782dbc81f",
    "743987a726b7dde2cff0e610ee0f21be",
    "7f9e1553a8f1dd2a7af4c620e2254086",
    "b2c71e4096c7a91fb5ea7d47426ca7a0",
    "2a5f79f80dec6439a34af76695c84e34",
    "f596e907ca38b00f08cafbc6ff133ca6",
    "fb2d0f0216f6c61654140ca507fe8ccc",
    "359c16a5dac8dffb292e160e6e87a2fa",
    "3a5950520bba5deeae6547df91bd7e5a",
    "042c3a7670d472014c39fb1f295a5ab0",
    "8fbcb9a05fac3f0932c19d7df7fb928d",
    "f41520f80e44299bb8a4cc984960b5bf",
    "e5714ffdc37e9be984a014c6cad5bfda",
    "c393e4713c446af47f29365c6a7d2925",
    "cd95d7a0d5375f777f869ae208de9a66",
    "e3369d6300e7a557695a2520e43a8dde",
    "ed200cd161974e6f771825f12b561f74",
    "17263d74de2af4b708a376f94e47d580",
    "fab0c0a0bb17aa946f0582b171abb6b8",
    "d17e253c286796e09088c26cc48768a9",
    "ee627172680fad7b501f1c441ace9e6a",
    "1911ff7f5ecb73d025855d2cdf56805d",
    "ba672c9f68f45598acc6e09e17fd76ec",
    "cd5034e54b9b42a7f03ba6d4a25fedce",
    "cd3b8896da717a961d8b58980a8626a7",
    "aa2af79351fc7641a162797fce0edb2d",
    "1b7325a67b8e8bd285ca70ec17dc4476",
    "330d2974aea52ae79edbc01b6b6e0abe",
    "cca037ced2808328f979a971dc8ae9e0",
    "8f054022cbcd8457080e640d54613449",
    "dc8286e56965eb0abff49291c0bb2f00",
    "33ba095d0a0b471ea563e3c7321b40de",
    "b8a3053770f7ec9e4efe88b5dccd8d2f",
    "12022e775be14c4832a4ea53e0db0f85",
    "0c616c2672e4817dc5db9ecee1514159",
    "f3bde23899f351cd503aef7b30c0dd65",
    "de9a45c6e3b653c9db95a0bd04a00d66",
    "be306114e3e8820f39c381c82b822025",
    "152f49771955871a057844b33f063bca",
    "bf85f42e5325211cfa63edc198e194e1",
    "a8ef96ed126d351f90be769f2c662204",
    "b8092b4320c19ac3c92f550e05e7e8bb",
    "16f60098dd79cd8eb3c204bcaefd9322",
    "4da95b292de64ca4787ca31c22249e8e",
    "6edc53a89b7c72ddd7a94c227ce31e06",
    "43cf86268c2fa2f048b14498cb0b64d4",
    "664c4502c1bcba5e3902ee8d604f430f",
    "84ddc9286e1f02c021566c1954f76c61",
    "c3a114ad6a5961d525dc771f75e88cee",
    "768c43f8b2b3fc7fcf781a4b1d3baaf5",
    "c99895e9f4fc6dd25a799ec4ec0028d1",
    "d35fb2ce558492473c61790bd8e34bc3",
    "977085a3ad80f3d68c9726ab00b2da7c",
    "7ab1d38f93cbc923f50069299f21620f",
    "123b2f17958ba4ee38c335f8f90d8c71",
    "00f9dfde81cfe616ec1833352bf7db89",
    "bfb66e9515a9eb5893de78e367dbd97d",
    "09541afdb1bcb7c3c8113352582d7af3",
    "79125f647c902929516b29ef63e69d81",
    "402d59dc873ae13c6568065484e9b22d",
    "70668268d53504b51034f2b9693b3513",
    "5fa70213410db85d0b8222eda81f6028",
    "690892f0a70f4c43def3822a11c210ef",
    "e51f4d7005c405d57035f497334b5d8e",
    "8d79b3a977ed7868dc3ffe5af78683cb",
    "c654da4845c1d60b8300114c29873f35",
    "7385084349b965bc9e5c40a0d9c7d3fc",
    "63e06277c4d46c625f0443b381cac7f1",
    "d29410ea5040495e0d34a39cb52f70b7",
    "e10afaaab20355794cb0e8ffc6e18e81",
    "7cf7964e2d62a87f25b6bf5dc7b36984",
    "2eebdb2cc4fa474272e2d1fb40c00518",
    "142dacb20f59d5d12e46ef978caa54cc",
    "81b83ae886db40c45ef31ff5c9eda9f0",
    "12d47b9d652f3f50b6da9b53ad79bf03",
    "0a2d73cb9a5fc8febbce244420a0bf9c",
    "6784d25ce2ede063aa7dd310c9671791",
    "edf23cb14f6ca58524ab8b2859c6cba8",
    "6d39e657886f9a234a807eb7004bc115",
    "c505ab99e5c3a7129ef7d144d6879bc6",
    "cb94e8e2b910c6b725ab02f24081fd23",
    "5749267101603e390a4f67a8db6ffe9a",
    "49046084b20629da750bb50449473a8a",
    "e8c0883e73b69f62f657f4f865e82898",
    "3521bf3cd14803e8af990c09a83f64c2",
    "5540bbe1307e42536ef5bd5c465386c5",
    "1bd0b99e964240342a1c00dc85d6d358",
    "b63016e5ea2468a3105dbea1963f5d15",
    "75369d2cca94298acc629e3e43ae4d45",
    "2b8e2e1c17c50f0fe61ea61bdeaa90da",
    "61b114b79e394945d1c528f1ab3b26c3",
    "ae1b09831d86e8b5f85e39de96ef2c59",
    "20776f139375791e7b51b3f79ffec17a",
    "0bcfa883b0a786324a0f36f0c282ce12",
    "e878f5b19ce8cf3a7f001da0e86e5a54",
    "9055e12fb79edd8a5f63a7533da40a24",
    "99c54882289dfd8afb8349e9d6062ade",
    "9e89a27f47247fdfb9b3575fa6b85606",
    "5c855bd9ab40a47e3cf2e1ed9b9c3e9c",
    "0d40ddec0b011bdf28a6057482b90e64",
    "098723595c2da7003769d06d2d2361f6",
    "4e7fb1bc942a3df2bde926c1b40c329c",
    "2e1d8f9e2ad89ae45ad70fc63deff549",
    "ebe16bc8905a5acd523c571fa967a1f4",
    "f5367dada4f574041793d24af8bc886f",
    "a29ad6c4810607dbdab320fbba98372c",
    "a640a092021ea1c0487c2d3906037208",
    "ecd9dc35bd61b310fa127e326c0cda14",
    "8f453928a86a739c16d10aefb6817651",
    "0b8422dcd08717d6323e620fd45cd28e",
    "68b64fc7b47221640f1bec160b4d3463",
    "d6bbbca5ae81107ba1df100c5319b09a",
    "9a1bf87c471b476ae357e845cb3da9da",
    "e4a18b901808960d3f911fc979017e92",
    "bb6eb4e0f752c47917b4d9b9d625ddae",
    "5e9ff8894130f79aec429db60f31ebd0",
    "bbe3451340ef627ed609d5008de31295",
    "853fdf9727e66b3337b3bf3af11d0774",
    "251286ee9a0588bdbb73704778cacfc5",
    "81e114a5f2e7b821e50186b962ecdd34",
    "8c6a71966e7ac28ea7563198ef115e5b",
    "fe1c3fb0e4f4052643a2ceffd53c8dce",
    "45af5bd4c548259c39f522f07ba4c9e7",
    "67061b1bb9c0cf01df842ee65d77816f",
    "58536a74d88c99410ed7e44abdcbce6b",
    "1b6e51140bdea71453ea0b263ef5331c",
    "ffc437e48371248630e9c55b31564279",
    "956e754f801bf5eaad98189c0bafd78d",
    "f1f3e9ff51f6cf6da2d2d9a5c08f11b0",
    "b5dff1ee82bc25f36c794d4bc6e304fc",
    "5feffbfec27aabf3a042e017ae4dd4d5",
    "d7100f96e09e985451d0a0c24866eb82",
    "cf08c5e72218e0e0f5b9313a199f511b",
    "889751ff22cb8553d351cc07bcc0b5c4",
    "05797be06e7e45dc858b86e8bf4e2e3a",
    "b1024acfd44237cf1f1c3e1cc45e21b2",
    "d4ba22a190829bdeaa1d5308196acce2",
    "c0a9c3ef3b0671638afa85fa1a226393",
    "645420b38e71ac5246038e8cff94618c",
    "51f7fbe1fcb388c61c9f6b7af347e671",
    "d49ec421a0eaec66e761b71b3dff8f45",
    "9bad65f1328ec66582b14f7ec9c3e595",
    "0062c48217c970b4cd012b4b415a93ff",
    "bed446838abe234e1fa7e0ce0e8781d0",
    "fe40fad0eb87d886bc2db2bd42284d2f",
    "1c497b17ac46a57aae7b75c9ac756c15"
  ]
    let muted = await CheckMute(member.id)
    if(muted)member.roles.add(config.roles.muted, "Mutado por entrar após tempmute")
    //if(index.db.db.exists(`/guilds/${guildid}/users/${userid}/muted`))member.roles.add(config.roles.muted)


    index.db.getWarnings(guildid, userid) 
        .then(warnings => {
            if (warnings.length == 0) return 
            if (warnings.length >= 1) {member.roles.add(config.roles.adv1);
            {if (warnings.length >= 2) member.roles.add(config.roles.adv2);
            if (warnings.length >= 3) member.roles.add(config.roles.adv3);}}
            

    })
    if(avatar.includes(member.user.avatar)){
    member.ban({ days: 0, reason: 'Auto Ban avatar' }).catch(m=>console.log(m)).then(m=>{
        const canal = client.channels.cache.get(config.channels.acacus)
        canal.send({embed:{
          title: member.user.tag + " aniquilado" ,
          description: `Consegui segurar o invasor do reino [avatar]`,
          color:config.color.sucess,

        }})
        return
    })}else if(member){
      verificaIni.forEach(m=>{
          if(member.user.username.match(m)){
              member.ban({ days: 0, reason: 'Auto Ban [nome]' }).catch(m=>console.log(m)).then(m=>{
                  const canal = client.channels.cache.get(config.channels.acacus)
                  canal.send({embed:{
                    title: member.user.tag + " aniquilado" ,
                    description: `Consegui segurar o invasor do reino [nick]`,
                    color:config.color.sucess,
      
                  }})})}})}


 



})
