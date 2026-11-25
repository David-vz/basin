/* Basin offline (docs/web-build.md). One folder's worker: its scope is the folder it is
   in, and its cache is named by that folder and by the build, so no build and no other
   preview is ever served another's files. The page starts it once the game is up
   (shell.html, api.up), never before, and the game never waits for it.
   Files go into the cache as they stream, one at a time, and only if they are, byte for
   byte, the ones this build was made of. A new build waits until every tab of the old one
   is gone, or the player asks for it on Home.
   addons/basin_export fills the two __BASIN words. ?f= is this device's texture family
   and ?t= its quality tier: the others' files are not fetched. */
'use strict';
const BUILD = '6b06861c2920';
const FILES = {
	"index.apple-touch-icon.png": [
		"28b560559db64a6fccb9e78ee5c0413ca8194407f7c4a7d864bf2ca45a305e1c",
		7287
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
		"8a81b98d66f380dd121b879d7d18832848ff3de8b8168b43d1473f9239c26d2f",
		47117
	],
	"index.icon.png": [
		"bffba01d5ebad349f5cafc23a725ba8b326061f17d0914604ab16c9f080b3bf3",
		9014
	],
	"index.icon192.png": [
		"d6c01f7b071d06416c87a04929dbb372a507377ad98b14449ab0915b3d2bb04b",
		6744
	],
	"index.icon512.png": [
		"f2ea05bdead66b49a1d6c0c74cfe2aa1bc86b8a8d23da0a16f07527ad684226d",
		18829
	],
	"index.js": [
		"41a9f26f6718ea1e5edde740282e4b6fb485ded53ed6d22dda4c6f474827e60f",
		244440
	],
	"index.links_high_blob.json": [
		"c10589423d9b3edd06b92a981652b919aab2c0b12b98a15077d95b424a1b83fb",
		334799
	],
	"index.links_high_goo.json": [
		"b6245c1ac780693f8dc2b4e5bee1d334bc481b4bcec4e3555b618e07fa680082",
		348979
	],
	"index.links_high_off.json": [
		"ddc715cec588da7d243cf4fcc9d895057cb77e2d7b7c63785c80dbe97447c14e",
		313355
	],
	"index.links_low_blob.json": [
		"d5e42845a4e153bb1a58d8032e4964bc01d8fc5a3a990a761503bb54adbef7aa",
		331730
	],
	"index.links_low_goo.json": [
		"659f0aeabd85a2aaac6f4030b11f029894b0045db9a5416087a2bce8bc64e75c",
		346011
	],
	"index.links_low_off.json": [
		"bddf223da41a1d7d000f38c94083f5385b4a257b2db6f1129e48dbacf544e21f",
		310251
	],
	"index.maskable512.png": [
		"ffac6b9c54a760f68cefd2864bffa4d9f38ed35cf305119e6cdc3c9cc61386ea",
		15827
	],
	"index.pck": [
		"db9715cb31c00e9809a4ed251fa60d114a54a8a8f16235c04f923d6ec7fe67b1",
		2099804
	],
	"index.png": [
		"b97eb76157c91eed1c8b50b03c797f6d42cdb52c62c4341003f39a8ffea4abd2",
		12737
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
		"75287f89f3386ec0a6c8e50fc38d9ddcd1678aa60667c5925e00f519ec79299e",
		18209702
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
	webmanifest: 'application/manifest+json', png: 'image/png', pck: 'application/octet-stream' };

function wanted(name) {
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
		.then(function (hit) { return hit || fetch(e.request); }));
});
