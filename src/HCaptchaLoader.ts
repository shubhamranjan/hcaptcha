import { IhCaptchaInstance } from './interface/IhCaptchaInstance'
import { IRenderParameters } from './interface/IRenderParameters'
import { HCaptchaInstance } from './HCaptchaInstance'
import { IhCaptchaLoaderOptions } from './interface/IhCaptchaLoaderOptions'
import { IhCaptchaExplicitRenderParameters } from './interface/IhCaptchaExplicitRenderParameters'

enum ELoadingState {
    NOT_LOADED,
    LOADING,
    LOADED,
}

/**
 * This is a loader which takes care about loading the
 * official hcaptcha script (https://js.hcaptcha.com/1/api.js).
 *
 * The main method {@link HCaptchaLoader#load(siteKey: string)} also
 * prevents loading the hCaptcha script multiple times.
 */
class HCaptchaLoader {
    private static loadingState: ELoadingState | null = null
    private static instance: HCaptchaInstance | null = null
    private static instanceSiteKey: string | null = null

    private static successfulLoadingConsumers: Array<(instance: HCaptchaInstance) => void> = []
    private static errorLoadingRunnable: Array<(reason: Error) => void> = []

    private static readonly SCRIPT_LOAD_DELAY = 25

    /**
     * Loads the hCaptcha library with the given site key.
     *
     * @param siteKey The site key to load the library with.
     * @param options The options for the loader
     * @return The hCaptcha wrapper.
     */
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    public static load (siteKey: string, options: IhCaptchaLoaderOptions = {}): Promise<HCaptchaInstance> {
      // Browser environment
      if (typeof document === 'undefined') {
        return Promise.reject(new Error('This is a library for the browser!'))
      }

      // Check if hcaptcha is already registered.
      if (HCaptchaLoader.getLoadingState() === ELoadingState.LOADED) {
        // Check if the site key is equal to the already loaded instance
        if (HCaptchaLoader.instance?.getSiteKey() === siteKey) {
          // Resolve existing instance
          return Promise.resolve(HCaptchaLoader.instance)
        } else {
          // Reject because site keys are different
          return Promise.reject(new Error('hCaptcha already loaded with different site key!'))
        }
      }

      // If the hCaptcha is loading add this loader to the queue.
      if (HCaptchaLoader.getLoadingState() === ELoadingState.LOADING) {
        // Check if the site key is equal to the current loading site key
        if (siteKey !== HCaptchaLoader.instanceSiteKey) {
          return Promise.reject(new Error('hCaptcha already loading with different site key!'))
        }

        return new Promise<HCaptchaInstance>((resolve, reject) => {
          HCaptchaLoader.successfulLoadingConsumers.push((instance: HCaptchaInstance) => resolve(instance))
          HCaptchaLoader.errorLoadingRunnable.push((reason: Error) => reject(reason))
        })
      }

      // Set states
      HCaptchaLoader.instanceSiteKey = siteKey
      HCaptchaLoader.setLoadingState(ELoadingState.LOADING)

      // Throw error if the hCaptcha is already loaded
      const loader = new HCaptchaLoader()
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        loader.loadScript(options.renderParameters ? options.renderParameters : {}, options.customUrl).then(() => {
          HCaptchaLoader.setLoadingState(ELoadingState.LOADED)

          
          // Render the hCaptcha widget.
          const widgetID = loader.doExplicitRender(hcaptcha, siteKey, options.explicitRenderParameters ? options.explicitRenderParameters : {})
          const instance = new HCaptchaInstance(siteKey, widgetID, hcaptcha)
          HCaptchaLoader.successfulLoadingConsumers.forEach((v) => v(instance))
          HCaptchaLoader.successfulLoadingConsumers = []

          HCaptchaLoader.instance = instance
          resolve(instance)
        }).catch((error) => {
          HCaptchaLoader.errorLoadingRunnable.forEach((v) => v(error))
          HCaptchaLoader.errorLoadingRunnable = []
          reject(error)
        })
      })
    }

    public static getInstance (): HCaptchaInstance | null {
      return HCaptchaLoader.instance
    }

    /**
     * Will set the loading state of the hCaptcha script.
     *
     * @param state New loading state for the loading process.
     */
    private static setLoadingState (state: ELoadingState): void {
      HCaptchaLoader.loadingState = state
    }

    /**
     * Will return the current loading state. If no loading state is globally set
     * the NO_LOADED state is set as default.
     */
    private static getLoadingState (): ELoadingState {
      if (HCaptchaLoader.loadingState === null) {
        return ELoadingState.NOT_LOADED
      } else {
        return HCaptchaLoader.loadingState
      }
    }

    /**
     * The actual method that loads the script.
     * This method will create a new script element
     * and append it to the "<head>" element.
     *
     * @param renderParameters Additional parameters for hCaptcha.
     * @param customUrl If the loader custom URL insted of the official hCaptcha URLs
     */
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    private loadScript (renderParameters: { [key: string]: string | undefined } = {}, customUrl = ''): Promise<HTMLScriptElement> {
      // Create script element
      const scriptElement: HTMLScriptElement = document.createElement('script')
      scriptElement.setAttribute('hCaptcha-script', '')
      scriptElement.setAttribute('async', '')
      scriptElement.setAttribute('defer', '')

      let scriptBase = 'https://js.hcaptcha.com/1/api.js'

      if (customUrl) {
        scriptBase = customUrl
      }

      // Remove the 'render' property.
      if (renderParameters.render) {
        renderParameters.render = undefined
      }

      // Build parameter query string
      const parametersQuery = this.buildQueryString(renderParameters)

      scriptElement.src = scriptBase + parametersQuery

      return new Promise<HTMLScriptElement>((resolve, reject) => {
        scriptElement.addEventListener('load', this.waitForScriptToLoad(() => {
          resolve(scriptElement)
        }), false)
        scriptElement.onerror = (error): void => {
          HCaptchaLoader.setLoadingState(ELoadingState.NOT_LOADED)
          reject(error)
        }
        document.head.appendChild(scriptElement)
      })
    }

    /**
     * Will build a query string from the given parameters and return
     * the built string. If parameters has no keys it will just return
     * an empty string.
     *
     * @param parameters Object to build query string from.
     */
    private buildQueryString (parameters: { [key: string]: string | undefined }): string {
      const parameterKeys = Object.keys(parameters)

      // If there are no parameters just return an empty string.
      if (parameterKeys.length < 1) {
        return ''
      }

      // Build the actual query string (KEY=VALUE).
      return '?' + Object.keys(parameters)
        .filter((parameterKey) => {
          return !!parameters[parameterKey]
        })
        .map((parameterKey) => {
          return parameterKey + '=' + parameters[parameterKey]
        }).join('&')
    }

    /**
     * Sometimes the library does not directly load
     * after the "onload" event, therefore we wait
     * here until "hcaptcha" is available.
     *
     * @param callback Callback to call after the library
     * has been loaded successfully.
     */
    private waitForScriptToLoad (callback: () => void) {
      return (): void => {
        if (window.hcaptcha === undefined) {
          setTimeout(() => {
            this.waitForScriptToLoad(callback)
          }, HCaptchaLoader.SCRIPT_LOAD_DELAY)
        } else {
            callback()
        }
      }
    }

    /**
     * Will render explicitly render the hCaptcha.
     * @param hcaptcha The hCaptcha instance to use for the rendering.
     * @param siteKey The sitekey to render.
     * @param parameters The parameters for the rendering process.
     * @return The id of the rendered widget.
     */
    private doExplicitRender (hcaptcha: IhCaptchaInstance, siteKey: string, parameters: IhCaptchaExplicitRenderParameters): string {
      // Split the given parameters into a matching interface for the hcaptcha.render function.
      const augmentedParameters: IRenderParameters = {
        sitekey: siteKey,
        theme: parameters.theme,
        size: parameters.size
      }

      // Differ if an explicit container element is given.
      if (parameters.container) {
        return hcaptcha.render(parameters.container, augmentedParameters)
      } else {
        return hcaptcha.render(augmentedParameters)
      }
    }
}

/**
 * Only export the hCaptcha load and getInstance method to
 * avoid confusion with the class constructor.
 */
export const load = HCaptchaLoader.load
export const getInstance = HCaptchaLoader.getInstance
