import { IRenderParameters } from './IRenderParameters'
export interface IhCaptchaInstance {
  /**
   * Will execute the hCaptcha using the given SiteKey and the given options.
   * @param widgetID The hCaptcha widgetID.
   */
  execute(widgetID: string): void;

  /**
   * Gets the response for the hCaptcha widget with widgetID.
   * @param widgetID Optional unique ID for a widget. Defaults to first widget created.
   */
  getResponse(widgetID: string): string;
  
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
