// declare sass module
declare module "*.module.scss" {
  const content: { [className: string]: string };
  export = content;
}
