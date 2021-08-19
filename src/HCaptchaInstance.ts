import { IhCaptchaInstance } from './interface/IhCaptchaInstance'

/**
 * A simple wrapper for the "imhcaptcha" object.
 *
 * Currently only wraps the "execute" function.
 */
export class HCaptchaInstance {
  private readonly siteKey: string
  private readonly hwidgetID: string
  private readonly hCaptcha: IhCaptchaInstance

  public constructor(siteKey: string, hwidgetID: string, hcaptcha: IhCaptchaInstance) {
    this.siteKey = siteKey
    this.hwidgetID = hwidgetID
    this.hCaptcha = hcaptcha
  }

  /**
   * Will execute the hcaptcha with the given action.
   */
  public async execute(): Promise<void> {
    return this.hCaptcha.execute(this.hwidgetID)
  }

  /**
* Will execute the hcaptcha with the given action.
*/
  public async getResponse(): Promise<string> {
    return this.hCaptcha.getResponse(this.hwidgetID)
  }


  /**
   * Will return the site key, with which the hCaptcha
   * has been initialized.
   */
  public getSiteKey(): string {
    return this.siteKey
  }
}

declare global {
  const hcaptcha: IhCaptchaInstance

  interface Window {
    hcaptcha: IhCaptchaInstance;
  }
}