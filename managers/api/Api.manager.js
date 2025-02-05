const getParamNames = require("./_common/getParamNames");
/**
 * scans all managers for exposed methods
 * and makes them available through a handler middleware
 */

module.exports = class ApiHandler {
  constructor({ config, cortex, cache, managers, mwsRepo, prop }) {
    this.config = config;
    this.cache = cache;
    this.cortex = cortex;
    this.managers = managers;
    this.mwsRepo = mwsRepo;
    this.mwsExec = this.managers.mwsExec;
    this.prop = prop;
    this.exposed = {};
    this.methodMatrix = {};
    this.auth = {};
    this.fileUpload = {};
    this.mwsStack = {};
    this.mw = this.mw.bind(this);

    /** filter only the modules that have interceptors */
    Object.keys(this.managers).forEach((mk) => {
      if (this.managers[mk][this.prop]) {
        this.methodMatrix[mk] = {};
        this.managers[mk][this.prop].forEach((i) => {
          let method = "post";
          let fnName = i;
          let middleware = [];

          if (i.includes("=")) {
            const frags = i.split("=");
            method = frags[0];
            fnName = frags[1].split(" ")[0];
            middleware = frags[1].split(" ").slice(1);
          }
          //{'school':{"post":["createSchool"]}}
          if (!this.methodMatrix[mk][method]) {
            this.methodMatrix[mk][method] = [];
          }
          this.methodMatrix[mk][method].push(fnName);
          //{"school".createSchool":"__auth"}
          // Assign middleware to the specific manager and function
          this.mwsStack[`${mk}.${fnName}`] = middleware;
        });
      }
    });

    /** expose apis through cortex */
    Object.keys(this.managers).forEach((mk) => {
      if (this.managers[mk].interceptor) {
        this.exposed[mk] = this.managers[mk];
      }
    });

    this.cortex.sub("*", (d, meta, cb) => {
      let [moduleName, fnName] = meta.event.split(".");
      let targetModule = this.exposed[moduleName];
      if (!targetModule) return cb({ error: `module ${moduleName} not found` });
      try {
        targetModule.interceptor({ data: d, meta, cb, fnName });
      } catch (err) {
        cb({ error: `failed to execute ${fnName}` });
      }
    });
  }

  async _exec({ targetModule, fnName, data }) {
    let result = {};

    try {
      result = await targetModule[`${fnName}`](data);
    } catch (err) {
      console.error(`Error in ${fnName}:`, err);
      result = {
        error: err.message || `${fnName} failed to execute`,
        statusCode: err.statusCode || 500,
      };
    }

    return result;
  }

  async mw(req, res, next) {
    let method = req.method.toLowerCase();
    let moduleName = req.params.moduleName;
    let fnName = req.params.fnName;
    let moduleMatrix = this.methodMatrix[moduleName];

    /** validate module */
    if (!moduleMatrix) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        message: `Module '${moduleName}' not found. Available modules: ${Object.keys(
          this.methodMatrix
        ).join(", ")}`,
        statusCode: 404,
      });
    }

    /** validate method */
    if (!moduleMatrix[method]) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        message: `Unsupported method '${method}' for module '${moduleName}'`,
        statusCode: 405,
      });
    }

    /** validate function */
    if (!moduleMatrix[method].includes(fnName)) {
      return this.managers.responseDispatcher.dispatch(res, {
        ok: false,
        message: `Function '${fnName}' not found in module '${moduleName}' for method '${method}'`,
        statusCode: 404,
      });
    }

    /** execute middleware stack */
    const targetStack = this.mwsStack[`${moduleName}.${fnName}`];
    const hotBolt = this.mwsExec.createBolt({
      stack: targetStack,
      req,
      res,
      onError: (err) => {
        console.error(`Middleware error:`, err);
        return this.managers.responseDispatcher.dispatch(res, {
          ok: false,
          message: err.message || "Middleware error",
          statusCode: err.statusCode || 500,
        });
      },
      onDone: async ({ req, res, results }) => {
        let body = req.body || {};
        let result = await this._exec({
          targetModule: this.managers[moduleName],
          fnName,
          data: {
            ...req.query,
            ...body,
            ...results,
            res,
          },
        });

        if (!result.selfHandleResponse) {
          if (result.errors) {
            return this.managers.responseDispatcher.dispatch(res, {
              ok: false,
              errors: result.errors,
              statusCode: result.statusCode || 400,
            });
          } else if (result.error) {
            return this.managers.responseDispatcher.dispatch(res, {
              ok: false,
              message: result.error,
              statusCode: result.statusCode || 500,
            });
          } else {
            return this.managers.responseDispatcher.dispatch(res, {
              ok: true,
              data: result,
              statusCode: 200,
            });
          }
        }
      },
    });

    hotBolt.run();
  }
};

/**
 * scans all managers for exposed methods
 * and makes them available through a handler middleware
 */
