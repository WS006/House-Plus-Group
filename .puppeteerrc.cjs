// Never download Chromium. The build scripts drive the Chrome that is already
// installed on the machine (see the executablePath candidates in tools/*.cjs),
// and prerender.mjs exits 1 rather than publish blank pages if it cannot find
// one. On the Cloudflare Pages build machine nothing downloads a browser at
// all, because the build only copies the pre-rendered docs/ directory.
module.exports = {
  skipDownload: true,
};
