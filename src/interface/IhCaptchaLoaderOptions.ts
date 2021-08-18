import { IhCaptchaExplicitRenderParameters } from './IhCaptchaExplicitRenderParameters'
/**
 * An interface for all available options for the
 * hCAPTCHA loader.
 */
export interface IhCaptchaLoaderOptions {

    /**
     * Defines additional parameters for the rendering process.
     * The parameters should be defined as key/value pair.
     *
     * Known possible parameters:
     * `hl` -> Will set the language of the badge.
     */
    renderParameters?: { [key: string]: string };

      /**
   * Defines the additional parameters for the explicit rendering process.
   */
  explicitRenderParameters?: IhCaptchaExplicitRenderParameters;

    /**
     * Defines a custom url for ReCaptcha JS file.
     * Useful when self hosting or proxied ReCaptcha JS file.
     */
    customUrl?: string;
}
