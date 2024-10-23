/*
 This will apply definition to all "yml" files.
 In case of multiple YAML files, this approach should be revisited.
*/
declare module "*.yml" {
  export default [VerbDetails]
}