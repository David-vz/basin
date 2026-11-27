/* Basin offline (docs/web-build.md). One folder's worker: its scope is the folder it is
   in, and its cache is named by that folder and by the build, so no build and no other
   preview is ever served another's files. The page starts it once the game is up
   (shell.html, api.up), never before, and the game never waits for it.
   Files go into the cache as they stream, one at a time, and only if they are, byte for
   byte, the ones this build was made of. A new build waits until every tab of the old one
   is gone, or the player asks for it on Home.
   addons/basin_export fills the two __BASIN words. ?f= is this device's texture family
   and ?t= its quality tier: the others' files are not fetched. The music's sections
   (index.mus_*.ogg, 38 MB in all) are not fetched ahead either: each is kept once it has
   been played, so what was heard is there offline. */
'use strict';
const BUILD = '6b0a11890fef';
const FILES = {
	"index.apple-touch-icon.png": [
		"a187d78ec1f1791b246a3af6ecb6e5d46c6606d3b4e42382c95c566cffc963a6",
		10339
	],
	"index.audio.position.worklet.js": [
		"67022b394524e66008a60c128ea5ac3d24eec3ecf4736b0693aab9aeb599cb91",
		3033
	],
	"index.audio.worklet.js": [
		"37537f24bc3da5adfe4c1274ef87fca8c4db7b49912a553b464b1620b00cdcf5",
		7397
	],
	"index.clim_etc2.pck": [
		"d1554f47c4544e81efb7f270fbb3d9925fd3de56e13c462922fafe79d885d8b2",
		1029544
	],
	"index.clim_s3tc.pck": [
		"d75a13f73d215464bf469d1718ca6c1ed4e81ec7cecf22c8fc936003bf8887a5",
		1029544
	],
	"index.html": [
		"32a00c1401f076d643c9baa3a24fa52ff1fbdec9f87ccd2b420f9fe1e6feb228",
		71856
	],
	"index.icon.png": [
		"4e41f4ed0c43431b419978274885448dba882cbd2b9ed0a0dcaa2648200d4f2d",
		14518
	],
	"index.icon192.png": [
		"7c2158b4ad94e393a2a5779da5dc2ddc7be3fc304695299c7c09d82eb6eff8b9",
		11071
	],
	"index.icon512.png": [
		"a7acff5945756b90fd7730a9b939e4a1966a0824e0368600be9dddaba7fb04e9",
		28349
	],
	"index.js": [
		"b00e0d6f14c4dc5659d5c96dde34e37cda46dbb8763752000da7063a563adb84",
		244692
	],
	"index.links_high_blob.json": [
		"420e21d850f92ea4f153a7ced429805b3cc0dd850ced5e36a36284efa86ed08f",
		386411
	],
	"index.links_high_goo.json": [
		"fdb819c698ce714564ec369523a7222a13d6913a14c958fd40f07cf0774b7b13",
		401067
	],
	"index.links_high_off.json": [
		"c6985fde2b468e3c25ceca75ea03f237c340b12d981433f94003e96b01a6cadd",
		364648
	],
	"index.links_low_blob.json": [
		"c9a15f9b7ec82defeac05e0ca1dac9939694a2c14b2ff0ff6d86cd5fc91b0089",
		383342
	],
	"index.links_low_goo.json": [
		"77b139f73cb2c3022178f845d89dd2befce100ee95823141438a74f7999a9075",
		398099
	],
	"index.links_low_off.json": [
		"3726a1dde400af149bace9631b71549a17386a396686b2e6095a2d959db7f869",
		361544
	],
	"index.maskable512.png": [
		"ea0c00e54a683bae9a234f79b11c62b88f5a55f581c65e587ce71f5caec8793e",
		24322
	],
	"index.mus_autumn_01.ogg": [
		"15db27e08b4b0516213e3ba36c597eaf34ec8e4eaa6923adacb21bee70bfa67f",
		290181
	],
	"index.mus_autumn_02.ogg": [
		"effabee28008121f9f909c1c46f4098d92298865fb1097b1fc1afba3ffa6c301",
		396239
	],
	"index.mus_autumn_03.ogg": [
		"1bd6edf23e82f05a5719dfe0ec77eb61a25ace0fca23f27f9d704d4b276340eb",
		398963
	],
	"index.mus_autumn_04.ogg": [
		"9777ea09c7f3817339308d085c7449521962024d0852072af8cbbf97c10a0b62",
		357132
	],
	"index.mus_autumn_05.ogg": [
		"d4fcd90ed3ceb5ae6bfaff714d8a54777ad95547f500dbe9fc770f8569c46d92",
		343406
	],
	"index.mus_autumn_06.ogg": [
		"8819773d1738c0337d221108878d9d8664cfea38684df1d50eaac4e8f1b77f89",
		389124
	],
	"index.mus_autumn_07.ogg": [
		"632dda0674bde7b7a38aab40cc24e9bfabf5c4963155a7802a798a17e0ba87cd",
		405010
	],
	"index.mus_autumn_08.ogg": [
		"74d77f9559595ca9bf83cad66dfcc3d6767d2744ca26db12d9ef453484ddb099",
		315993
	],
	"index.mus_autumn_09.ogg": [
		"6da878b9e34b8264d408d81585f9f6f283d4fb8ef5ed805dd3d147d4417083a7",
		398774
	],
	"index.mus_autumn_10.ogg": [
		"dd97f62ff25a8db33a24be012432aefe3a00e6a6f4a409ec032b81fa51e24dc4",
		410050
	],
	"index.mus_autumn_11.ogg": [
		"3ccb70d3bc4225b229146aa8aa085e860fa9c152cc061ab7ae4a84e290afee0e",
		360041
	],
	"index.mus_autumn_12.ogg": [
		"33ff0f147b15a5e602d418f6cf0a0a0a85369c6a6efddb0ad83a9618f29448fd",
		347775
	],
	"index.mus_autumn_13.ogg": [
		"68dcfc161832f8d77b5077b831aff51f2ad046007efb1b2f9bfe506ea6d5f7a1",
		387435
	],
	"index.mus_autumn_14.ogg": [
		"9c4b3a115d802fdd82e15bcdffffa424597c5c8c49afd851febf0759d981ace4",
		389018
	],
	"index.mus_dusk_01.ogg": [
		"23ec62ddb24d1e565ac648c78970e440268be3d73094cbff92be8121635b0bfa",
		265106
	],
	"index.mus_dusk_02.ogg": [
		"d1000ee9d5d8be95c46aeee358cb4db2d447132a42fbf6ebc27bf76180a9886a",
		317746
	],
	"index.mus_dusk_03.ogg": [
		"7c8071b1ac5143b6544e25ae91362a6bf1d0bfcd9d8fd90125ffec05013c02c2",
		322331
	],
	"index.mus_dusk_04.ogg": [
		"b7db831e69ef046847c604ea1009bd9d90f69e4b9252e5f3b8e4eb4c091fbe56",
		276790
	],
	"index.mus_dusk_05.ogg": [
		"2ecb21acc32fc266b5bd5e57270a4cc219ba3db18cd1a4307b120f93cdfb94f9",
		266269
	],
	"index.mus_dusk_06.ogg": [
		"d5d00b893e47b98e221402acb49895f89da219156c8932e1ebab2b9738764526",
		352094
	],
	"index.mus_dusk_07.ogg": [
		"947e95f6b7b30d917a00f2aa4b0c9076073ed5eeac14c0b3764e2124b9c66f66",
		368461
	],
	"index.mus_dusk_08.ogg": [
		"0e84e1352ff79be960bdae03d69c0d480b30f8bb347db05dce0bcd607734ca47",
		300930
	],
	"index.mus_dusk_09.ogg": [
		"3b8e0a91628bb1476818489c60ea0b8ba879307a90f141d269bbfc92df7772a4",
		267592
	],
	"index.mus_dusk_10.ogg": [
		"51ca23aed0d5f6bcd76bca9e6f89336974e84deac8671978e339f189640ad627",
		314679
	],
	"index.mus_dusk_11.ogg": [
		"27546dc8e50864b68ef72d4eefad4efc634255bfd66a43c7edcd0226164a3014",
		312681
	],
	"index.mus_dusk_12.ogg": [
		"a99d64c778f25bc036a0430e007ce523be34ae70f71095be6d3e38d908823c16",
		268048
	],
	"index.mus_frost_01.ogg": [
		"20bc123765ac0ba7a034091cf26b5dcf37000cef5bf678995508aebcf62a388f",
		282643
	],
	"index.mus_frost_02.ogg": [
		"abb07c753d23097eb1c12595b7ce4d73f81a743cbeb39ab5a63a76256f244f97",
		325454
	],
	"index.mus_frost_03.ogg": [
		"e46b69dd409724b50a68f395803d7aa75cd0561d66d2b97b2efb78f08725244f",
		252750
	],
	"index.mus_frost_04.ogg": [
		"3d4f8e9f58d01976a29c819d0c400b95614ff4965dec0fefe9976bb68c093478",
		297385
	],
	"index.mus_frost_05.ogg": [
		"29cbfcfb3ac4d09bcfa94525051db2d6c7235eddd67c8b43640948f84cf8fb0b",
		289549
	],
	"index.mus_frost_06.ogg": [
		"da6bebb6f061955d3aaedd23e77f6f7354c6098269b8e699a306821499f28f17",
		244122
	],
	"index.mus_frost_07.ogg": [
		"a2a1c7a9214afb034fcdfe8106dfcc486b9b159719028c19659ad7f5024c3142",
		272136
	],
	"index.mus_frost_08.ogg": [
		"185aa0e91cffa0a9095498a16c6819f86f505c0d3683e941194b9143acc8da16",
		274245
	],
	"index.mus_frost_09.ogg": [
		"9fc30db51f4420f8298ab4512ed2b693a77b9249202a67d9cf9b6abb86df8d08",
		238645
	],
	"index.mus_frost_10.ogg": [
		"c26bcd5657c32aa198af8aba85664af85e5f8f59536b83108466f9cc966d60ab",
		272325
	],
	"index.mus_frost_11.ogg": [
		"e58c377b10b52ad60c9466d9ff2effb78e1c10f0b36290a780cfcbd7d2d8e830",
		330578
	],
	"index.mus_frost_12.ogg": [
		"b588471eaba8337fcb0668669824436aecff436defc206fc605fb2d2efe61e14",
		341328
	],
	"index.mus_frost_13.ogg": [
		"4e221aca3166da71f4962af06d17c90c81a26af6286dda34aeb018664b1ad146",
		293702
	],
	"index.mus_golden_01.ogg": [
		"e09eebf917b98d4331f6922e41c217fc558a113c5d078810f8298dd98cde6f64",
		245229
	],
	"index.mus_golden_02.ogg": [
		"7e7394be71b66e292ad67f4350d322b5bae4e1a922021d5ea0b795d92fe10dd8",
		341424
	],
	"index.mus_golden_03.ogg": [
		"e46e07150fbc3f9d95f5669078b84afad4a179a84d733d3b09d606adadfb675a",
		342023
	],
	"index.mus_golden_04.ogg": [
		"07fde6a09a3eb45bef11610474d854ac30a709bf1e3caeeebbfd1a0a06f42528",
		273323
	],
	"index.mus_golden_05.ogg": [
		"5a4e5e8ae066ad64a842619c95649a33f872560e3fc7b5370e4dae25b2d4cd74",
		294081
	],
	"index.mus_golden_06.ogg": [
		"92e5d3ef151ab993ad1f2f13ec11cfa9a9376d1a75503fcec9e46f535c6e975b",
		349622
	],
	"index.mus_golden_07.ogg": [
		"2d506ceb3d871382dad14b47c18dad3b1c3e04b0f3d85534535ea1f7db6280cf",
		353837
	],
	"index.mus_golden_08.ogg": [
		"a6e67e347090039d42835d45bed4cd84bcb4734e45358503a296868fd87fabb7",
		302578
	],
	"index.mus_golden_09.ogg": [
		"666da17cfa99f3c9d880efb2c9272e8c02b954cb9ffd55dc74dceea2af6118e4",
		315831
	],
	"index.mus_golden_10.ogg": [
		"50413250e051ac92877c6a4a04230f115bacf9a58b05d4da4eb4b207c0cabbf7",
		362751
	],
	"index.mus_golden_11.ogg": [
		"8bf4a2da687dc45e5cb88ac9a36eb64f525402487a1d8d1b77f717aaca7fbcaa",
		366823
	],
	"index.mus_golden_12.ogg": [
		"3ca5962fc126cd952ad22769bab4c52ab46dd100eb8df1ebf55e821821944eda",
		306205
	],
	"index.mus_golden_13.ogg": [
		"fef4a5f9e8f65e5bae145baf1c71623b996abd70e5d7ae8526c132df6bb1685e",
		273723
	],
	"index.mus_golden_14.ogg": [
		"15cb97df0a5d47b8d58a56ece53d7404658258a7319c95c7fe2310f70ac0db2f",
		332361
	],
	"index.mus_golden_15.ogg": [
		"82bc0f6a9a374d30b810b22925ba5d0209bf3f0a67749c2d57a9e84fa101ea05",
		354165
	],
	"index.mus_golden_16.ogg": [
		"4c22f17a10e9ba6c636485ec483f28c7e96f70d97f560de6677a57961387fa44",
		297863
	],
	"index.mus_meadow_01.ogg": [
		"3b0701c09b1f8e19509146c91f5d31b6c897030f22f94e94871e4c78e46985f6",
		217773
	],
	"index.mus_meadow_02.ogg": [
		"06bdf2e7717e90297f87105cd1ef76e4c3ce0366b775158b56b0af49b55677f5",
		355020
	],
	"index.mus_meadow_03.ogg": [
		"e445e15d55ea8261acb5538541ff4b6f6d48f20b67f777dce8e9607b8adde3b1",
		384007
	],
	"index.mus_meadow_04.ogg": [
		"26b0a87f7ce298bca0996769187bb464c2fe6f6a8770fddb8639c5ca779dc440",
		334783
	],
	"index.mus_meadow_05.ogg": [
		"c2dbb54d5142f6a6f90e243d0d6eaf0c97b67b752e0fd257fa1f506bb9ea1399",
		246170
	],
	"index.mus_meadow_06.ogg": [
		"b11ba64b94467dfb25107a664e8edf8eddf54a690763aba883486fac6c56e0f1",
		341417
	],
	"index.mus_meadow_07.ogg": [
		"415b3bd5b705979136a1bbad1ea0d78837f0c1f7700a87e37ab3ab6d4e291638",
		371604
	],
	"index.mus_meadow_08.ogg": [
		"d3a7f897defea235d7ec4c72e07f5b466ab09bdc814899a96bf177b207261e87",
		324883
	],
	"index.mus_meadow_09.ogg": [
		"c9875ad6b8b9ae43a85c4d41be9b61440849ee2d6e30058cb9442e5cc63e0c43",
		336793
	],
	"index.mus_meadow_10.ogg": [
		"14083a9171c4b63f7b5239a814ffc7df4a84d78897a35418983308b5f01948e8",
		381486
	],
	"index.mus_meadow_11.ogg": [
		"c4975f60c951e05d1a1eab0e5d2808fde083bdea0bfbd10cac780ec344fe78f2",
		385580
	],
	"index.mus_meadow_12.ogg": [
		"2c2be2fe0bec2aca0bb2ceae77c922b44e74b91317da1fe1b018b228ece8bee8",
		345432
	],
	"index.mus_meadow_13.ogg": [
		"9647589c548c45bf0cb7d8e9f06ebf12f7a732fa8b593b356cf3cb107ab892ae",
		246176
	],
	"index.mus_meadow_14.ogg": [
		"687cc9da6398a930e25acd9bac58f41c2870e9c40e774f29a410be722debbb8b",
		312080
	],
	"index.mus_meadow_15.ogg": [
		"8d2b443dd5abe91b3d9f777ec3fe62df2dfddbae973dcfdf90c9d6344f72003a",
		313783
	],
	"index.mus_meadow_16.ogg": [
		"8510ada0636e8fdb6509a37c4c35e2267f01a0d217c078097a7882bb00d09ca9",
		268499
	],
	"index.mus_meadow_17.ogg": [
		"387bdc4659d8762a7f8de3a14263ee690ca703b28147ec38b0bb5be35ad7f980",
		244469
	],
	"index.mus_meadow_18.ogg": [
		"a594ee768edb28cecddd8e070ac5da50fb7f7bc30b54c7c0ad4caec7c36f315c",
		362361
	],
	"index.mus_meadow_19.ogg": [
		"da5fb33a8c0adffde432844b98363f5d348765a6f2861a886768b051aaeaf885",
		316240
	],
	"index.mus_oasis_01.ogg": [
		"c947330e819637677d9bc20313845d1408ef3f956aec1d4c0098e4fe11f57983",
		342950
	],
	"index.mus_oasis_02.ogg": [
		"35c4f602372aacacd4d74ccad0ee8c195d7fd2fd8c0af58dd2ea3609f9f718fe",
		374338
	],
	"index.mus_oasis_03.ogg": [
		"a7879341362c3e869bff3d89326370381c8dd40a550365e70f1098f4f24cffc9",
		370502
	],
	"index.mus_oasis_04.ogg": [
		"d1849fd74ca0e67c63f84a505f54dae8df63018e71ffcd07e7f04a7d27eea642",
		338440
	],
	"index.mus_oasis_05.ogg": [
		"637ccf8d33282aca22d38638634955d6f22f0d837c3e03f9a5adfa4e2203b46c",
		305769
	],
	"index.mus_oasis_06.ogg": [
		"5a55bb879bc4fbe34f3a5eac68d42de663035b319a0037726ecfa992b4e2b8df",
		358603
	],
	"index.mus_oasis_07.ogg": [
		"aa7bfe6e4e9a2e8215db0f5c5181022dde9f24e413900abc109c05e2838168af",
		312103
	],
	"index.mus_oasis_08.ogg": [
		"0fbd70602c12ae3a4f8ee770bc730a6771b95dcb757e59a1cd796973015b5d00",
		175316
	],
	"index.mus_oasis_09.ogg": [
		"fd4abcab4efbd5f55b04b099c7c762b03d5059b62a643d95e4dab6a2d5962855",
		366942
	],
	"index.mus_oasis_10.ogg": [
		"582bdc88ac65897e7be50554008ac7cb62e75065dbad68980682a7adca296b47",
		373846
	],
	"index.mus_oasis_11.ogg": [
		"146d7152a7a6dfd3aeeb43ff92399cb9d806be85ee789d6ae70432e4bccc5817",
		315560
	],
	"index.mus_oasis_12.ogg": [
		"843afb93a5265a96f0cc6e12193afc1dacf5b2b05cbf2882e6f99b0af0d2c4a5",
		173304
	],
	"index.mus_results_01.ogg": [
		"268614d4dc6c5f2a8c4e7a85e7aa42c2d68d1e0aaf3febb3a9e42c4fb5058e18",
		345231
	],
	"index.mus_results_02.ogg": [
		"6c7e0f287ed50707e29004bf8648d7add50a2274ea8a19ec7fa62b0b52bcec59",
		383659
	],
	"index.mus_results_03.ogg": [
		"f24648ca16edbf22cd9109510035838c35d763011bb5fb2b804a9dd8b036ed5f",
		381531
	],
	"index.mus_results_04.ogg": [
		"9659ecb9f9080237f8d055ab00f4a0e393a867b64c05f2a068a050e447edf0f4",
		321444
	],
	"index.mus_results_05.ogg": [
		"62759d13086bac101cec10875ac2f65c1bad5803f17d53e48311f618bd8b9f9e",
		342326
	],
	"index.mus_results_06.ogg": [
		"637d77551dc44b6f7bcdd1c2634c951397693a6b119d1df1b812e69a0f7ceda3",
		386962
	],
	"index.mus_results_07.ogg": [
		"48e5d823511f730ae4e99c2eef13a4311fd787608b70254bd231b81a3e036af5",
		388294
	],
	"index.mus_results_08.ogg": [
		"a985b51c937fc79eca2340882a38a2dbb04a918cd3e8db5fe17063a66e75278e",
		327723
	],
	"index.mus_title_01.ogg": [
		"68155016c423a113f84f3f3957846476dd75f47a08993f327a8605bef36a2965",
		304164
	],
	"index.mus_title_02.ogg": [
		"6eebc5cb30f626a41e29703fc8ba0123895efa7107ee2ca485acd26a65a98588",
		342259
	],
	"index.mus_title_03.ogg": [
		"400f802d971de0e7ca791c9e90d1a98d191ec8039ab0389bb6c315e48aa18e5d",
		368722
	],
	"index.mus_title_04.ogg": [
		"4b370fcd442598e58846eeb84e99c57aa17604676f31cf967bc45493b91bea08",
		315383
	],
	"index.mus_title_05.ogg": [
		"ace09a22eae2a563722ba65f4f32e252c7686816db2cace005aaf13e7922a0e0",
		346209
	],
	"index.mus_title_06.ogg": [
		"87eea61a3198166e2283d04f7c13fa52f4e6bb0132d38194ad277b8c9757ad5e",
		398644
	],
	"index.mus_title_07.ogg": [
		"39f7cd8ec54afe8e3126d38fe386078e4b4cde0dd1a16a2ec202bb3cccb7e280",
		402211
	],
	"index.mus_title_08.ogg": [
		"fded89f11bf19a81865b83b65e7acc558fe0eb938d9564d3500ac15db054d6e4",
		346495
	],
	"index.mus_title_09.ogg": [
		"d9c74164c1807a2ad958d6cc631bd6ff46dcebcde6e9f61931c8f607d5be7da4",
		331060
	],
	"index.mus_title_10.ogg": [
		"c79a148beaf0af3d164f372e84068828306584ffb8f4ebb12cb94cb9d643ac67",
		386604
	],
	"index.mus_title_11.ogg": [
		"5d768d2524cd53064caef8adbe132cf77630297a76072ed07ad9941666330157",
		386374
	],
	"index.mus_title_12.ogg": [
		"ab45861cd6b1c2542a89e627224415632b27fb116d78a75aa52053b3dd4fbed7",
		339901
	],
	"index.mus_zen_01.ogg": [
		"b3db81cd5e6f4eac96ccc4a9c704e27ce47392e5706a2c1f9b23671eedefc26b",
		309045
	],
	"index.mus_zen_02.ogg": [
		"01571a240fea99de29d106e9211733e1fc9c16c7f8660265174c56b0d36303f2",
		354851
	],
	"index.mus_zen_03.ogg": [
		"20aa7113a871c87a71be4c4bb45bf1e507acb27b6cf3064383f03068d1c5bcf8",
		354312
	],
	"index.mus_zen_04.ogg": [
		"21420d4dbadc1e7251bbfce7f7335dc7cb72640a77ca2d0022314e06e2178891",
		288232
	],
	"index.mus_zen_05.ogg": [
		"cafefcf193d5fa23be84d689732cb26bfcc5e314ee7740c95d00cedc5a345a6f",
		293283
	],
	"index.mus_zen_06.ogg": [
		"798cf369157f912a33783f82e6aec178dbfebc7826c67b879528d8f6cc6ae77f",
		306683
	],
	"index.mus_zen_07.ogg": [
		"ced859cb7cfdbeffe734b36899c1459e1c51f988666c4433d528ae53b0a49ae8",
		262648
	],
	"index.mus_zen_08.ogg": [
		"e858d12702f9eaa6b554829c3cb595c3e18063ee990f07b2959594113069f511",
		327484
	],
	"index.mus_zen_09.ogg": [
		"27dc9041fba39cdee79ce9f2246fed13c59454041ccf6ae739a3ac60c058856c",
		335538
	],
	"index.mus_zen_10.ogg": [
		"246c923f89e82d715c3c59dc18f6012aee5b35911a06d34c2b388950d9ab7e9a",
		285118
	],
	"index.og.js": [
		"2af822e6d7ceeb2ee41a13168e41bb5c3d3b946c5035f60690335f7c4423a580",
		54147
	],
	"index.pck": [
		"73b81fb3676f2e84bd6e4a9588fe476231b49a2df844cc2044619ebf55ec5317",
		2731548
	],
	"index.png": [
		"049df7647f742956d2427474e7c7a32d5e410a9f04e962ba009b45a3c06b86a1",
		12239
	],
	"index.snd.pck": [
		"70357ae88e696fe80afdb9996a13d1288dd628e1670d7095a9fab48eacb400e6",
		2386472
	],
	"index.tex_etc2.pck": [
		"629861dfe024c9f7e5948ecdcbccc1396254f3785c3fca8f251c6d306f2669a5",
		767108
	],
	"index.tex_s3tc.pck": [
		"50a6e9a8d25e7574a4a1ec380bf520096efc9ba761922a449478b548fed2b1ca",
		767108
	],
	"index.wasm": [
		"15397ff3478ea228a649dabcc437a4882cac970b8450c7a20c5c83f06cfc1ac0",
		18211997
	],
	"index.webmanifest": [
		"b3b5657c247199e06e308537ac1e3e25ac0bfc6b436d7583d2bb492a9e876fe8",
		588
	]
};   /* name -> [sha-256 in hex, bytes] */
const HOME = new URL('./', self.location.href).pathname;
const OURS = 'basin:' + HOME + ':';
const NAME = OURS + BUILD;
const ASKED = new URL(self.location.href).searchParams;
const FAMILY = ASKED.get('f'), TIER = ASKED.get('t');
const TYPES = { html: 'text/html; charset=utf-8', js: 'text/javascript', wasm: 'application/wasm', json: 'application/json',
	webmanifest: 'application/manifest+json', png: 'image/png', pck: 'application/octet-stream', ogg: 'audio/ogg' };
const MUSIC = /\.mus_[\w]+\.ogg$/;

function wanted(name) {
	if (MUSIC.test(name)) { return false; }
	const fam = /\.(?:tex|clim)_(\w+)\.pck$/.exec(name), link = /\.links_([a-z]+)_/.exec(name);
	return (!fam || fam[1] === FAMILY) && (!link || link[1] === TIER);
}

/* SHA-256 as the bytes pass (the browser's own wants the whole file in memory at once). */
const K = new Uint32Array(64);
for (let n = 0, p = 2; n < 64; p++) {
	let prime = true;
	for (let d = 2; d * d <= p; d++) { if (p % d === 0) { prime = false; break; } }
	if (prime) { K[n++] = (Math.cbrt(p) % 1) * 4294967296; }
}
class Sha {
	constructor() {
		this.h = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
		this.w = new Int32Array(64);
		this.rest = new Uint8Array(64);
		this.had = 0;
		this.bytes = 0;
	}
	block(m, o) {
		const w = this.w, s = this.h;
		for (let i = 0; i < 16; i++, o += 4) { w[i] = (m[o] << 24) | (m[o + 1] << 16) | (m[o + 2] << 8) | m[o + 3]; }
		for (let i = 16; i < 64; i++) {
			const x = w[i - 15], y = w[i - 2];
			w[i] = (w[i - 16] + ((x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ (x >>> 3)) + w[i - 7] + ((y >>> 17 | y << 15) ^ (y >>> 19 | y << 13) ^ (y >>> 10))) | 0;
		}
		let a = s[0] | 0, b = s[1] | 0, c = s[2] | 0, d = s[3] | 0, e = s[4] | 0, f = s[5] | 0, g = s[6] | 0, h = s[7] | 0;
		for (let i = 0; i < 64; i++) {
			const t = (h + ((e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
			const u = (((a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
			h = g; g = f; f = e; e = (d + t) | 0; d = c; c = b; b = a; a = (t + u) | 0;
		}
		s[0] += a; s[1] += b; s[2] += c; s[3] += d; s[4] += e; s[5] += f; s[6] += g; s[7] += h;
	}
	add(m) {
		this.bytes += m.length;
		let i = 0;
		if (this.had > 0) {
			i = Math.min(64 - this.had, m.length);
			this.rest.set(m.subarray(0, i), this.had);
			this.had += i;
			if (this.had < 64) { return; }
			this.block(this.rest, 0);
			this.had = 0;
		}
		for (; i + 64 <= m.length; i += 64) { this.block(m, i); }
		this.rest.set(m.subarray(i), 0);
		this.had = m.length - i;
	}
	hex() {
		const bits = this.bytes * 8, pad = new Uint8Array((this.had < 56 ? 64 : 128) - this.had);
		pad[0] = 0x80;
		const end = new DataView(pad.buffer);
		end.setUint32(pad.length - 8, Math.floor(bits / 4294967296));
		end.setUint32(pad.length - 4, bits >>> 0);
		this.add(pad);
		return Array.from(this.h, function (v) { return v.toString(16).padStart(8, '0'); }).join('');
	}
}

/* Puts one file in the cache, if it is the right one. */
async function keep(cache, name, how) {
	const r = await fetch(HOME + name + '?b=' + BUILD, { cache: how, credentials: 'same-origin' });
	if (!r.ok || !r.body) { throw new Error(name + ': ' + r.status); }
	const reader = r.body.getReader(), sha = new Sha();
	const body = new ReadableStream({
		async pull(c) {
			const got = await reader.read();
			if (!got.done) {
				sha.add(got.value);
				c.enqueue(got.value);
			} else if (sha.bytes === FILES[name][1] && sha.hex() === FILES[name][0]) {
				c.close();
			} else {
				c.error(new Error(name + ' is not of build ' + BUILD));
			}
		},
		cancel(why) { return reader.cancel(why); },
	});
	const type = TYPES[name.slice(name.lastIndexOf('.') + 1)] || r.headers.get('content-type') || 'application/octet-stream';
	await cache.put(HOME + name, new Response(body, { headers: { 'content-type': type } }));
}

async function fill() {
	const cache = await caches.open(NAME);
	for (const name of Object.keys(FILES).filter(wanted)) {
		if (await cache.match(HOME + name)) { continue; }
		/* The page has only just fetched it: the browser's own cache gives it back. */
		try { await keep(cache, name, 'default'); } catch (e) { await keep(cache, name, 'reload'); }
	}
}

self.addEventListener('install', function (e) { e.waitUntil(fill()); });

self.addEventListener('activate', function (e) {
	e.waitUntil(caches.keys().then(function (all) {
		return Promise.all(all.filter(function (n) { return n.indexOf(OURS) === 0 && n !== NAME; }).map(function (n) { return caches.delete(n); }));
	}));
});

self.addEventListener('message', function (e) {
	if (e.data === 'now') { self.skipWaiting(); }
	if (e.data === 'build' && e.ports[0]) { e.ports[0].postMessage(BUILD); }
});

self.addEventListener('fetch', function (e) {
	const url = new URL(e.request.url);
	if (e.request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.indexOf(HOME) !== 0) { return; }
	const name = url.pathname.slice(HOME.length) || 'index.html', build = url.searchParams.get('b');
	/* A page of another build (an old tab) asks for its own files: they are not here. */
	if (!Object.prototype.hasOwnProperty.call(FILES, name) || (build && build !== BUILD)) { return; }
	e.respondWith(caches.open(NAME).then(function (c) { return c.match(HOME + name); }).catch(function () { return undefined; })
		.then(function (hit) {
			/* Music is kept as it is played (the browser's own cache gives the bytes back). */
			if (!hit && MUSIC.test(name)) { e.waitUntil(caches.open(NAME).then(function (c) { return keep(c, name, 'default'); }).catch(function () {})); }
			return hit || fetch(e.request);
		}));
});
