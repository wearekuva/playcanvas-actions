/******/ var __webpack_modules__ = ({

/***/ 976:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 570:
/***/ ((module) => {

module.exports = eval("require")("adm-zip");


/***/ }),

/***/ 56:
/***/ ((module) => {

module.exports = eval("require")("arraybuffer-to-buffer");


/***/ }),

/***/ 760:
/***/ ((module) => {

module.exports = eval("require")("axios");


/***/ }),

/***/ 628:
/***/ ((__webpack_module__, __unused_webpack___webpack_exports__, __nccwpck_require__) => {

__nccwpck_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__) => {
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(976);
/* harmony import */ var _playcanvas_js__WEBPACK_IMPORTED_MODULE_1__ = __nccwpck_require__(159);



try {

    // Define your donwload requirements
    const opts = {
        project_id: parseInt(_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('project-id')),
        name: _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('name') || `playcanvas - ${_actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('project-id')}`,
        scenes: _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('scenes'),
        version: _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('version'),
        branch: _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('branch'),
        concatenateScripts: _actions_core__WEBPACK_IMPORTED_MODULE_0__.getBooleanInput('concatenate-scripts'),
        minifyScripts: _actions_core__WEBPACK_IMPORTED_MODULE_0__.getBooleanInput('minify-scripts'),
        optimizeSceneFormat: _actions_core__WEBPACK_IMPORTED_MODULE_0__.getBooleanInput('optimize-scene-format'),
        
    }
    
    const excludes = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getBooleanInput('excludeIndex')

    // Get the PC access token
    const token = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('playcanvas-access-token')

    // Download the app
    const { name, file, version } = await (0,_playcanvas_js__WEBPACK_IMPORTED_MODULE_1__/* .download */ .LR)(opts, token )
    
    if(excludeIndex) file.deleteFile(file.getEntry('./index.js'))

    // Save the files to the local system
    file.extractAllTo("./", true)

    _actions_core__WEBPACK_IMPORTED_MODULE_0__.setOutput('name', name)
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.setOutput('version', version)
    // core.setOutput('path', path);

} catch (error) {

    _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed(error.message);

}

__webpack_handle_async_dependencies__();
}, 1);

/***/ }),

/***/ 159:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __nccwpck_require__) => {


// EXPORTS
__nccwpck_require__.d(__webpack_exports__, {
  "LR": () => (/* binding */ download)
});

// UNUSED EXPORTS: getBranch, getLatestVersion, getPrimaryApp, listAssets, listBranches, listScenes, pollJob

;// CONCATENATED MODULE: ./utils.js
async function poll (fn, fnCondition, ms) {
    let result = await fn()
    while (fnCondition(result)) {
      await wait(ms)
      result = await fn()
    }
    return result
  }
  
  function wait (ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
// EXTERNAL MODULE: C:\Users\Mark Kuva\AppData\Roaming\npm\node_modules\@vercel\ncc\dist\ncc\@@notfound.js?axios
var C_Users_Mark_Kuva_AppData_Roaming_npm_node_modules_vercel_ncc_dist_ncc_notfoundaxios = __nccwpck_require__(760);
// EXTERNAL MODULE: C:\Users\Mark Kuva\AppData\Roaming\npm\node_modules\@vercel\ncc\dist\ncc\@@notfound.js?arraybuffer-to-buffer
var C_Users_Mark_Kuva_AppData_Roaming_npm_node_modules_vercel_ncc_dist_ncc_notfoundarraybuffer_to_buffer = __nccwpck_require__(56);
// EXTERNAL MODULE: C:\Users\Mark Kuva\AppData\Roaming\npm\node_modules\@vercel\ncc\dist\ncc\@@notfound.js?adm-zip
var C_Users_Mark_Kuva_AppData_Roaming_npm_node_modules_vercel_ncc_dist_ncc_notfoundadm_zip = __nccwpck_require__(570);
;// CONCATENATED MODULE: ./playcanvas.js





// const TOKEN = process.env.PC_TOKEN
// const PROJECT_ID = Number(process.env.PC_PROJECT_ID)
// const CONFIG = { headers: { Authorization: `Bearer ${TOKEN}` } }
const PC_API_ROOT = 'https://playcanvas.com/api'

const asData = ({ data }) => data
const listBranches = async ({ conf, project_id}) =>
  C_Users_Mark_Kuva_AppData_Roaming_npm_node_modules_vercel_ncc_dist_ncc_notfoundaxios.get(`${PC_API_ROOT}/projects/${project_id}/branches`, conf).then(asData)

const listScenes = async ({ project_id, conf }) =>
  C_Users_Mark_Kuva_AppData_Roaming_npm_node_modules_vercel_ncc_dist_ncc_notfoundaxios.get(`${PC_API_ROOT}/projects/${project_id}/scenes`, conf).then(asData).then(({ result }) => result)

const getPrimaryApp = async ({ project_id, conf }) =>
  axios.get(`${PC_API_ROOT}/projects/${project_id}/app`, conf).then(asData)

const listAssets = async ({ project_id, conf}) =>
  axios.get(`${PC_API_ROOT}/projects/${project_id}/assets`, conf).then(asData)

const pollJob = async (jobId, conf) => C_Users_Mark_Kuva_AppData_Roaming_npm_node_modules_vercel_ncc_dist_ncc_notfoundaxios.get(`${PC_API_ROOT}/jobs/${jobId}`, conf).then(asData)

const getBranch = async opts => {
    let optsDefaultBranch = { branch : 'master', ...opts }
    const { result } = await listBranches(optsDefaultBranch)
    return result.filter(({ name }) => name === optsDefaultBranch.branch)[0]
}

const getLatestVersion = async opts => {
  const { latestCheckpointId } = await getBranch(opts)
  const checkpoint = latestCheckpointId.split('-')[0]
  return checkpoint
}

const download = ( opts, token ) => {

    return new Promise(async (resolve, reject) => {

        if(!token) throw new Error(`'Token' is undefined`)

        const conf = { headers: { Authorization: `Bearer ${token}` } }
        
        opts.version = opts.version || await getLatestVersion({ ...opts, conf })
        opts.scenes = opts.scenes ? opts.scenes.split(', ') : (await listScenes({ ...opts, conf })).map(({ id }) => id)//.join(',')

        console.log(opts)
        const { id } = await C_Users_Mark_Kuva_AppData_Roaming_npm_node_modules_vercel_ncc_dist_ncc_notfoundaxios.post(`${PC_API_ROOT}/apps/download`, opts, conf)
            .then(asData)

        if (id) {
            console.log('Creating build...', id)
            const validateDownload = ({ status }) => status !== 'complete'
            const { download_url } = await poll(async _ => pollJob(id, conf), validateDownload, 1000).then(asData)
            console.log('Downloading build...', opts.version, download_url)

            const data = await C_Users_Mark_Kuva_AppData_Roaming_npm_node_modules_vercel_ncc_dist_ncc_notfoundaxios.get(download_url, { responseType: 'arraybuffer' }).then(asData)
            const buffer = C_Users_Mark_Kuva_AppData_Roaming_npm_node_modules_vercel_ncc_dist_ncc_notfoundarraybuffer_to_buffer(data)
            const file = new C_Users_Mark_Kuva_AppData_Roaming_npm_node_modules_vercel_ncc_dist_ncc_notfoundadm_zip(buffer)
            console.log('Download Complete')
            
            resolve({ ...opts, file })
        }
    })
}

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/async module */
/******/ (() => {
/******/ 	var webpackThen = typeof Symbol === "function" ? Symbol("webpack then") : "__webpack_then__";
/******/ 	var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 	var completeQueue = (queue) => {
/******/ 		if(queue) {
/******/ 			queue.forEach((fn) => (fn.r--));
/******/ 			queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 		}
/******/ 	}
/******/ 	var completeFunction = (fn) => (!--fn.r && fn());
/******/ 	var queueFunction = (queue, fn) => (queue ? queue.push(fn) : completeFunction(fn));
/******/ 	var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 		if(dep !== null && typeof dep === "object") {
/******/ 			if(dep[webpackThen]) return dep;
/******/ 			if(dep.then) {
/******/ 				var queue = [];
/******/ 				dep.then((r) => {
/******/ 					obj[webpackExports] = r;
/******/ 					completeQueue(queue);
/******/ 					queue = 0;
/******/ 				});
/******/ 				var obj = {};
/******/ 											obj[webpackThen] = (fn, reject) => (queueFunction(queue, fn), dep['catch'](reject));
/******/ 				return obj;
/******/ 			}
/******/ 		}
/******/ 		var ret = {};
/******/ 							ret[webpackThen] = (fn) => (completeFunction(fn));
/******/ 							ret[webpackExports] = dep;
/******/ 							return ret;
/******/ 	}));
/******/ 	__nccwpck_require__.a = (module, body, hasAwait) => {
/******/ 		var queue = hasAwait && [];
/******/ 		var exports = module.exports;
/******/ 		var currentDeps;
/******/ 		var outerResolve;
/******/ 		var reject;
/******/ 		var isEvaluating = true;
/******/ 		var nested = false;
/******/ 		var whenAll = (deps, onResolve, onReject) => {
/******/ 			if (nested) return;
/******/ 			nested = true;
/******/ 			onResolve.r += deps.length;
/******/ 			deps.map((dep, i) => (dep[webpackThen](onResolve, onReject)));
/******/ 			nested = false;
/******/ 		};
/******/ 		var promise = new Promise((resolve, rej) => {
/******/ 			reject = rej;
/******/ 			outerResolve = () => (resolve(exports), completeQueue(queue), queue = 0);
/******/ 		});
/******/ 		promise[webpackExports] = exports;
/******/ 		promise[webpackThen] = (fn, rejectFn) => {
/******/ 			if (isEvaluating) { return completeFunction(fn); }
/******/ 			if (currentDeps) whenAll(currentDeps, fn, rejectFn);
/******/ 			queueFunction(queue, fn);
/******/ 			promise['catch'](rejectFn);
/******/ 		};
/******/ 		module.exports = promise;
/******/ 		body((deps) => {
/******/ 			if(!deps) return outerResolve();
/******/ 			currentDeps = wrapDeps(deps);
/******/ 			var fn, result;
/******/ 			var promise = new Promise((resolve, reject) => {
/******/ 				fn = () => (resolve(result = currentDeps.map((d) => (d[webpackExports]))));
/******/ 				fn.r = 0;
/******/ 				whenAll(currentDeps, fn, reject);
/******/ 			});
/******/ 			return fn.r ? promise : result;
/******/ 		}).then(outerResolve, reject);
/******/ 		isEvaluating = false;
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__nccwpck_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module used 'module' so it can't be inlined
/******/ var __webpack_exports__ = __nccwpck_require__(628);
/******/ __webpack_exports__ = await __webpack_exports__;
/******/ 
