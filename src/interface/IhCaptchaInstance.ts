import { IExecuteOptions } from './IExecuteOptions'
import { IRenderParameters } from './IRenderParameters'
export interface IhCaptchaInstance {
  ready(callback: () => void): void;

  /**
   * Will execute the hCaptcha using the given SiteKey and the given options.
   * @param siteKey The hCaptcha SiteKey.
   * @param options The options for the execution. (Only known property is "action")
   */
  execute(siteKey: string, options: IExecuteOptions): Promise<string>;

  /**
   * Will render the hCaptcha widget into the given container with the given parameters. This render function is
   * useful when using `badge: 'inline'`, which lets you render the hCaptcha widget into the given container and
   * let's you style it with CSS by yourself.
   *
   * @param container The container into which the widget shall be rendered.
   * @param parameters The rendering parameters for the widget.
   */
  render(container: string | Element, parameters: IRenderParameters): string;

  /**
   * Will render the hCaptcha widget using the given parameters. Using the parameters, you can control the
   * positioning, etc. for the widget.
   *
   * @param parameters The rendering parameters for the widget.
   */
  render(parameters: IRenderParameters): string;
}
