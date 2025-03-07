import "pinia"

declare module "pinia" {
  // 为 persist 配置添加类型定义
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: boolean | PersistedStateOptions
  }
}
