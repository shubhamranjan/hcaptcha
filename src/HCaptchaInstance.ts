import { IhCaptchaInstance } from './interface/IhCaptchaInstance'

/**
 * A simple wrapper for the "imhcaptcha" object.
 *
 * Currently only wraps the "execute" function.
 */
export class HCaptchaInstance {
    private readonly siteKey: string
    private readonly hCaptchaID: string
    private readonly hCaptcha: IhCaptchaInstance

    public constructor (siteKey: string, hCaptchaID: string, hcaptcha: IhCaptchaInstance) {
      this.siteKey = siteKey
      this.hCaptchaID = hCaptchaID
      this.hCaptcha = hcaptcha
    }

    /**
     * Will execute the hcaptcha with the given action.
     *
     * @param action The action to execute with.
     */
    public async execute (onload?: string, render?: string, hl?: string,hCaptchacompat?: string): Promise<string> {
      console.log(this.hCaptchaID, onload, render, hl, hCaptchacompat )
      return this.hCaptcha.execute(this.hCaptchaID, { onload, render, hl, hCaptchacompat })
    }

    /**
     * Will return the site key, with which the hCaptcha
     * has been initialized.
     */
    public getSiteKey (): string {
      return this.siteKey
    }
}

declare global {
  const hcaptcha: IhCaptchaInstance

  interface Window {
    hcaptcha: IhCaptchaInstance;
  }
}