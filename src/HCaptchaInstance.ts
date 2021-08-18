import { IhCaptchaInstance } from './interface/IhCaptchaInstance'

/**
 * A simple wrapper for the "grecaptcha" object.
 *
 * Currently only wraps the "execute" function.
 */
export class HCaptchaInstance {
    private readonly siteKey: string
    private readonly recaptchaID: string
    private readonly recaptcha: IhCaptchaInstance

    public constructor (siteKey: string, recaptchaID: string, recaptcha: IhCaptchaInstance) {
      this.siteKey = siteKey
      this.recaptchaID = recaptchaID
      this.recaptcha = recaptcha
    }

    /**
     * Will execute the recaptcha with the given action.
     *
     * @param action The action to execute with.
     */
    public async execute (onload?: string, render?: string, hl?: string, recaptchacompat?: string): Promise<string> {
      return this.recaptcha.execute(this.recaptchaID, { onload, render, hl, recaptchacompat })
    }

    /**
     * Will return the site key, with which the reCAPTCHA
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