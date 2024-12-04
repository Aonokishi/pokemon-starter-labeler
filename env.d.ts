declare module "bun" {
  interface Env {
    LABELER_DID: string;
    LABELER_PWD: string;
    LABELER_KEY: string;
    LABELER_DSN: string;
  }
}
